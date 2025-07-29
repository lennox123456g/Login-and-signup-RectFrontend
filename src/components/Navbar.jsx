import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/auth';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get authentication status from Redux store
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Logout handler
  const logout_user = () => {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Toggle mobile menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Links for unauthenticated users
  const guestLinks = (
    <>
      <li>
        <Link 
          className='block px-4  text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-blue-600'
          to='/login'
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
      </li>
      <li>
        <Link 
          className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-blue-600'
          to='/signup'
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </Link>
        
      </li>
    </>
  );

  // Links for authenticated users
  const authLinks = (

    <div class="flex items-center justify-center">
      <li>
        <Link 
          className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-blue-600'
          to='/newsletter'
          onClick={() => setIsMenuOpen(false)}
        >
          Newsletter
        </Link>
        
      </li>
      <li>
        <Link 
          className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-blue-600'
          to='/translate'
          onClick={() => setIsMenuOpen(false)}
        >
          Translated
        </Link>
        
      </li>
    <li>
      <button 
        className=' bg-black block w-full text-left text-white px-4 py-2 text-gray-700 hover:bg-yellow-300 hover:text-red-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-red-600'
        onClick={logout_user}
      >
        Logout
      </button>
    </li>
    </div>
  );

  return (
    <Fragment >
      <nav className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Brand */}
            <div className='flex-shrink-0'>
              <Link 
                className=' font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200'
                to='/'
                onClick={() => setIsMenuOpen(false)}
              >
                Auth System
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:block'>
              <ul className='flex'>
                <li class="mt-1 items-center">
                  <Link 
                    className='mt-4 font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200'
                    to='/'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                {isAuthenticated ? authLinks : guestLinks}
              </ul>
            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200'
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label='Toggle navigation'
              >
                <svg 
                  className='h-6 w-6' 
                  stroke='currentColor' 
                  fill='none' 
                  viewBox='0 0 24 24'
                >
                  {isMenuOpen ? (
                    <path 
                      strokeLinecap='round' 
                      strokeLinejoin='round' 
                      strokeWidth={2} 
                      d='M6 18L18 6M6 6l12 12' 
                    />
                  ) : (
                    <path 
                      strokeLinecap='round' 
                      strokeLinejoin='round' 
                      strokeWidth={2} 
                      d='M4 6h16M4 12h16M4 18h16' 
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className='px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200'>
            <Link 
              className='block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 font-medium'
              to='/'
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <ul className='space-y-1'>
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
