import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, selectAuth } from '../../features/auth/authSlice';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(selectAuth);

  const handleSubmit = async (values) => {
    const resultAction = await dispatch(login(values));
    if (login.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
        Sign in to your account
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-danger-100 text-danger-800 dark:bg-danger-800 dark:text-danger-100 rounded-md">
          {error}
        </div>
      )}

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <Field
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="form-input"
              />
              <ErrorMessage name="username" component="div" className="form-error" />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="form-input"
              />
              <ErrorMessage name="password" component="div" className="form-error" />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;