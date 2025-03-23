import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import userReducer from './users/userSlice';
import examReducer from './exams/examSlice';
import classroomReducer from './classrooms/classroomSlice';
import assignmentReducer from './assignments/assignmentSlice';
import notificationReducer from './notifications/notificationSlice';
import settingsReducer from './settings/settingsSlice';
import statsReducer from './stats/statsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    exams: examReducer,
    classrooms: classroomReducer,
    assignments: assignmentReducer,
    notifications: notificationReducer,
    settings: settingsReducer,
    stats: statsReducer,
  },
});