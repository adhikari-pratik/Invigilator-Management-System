import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import {
	toggleDarkMode,
	selectDarkMode,
} from "../features/settings/settingsSlice";

const SettingsPage = () => {
	const dispatch = useDispatch();
	const darkMode = useSelector(selectDarkMode);

	const handleToggleTheme = () => {
		dispatch(toggleDarkMode());
	};

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Settings
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Customize your application preferences.
				</p>
			</div>

			<div className="card">
				<div className="card-header">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						Display Settings
					</h3>
				</div>
				<div className="card-body">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="text-base font-medium text-gray-900 dark:text-white">
								Theme
							</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Toggle between light and dark theme
							</p>
						</div>
						<button
							type="button"
							className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
								darkMode ? "bg-primary-600" : "bg-gray-200"
							}`}
							onClick={handleToggleTheme}
						>
							<span className="sr-only">Toggle theme</span>
							<span
								className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
									darkMode ? "translate-x-5" : "translate-x-0"
								}`}
							>
								{darkMode ? (
									<MoonIcon className="h-3 w-3 text-primary-600 m-1" />
								) : (
									<SunIcon className="h-3 w-3 text-yellow-500 m-1" />
								)}
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className="card mt-6">
				<div className="card-header">
					<h3 className="text-lg font-medium text-gray-900 dark:text-white">
						About
					</h3>
				</div>
				<div className="card-body">
					<div className="text-sm text-gray-600 dark:text-gray-400">
						<p>Invigilator Management System (IMS)</p>
						<p className="mt-1">Version 1.0.0</p>
						<p className="mt-1">
							© {new Date().getFullYear()} All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
