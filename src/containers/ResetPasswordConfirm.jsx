import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom'; // useParams hook to get params easily
import { useDispatch, useSelector } from 'react-redux';
import { reset_password_confirm } from '../actions/auth';

const ResetPasswordConfirm = () => {
  // Get uid and token from URL params
  const { uid, token } = useParams();

  // Local state for form data and request status
  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: ''
  });
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // Optional: Access any auth-related state if needed
  // const authState = useSelector(state => state.auth);

  const { new_password, re_new_password } = formData;

  // Handle input changes
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submit
  const onSubmit = async e => {
    e.preventDefault();

    // Optional validation: passwords match check
    if (new_password !== re_new_password) {
      setError('Passwords do not match');
      return;
    }

    setError(null);

    try {
      // Dispatch the async action and await completion
      await dispatch(reset_password_confirm(uid, token, new_password, re_new_password));
      setRequestSent(true); // on success, redirect
    } catch (err) {
      // Handle errors from the action (if your action rejects on error)
      setError(err || 'Password reset failed');
    }
  };

  // Redirect to home or login page after successful reset
  if (requestSent) {
    return <Navigate to='/' />;
  }

  return (
    <div className='mx-auto mt-20 px-4 w-full flex flex-col justify items-center '>
      <div class="max-w-md">
        <form onSubmit={onSubmit} className='space-y-6'>
          <div>
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              type='password'
              placeholder='New Password'
              name='new_password'
              value={new_password}
              onChange={onChange}
              minLength='6'
              required
            />
          </div>
          <div>
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              type='password'
              placeholder='Confirm New Password'
              name='re_new_password'
              value={re_new_password}
              onChange={onChange}
              minLength='6'
              required
            />
          </div>
          {/* Show error message if any */}
          {error && (
            <p className='text-red-600 text-sm mb-4'>
              {error}
            </p>
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

export default ResetPasswordConfirm;
