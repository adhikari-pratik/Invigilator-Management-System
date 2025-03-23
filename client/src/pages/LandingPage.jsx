import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaCalendar, FaUsersCog } from 'react-icons/fa';

const features = [
  {
    name: 'Efficient Assignment Management',
    description: 'Easily assign invigilators to exams and manage their responses in real-time.',
    icon: FaCalendar,
  },
  {
    name: 'Role-Based Access',
    description: 'Separate interfaces for administrators and invigilators with appropriate permissions.',
    icon: FaUsersCog,
  },
  {
    name: 'Real-Time Notifications',
    description: 'Keep everyone informed with instant notifications for assignments and updates.',
    icon: FaChalkboardTeacher,
  },
];

const LandingPage = () => {
  return (
    <div className="bg-white dark:bg-secondary-900">
      {/* Navigation */}
      <header className="bg-white dark:bg-secondary-900 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-6 flex items-center justify-between">
            <div className="flex items-center">
              <FaGraduationCap className="h-8 w-auto text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-600">IMS</span>
            </div>
            <div className="ml-10 space-x-4">
              <Link
                to="/login"
                className="inline-block bg-primary-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-primary-700"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-block bg-white dark:bg-secondary-800 py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-secondary-700"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <main>
        <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
          <div className="max-w-7xl mx-auto lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
                <div className="lg:py-24">
                  <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:mt-5 sm:text-6xl lg:mt-6">
                    <span className="block">Invigilator</span>
                    <span className="block text-primary-600">Management System</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    A comprehensive solution for efficiently managing invigilators in educational institutions. Streamline exam scheduling, assignments, and communication.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    <div className="sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                        >
                          Get Started
                        </Link>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <Link
                          to="/login"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                  <img
                    className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="https://tailwindui.com/img/component-images/cloud-illustration-indigo-400.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-12 bg-gray-50 dark:bg-secondary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                A better way to manage exams
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                Our system provides a comprehensive solution for managing invigilators and exam logistics.
              </p>
            </div>

            <div className="mt-10">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                {features.map((feature) => (
                  <div key={feature.name} className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
              &copy; {new Date().getFullYear()} Invigilator Management System. All rights reserved.
            </span>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400 dark:text-gray-500">
              <Link to="/" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Home
              </Link>
              <span className="mx-2">|</span>
              <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Login
              </Link>
              <span className="mx-2">|</span>
              <Link to="/register" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Register
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;