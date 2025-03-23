import React from "react";
import { NavLink } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
	XMarkIcon,
	HomeIcon,
	UserGroupIcon,
	CalendarIcon,
	ClipboardDocumentListIcon,
	BuildingOfficeIcon,
	UserIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { FaGraduationCap } from "react-icons/fa";

const adminNavigation = [
	{ name: "Dashboard", href: "dashboard", icon: HomeIcon },
	{ name: "Invigilators", href: "invigilators", icon: UserGroupIcon },
	{ name: "Exams", href: "exams", icon: CalendarIcon },
	{
		name: "Assignments",
		href: "assignments",
		icon: ClipboardDocumentListIcon,
	},
	{ name: "Classrooms", href: "classrooms", icon: BuildingOfficeIcon },
	{ name: "Profile", href: "profile", icon: UserIcon },
	{ name: "Settings", href: "settings", icon: Cog6ToothIcon },
];

const invigilatorNavigation = [
	{ name: "Dashboard", href: "dashboard", icon: HomeIcon },
	{
		name: "My Assignments",
		href: "my-assignments",
		icon: ClipboardDocumentListIcon,
	},
	{ name: "Exams Schedule", href: "exams-schedule", icon: CalendarIcon },
	{ name: "Profile", href: "profile", icon: UserIcon },
	{ name: "Settings", href: "settings", icon: Cog6ToothIcon },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, isAdmin }) => {
	const navigation = isAdmin ? adminNavigation : invigilatorNavigation;

	return (
		<>
			{/* Mobile sidebar */}
			<Transition.Root show={sidebarOpen} as={React.Fragment}>
				<Dialog
					as="div"
					className="fixed inset-0 flex z-40 lg:hidden"
					onClose={setSidebarOpen}
				>
					<Transition.Child
						as={React.Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>
					<Transition.Child
						as={React.Fragment}
						enter="transition ease-in-out duration-300 transform"
						enterFrom="-translate-x-full"
						enterTo="translate-x-0"
						leave="transition ease-in-out duration-300 transform"
						leaveFrom="translate-x-0"
						leaveTo="-translate-x-full"
					>
						<div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-secondary-800">
							<Transition.Child
								as={React.Fragment}
								enter="ease-in-out duration-300"
								enterFrom="opacity-0"
								enterTo="opacity-100"
								leave="ease-in-out duration-300"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<div className="absolute top-0 right-0 -mr-12 pt-2">
									<button
										type="button"
										className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										onClick={() => setSidebarOpen(false)}
									>
										<span className="sr-only">Close sidebar</span>
										<XMarkIcon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</button>
								</div>
							</Transition.Child>
							<div className="flex-shrink-0 flex items-center px-4">
								<FaGraduationCap className="h-8 w-auto text-primary-600" />
								<span className="ml-2 text-xl font-bold text-primary-600">
									IMS
								</span>
							</div>
							<div className="mt-5 flex-1 h-0 overflow-y-auto">
								<nav className="px-2">
									<div className="space-y-1">
										{navigation.map((item) => (
											<NavLink
												key={item.name}
												to={item.href}
												className={({ isActive }) =>
													isActive
														? "group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100"
														: "group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-secondary-700"
												}
												onClick={() => setSidebarOpen(false)}
											>
												<item.icon
													className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-300"
													aria-hidden="true"
												/>
												{item.name}
											</NavLink>
										))}
									</div>
								</nav>
							</div>
						</div>
					</Transition.Child>
					<div className="flex-shrink-0 w-14" aria-hidden="true">
						{/* Dummy element to force sidebar to shrink to fit close icon */}
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden lg:flex lg:flex-shrink-0">
				<div className="flex flex-col w-64">
					<div className="flex flex-col flex-grow bg-white dark:bg-secondary-800 pt-5 pb-4 overflow-y-auto">
						<div className="flex items-center flex-shrink-0 px-4">
							<FaGraduationCap className="h-8 w-auto text-primary-600" />
							<span className="ml-2 text-xl font-bold text-primary-600">
								IMS
							</span>
						</div>
						<div className="mt-5 flex-grow flex flex-col">
							<nav className="flex-1 px-2 space-y-1">
								{navigation.map((item) => (
									<NavLink
										key={item.name}
										to={item.href}
										className={({ isActive }) =>
											isActive
												? "group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100"
												: "group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-secondary-700"
										}
									>
										<item.icon
											className="mr-3 flex-shrink-0 h-6 w-6 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-300"
											aria-hidden="true"
										/>
										{item.name}
									</NavLink>
								))}
							</nav>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
