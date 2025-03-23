import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import {
	fetchUnreadNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	selectUnreadNotifications,
} from "../../features/notifications/notificationSlice";

const NotificationsDropdown = ({ unreadCount = 0 }) => {
	const dispatch = useDispatch();
	const unreadNotifications = useSelector(selectUnreadNotifications);
	const [isOpen, setIsOpen] = useState(false);

	const handleMarkAsRead = (id) => {
		dispatch(markNotificationAsRead(id));
	};

	const handleMarkAllAsRead = () => {
		dispatch(markAllNotificationsAsRead());
	};

	useEffect(() => {
		if (isOpen) {
			dispatch(fetchUnreadNotifications());
		}
	}, [isOpen, dispatch]);

	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button
					onClick={() => setIsOpen(true)}
					className="bg-white dark:bg-secondary-700 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800"
				>
					<span className="sr-only">View notifications</span>
					<div className="relative">
						<BellIcon className="h-6 w-6" aria-hidden="true" />
						{unreadCount > 0 && (
							<span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white">
								{unreadCount > 99 ? "99+" : unreadCount}
							</span>
						)}
					</div>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
				afterLeave={() => setIsOpen(false)}
			>
				<Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-secondary-800 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-secondary-700">
					<div className="px-4 py-3 flex items-center justify-between">
						<h3 className="text-sm font-medium text-gray-900 dark:text-white">
							Notifications
						</h3>
						{unreadCount > 0 && (
							<button
								onClick={handleMarkAllAsRead}
								className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
							>
								Mark all as read
							</button>
						)}
					</div>

					<div className="max-h-60 overflow-y-auto py-2">
						{unreadNotifications && unreadNotifications.length > 0 ? (
							unreadNotifications.map((notification) => (
								<Menu.Item key={notification.id}>
									{({ active }) => (
										<div
											className={`${
												active ? "bg-gray-100 dark:bg-secondary-700" : ""
											} px-4 py-2 cursor-pointer`}
											onClick={() => handleMarkAsRead(notification.id)}
										>
											<div className="flex justify-between">
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{notification.title}
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{format(
														new Date(notification.createdAt),
														"MMM d, h:mm a"
													)}
												</p>
											</div>
											<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
												{notification.message}
											</p>
										</div>
									)}
								</Menu.Item>
							))
						) : (
							<div className="px-4 py-4 text-center">
								<p className="text-sm text-gray-500 dark:text-gray-400">
									No new notifications
								</p>
							</div>
						)}
					</div>

					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={`${
										active ? "bg-gray-100 dark:bg-secondary-700" : ""
									} block px-4 py-2 text-sm text-center text-primary-600 dark:text-primary-400`}
								>
									View all notifications
								</a>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default NotificationsDropdown;
