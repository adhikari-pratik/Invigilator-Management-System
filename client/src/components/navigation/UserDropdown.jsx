import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const UserDropdown = ({ user, onLogout }) => {
	return (
		<Menu as="div" className="ml-3 relative">
			<div>
				<Menu.Button className="bg-white dark:bg-secondary-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800">
					<span className="sr-only">Open user menu</span>
					<div className="flex items-center">
						{user.profileImage ? (
							<img
								className="h-8 w-8 rounded-full"
								src={user.profileImage}
								alt={user.fullName}
							/>
						) : (
							<UserCircleIcon className="h-8 w-8 text-gray-400" />
						)}
						<span className="hidden md:flex md:items-center">
							<span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
								{user.fullName}
							</span>
							<ChevronDownIcon className="h-4 w-4 text-gray-400" />
						</span>
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
			>
				<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-700 ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
					<Menu.Item>
						{({ active }) => (
							<div className="px-4 py-2 border-b border-gray-100 dark:border-secondary-600">
								<p className="text-sm font-medium text-gray-900 dark:text-white">
									{user.fullName}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									{user.email}
								</p>
							</div>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link
								to="/profile"
								className={classNames(
									active ? "bg-gray-100 dark:bg-secondary-600" : "",
									"block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
								)}
							>
								Your Profile
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link
								to="/settings"
								className={classNames(
									active ? "bg-gray-100 dark:bg-secondary-600" : "",
									"block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
								)}
							>
								Settings
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<button
								onClick={onLogout}
								className={classNames(
									active ? "bg-gray-100 dark:bg-secondary-600" : "",
									"block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
								)}
							>
								Sign out
							</button>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default UserDropdown;
