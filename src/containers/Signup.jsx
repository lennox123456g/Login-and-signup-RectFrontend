import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearAuthErrors } from '../actions/auth';

const Signup = () => {
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { isAuthenticated, error: authError, loading } = useSelector(state => state.auth);

  const [accountCreated, setAccountCreated] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    password: '',
    general: ''
  });

  const { first_name, last_name, email, password, re_password } = formData;

  // Clear auth errors when component mounts
  useEffect(() => {
    dispatch(clearAuthErrors());
  }, [dispatch]);

  // Handle auth errors from Redux
  useEffect(() => {
    if (authError) {
      setFormErrors(prev => ({
        ...prev,
        general: authError
      }));
      setIsLoading(false);
    }
  }, [authError]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear errors when user starts typing
    if (e.target.name === 'password' || e.target.name === 're_password') {
      setFormErrors(prev => ({ ...prev, password: '' }));
    }
    
    // Clear general error when user makes changes
    if (formErrors.general) {
      setFormErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Check if passwords match
    if (password !== re_password) {
      errors.password = 'Passwords do not match';
    }

    // Check password length
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Check for empty fields
    if (!first_name.trim()) {
      errors.general = 'First name is required';
    } else if (!last_name.trim()) {
      errors.general = 'Last name is required';
    } else if (!email.trim()) {
      errors.general = 'Email is required';
    } else if (!password.trim()) {
      errors.general = 'Password is required';
    }

    // Check email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.general = 'Please enter a valid email address';
    }

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({ password: '', general: '' });

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      // Use the updated function signature: (firstName, lastName, email, password, confirmPassword)
      await dispatch(signup(first_name, last_name, email, password, re_password));
      setAccountCreated(true);
    } catch (error) {
      console.error('Signup failed:', error);
      // Error will be handled by the useEffect for authError
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if authenticated
  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  // Redirect to login after successful account creation
  if (accountCreated) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12'>
      <div className='max-w-md w-full space-y-8'>
        {/* Form header and icon */}
        <div className='text-center'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
            {/* SVG user icon */}
            <svg
              className='w-8 h-8 text-green-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Sign Up</h1>
          <p className='text-gray-600 mb-8'>Create your account to get started</p>
        </div>

        {/* Signup form */}
        <div className='bg-black rounded-lg shadow-md p-8'>
          {/* General error message */}
          {formErrors.general && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
              <div className='flex items-center'>
                <svg
                  className='w-5 h-5 text-red-400 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-sm text-red-700'>{formErrors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className='space-y-6'>
            {/* First Name & Last Name inputs */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='first_name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  First Name *
                </label>
                <input
                  id='first_name'
                  className='w-full bg-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200'
                  type='text'
                  placeholder='John'
                  name='first_name'
                  value={first_name}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='last_name'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Last Name *
                </label>
                <input
                  id='last_name'
                  className='w-full bg-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200'
                  type='text'
                  placeholder='Doe'
                  name='last_name'
                  value={last_name}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Email input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address *
              </label>
              <input
                id='email'
                className='w-full bg-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200'
                type='email'
                placeholder='john@example.com'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>

            {/* Password input */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Password *
              </label>
              <input
                id='password'
                className={`w-full bg-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  formErrors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                }`}
                type='password'
                placeholder='Enter your password (min 8 characters)'
                name='password'
                value={password}
                onChange={onChange}
                minLength='8'
                required
              />
              <p className='mt-1 text-xs text-gray-500'>
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password input */}
            <div>
              <label
                htmlFor='re_password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Confirm Password *
              </label>
              <input
                id='re_password'
                className={`w-full bg-black px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  formErrors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                }`}
                type='password'
                placeholder='Confirm your password'
                name='re_password'
                value={re_password}
                onChange={onChange}
                minLength='8'
                required
              />
              {/* Show password mismatch error */}
              {formErrors.password && (
                <p className='mt-2 text-sm text-red-600 flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Submit button */}
            <button
              type='submit'
              disabled={isLoading || loading}
              className={`w-full py-3 px-4 text-black font-medium rounded-md shadow-sm transition-all duration-200 transform ${
                isLoading || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-green-300'
              }`}
            >
              {isLoading || loading ? (
                <div className='flex items-center justify-center'>
                  {/* Spinner icon */}
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-black'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Link to login page */}
        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-medium text-green-600 hover:text-green-500 transition-colors duration-200'
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;