import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import { selectDarkMode } from './features/settings/settingsSlice';
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/routes';
import Layout from './components/layouts/Layout';
import AuthLayout from './components/layouts/AuthLayout';
import { 
  LoginPage, 
  RegisterPage,
  DashboardPage,
  InvigilatorsPage,
  ExamsPage,
  ClassroomsPage,
  AssignmentsPage,
  MyAssignmentsPage,
  ProfilePage,
  SettingsPage,
  NotFoundPage,
  LandingPage,
} from './pages';

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectDarkMode);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Routes>
      {/* Public routes (no auth required) */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected routes (auth required) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/invigilators" element={<InvigilatorsPage />} />
            <Route path="/exams" element={<ExamsPage />} />
            <Route path="/classrooms" element={<ClassroomsPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
          </Route>

          {/* Invigilator routes */}
          <Route path="/my-assignments" element={<MyAssignmentsPage />} />
          <Route path="/exams-schedule" element={<ExamsPage readOnly />} />
        </Route>
      </Route>

      {/* Redirect from /home to /dashboard */}
      <Route path="/home" element={<Navigate to="/dashboard" replace />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;