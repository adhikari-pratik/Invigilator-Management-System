import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAdmin } from '../../features/auth/authSlice';
import { fetchUnreadNotifications } from '../../features/notifications/notificationSlice';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import Footer from '../navigation/Footer';

const Layout = () => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch unread notifications when the layout mounts
    dispatch(fetchUnreadNotifications());
    
    // Set up interval to fetch notifications periodically (every 2 minutes)
    const intervalId = setInterval(() => {
      dispatch(fetchUnreadNotifications());
    }, 2 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-secondary-900">
      {/* Sidebar for mobile */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isAdmin={isAdmin} />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;