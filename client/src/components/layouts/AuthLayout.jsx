import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-secondary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center">
            <FaGraduationCap className="h-8 w-auto text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-primary-600">IMS</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Invigilator Management System
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-secondary-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;