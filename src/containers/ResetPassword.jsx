import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';  // useDispatch to dispatch actions
import { reset_password } from '../actions/auth';

const ResetPassword = () => {
  // Local state for form data and request status
  const [formData, setFormData] = useState({ email: '' });
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState(null); // Optional: to handle errors

  const dispatch = useDispatch();

  const { email } = formData;

  // Handle input change
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit
  const onSubmit = async e => {
    e.preventDefault();

    setError(null);

    try {
      // Dispatch the async action and await it if it returns a Promise
      await dispatch(reset_password(email));
      setRequestSent(true);  // on success, trigger redirect
    } catch (err) {
      setError(err || 'Failed to send password reset email');
    }
  };

  // Redirect after request is sent successfully
  if (requestSent) {
    return <Navigate to='/' />;
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center justify px-4 '>
      <h1 className='text-2xl font-bold text-gray-900 mb-6 mt-15'>Request Password Reset</h1>
      <div class="w-full max-w-sm mt-10 rounded-lg bg-white shadow-md p-8">
        <form onSubmit={onSubmit} className='space-y-6 '>
        <div>
          <input
            className='w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            type='email'
            placeholder='Email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>

        {/* Optional error message */}
        {error && (
          <p className='text-red-600 text-sm mb-4'>{error}</p>
        )}

        <button
          className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200'
          type='submit'
        >
          Reset Password
        </button>
      </form>
      </div>
    </div>
  );
};

export default ResetPassword;
