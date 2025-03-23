import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	Bars3Icon,
	BellIcon,
	SunIcon,
	MoonIcon,
} from "@heroicons/react/24/outline";
import { logout, selectUser } from "../../features/auth/authSlice";
import {
	toggleDarkMode,
	selectDarkMode,
} from "../../features/settings/settingsSlice";
import { selectUnreadCount } from "../../features/notifications/notificationSlice";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import UserDropdown from "./UserDropdown";

const Header = ({ setSidebarOpen }) => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const darkMode = useSelector(selectDarkMode);
	const unreadCount = useSelector(selectUnreadCount);

	const handleLogout = () => {
		dispatch(logout());
	};

	const toggleTheme = () => {
		dispatch(toggleDarkMode());
	};

	return (
		<header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-secondary-800 shadow">
			<button
				type="button"
				className="px-4 border-r border-gray-200 dark:border-secondary-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
				onClick={() => setSidebarOpen(true)}
			>
				<span className="sr-only">Open sidebar</span>
				<Bars3Icon className="h-6 w-6" aria-hidden="true" />
			</button>
			<div className="flex-1 px-4 flex justify-between">
				<div className="flex-1 flex items-center">
					<Link to="/dashboard" className="text-xl font-bold text-primary-600">
						I<span className="text-white">nvigilator</span> M
						<span className="text-white">anagement</span> S
						<span className="text-white">ystem</span>{" "}
					</Link>
				</div>
				<div className="ml-4 flex items-center md:ml-6 space-x-4">
					{/* Dark Mode Toggle */}
					<button
						type="button"
						onClick={toggleTheme}
						className="bg-white dark:bg-secondary-700 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-secondary-800"
					>
						{darkMode ? (
							<SunIcon className="h-6 w-6" aria-hidden="true" />
						) : (
							<MoonIcon className="h-6 w-6" aria-hidden="true" />
						)}
						<span className="sr-only">Toggle theme</span>
					</button>

					{/* Notifications */}
					<NotificationsDropdown unreadCount={unreadCount} />

					{/* Profile dropdown */}
					<UserDropdown user={user} onLogout={handleLogout} />
				</div>
			</div>
		</header>
	);
};

export default Header;
