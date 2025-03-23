import React from "react";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-white dark:bg-secondary-800 shadow">
			<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
				<div className="mt-2 md:mt-0 md:order-1">
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						&copy; {currentYear} Invigilator Management System. All rights
						reserved.
					</p>
				</div>
				<div className="mt-2 md:mt-0 md:order-2">
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						Made with ❤️ for efficient exam management
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
