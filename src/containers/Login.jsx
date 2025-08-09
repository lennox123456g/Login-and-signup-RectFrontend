import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Use hooks for Redux
import { login } from '../actions/auth';

const Login = () => {
  // Local state for form inputs and loading state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Destructure email and password from form data
  const { email, password } = formData;

  // Get isAuthenticated from Redux state using useSelector
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Get dispatch function from Redux
  const dispatch = useDispatch();

  // Handle input change event
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit event
  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Dispatch login action with email and password
      await dispatch(login(email, password));
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to='/translate' replace />;
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center   justify-center px-4 py-7 w-full'>
      <div className='max-w-md w-full space-y-5 md:mt-0 -mt-30'>
        <div className='text-center'>
          <div className='mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-1'>
            <svg 
              className='w-8 h-8 text-blue-600' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-1'>Sign In</h1>
          <p className='text-gray-600 mb-3'>Sign into your account to continue</p>
        </div>

        <div className='bg-white rounded-lg shadow-md p-8 max-w-md'>
          <form onSubmit={onSubmit} className='space-y-6'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                id='email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-black'
                type='email'
                placeholder='Enter your email'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Password
              </label>
              <input
                id='password'
                className='w-full bg-black px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200'
                type='password'
                placeholder='Enter your password'
                name='password'
                value={password}
                onChange={onChange}
                minLength='6'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className={`
                w-full py-3 px-4 text-white font-medium rounded-md shadow-sm
                transition-all duration-200 transform
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-300'
                }
              `}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <svg 
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' 
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className='text-center space-y-2'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link 
              to='/signup' 
              className='font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200'
            >
              Sign Up
            </Link>
          </p>
          <p className='text-sm text-gray-600'>
            Forgot your password?{' '}
            <Link 
              to='/reset-password' 
              className='font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200'
            >
              Reset Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;