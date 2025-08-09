import React, { useState, div } from 'react';
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
    <div class="md:flex justify md:items-center">
      <li>
        <Link 
          class='block px-4 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:hover:bg-transparent md:hover:text-blue-600'
          to='/login'
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
      </li>
      <li>
        <Link 
          class='block px-4  text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3  md:hover:bg-transparent md:hover:text-blue-600'
          to='/signup'
          onClick={() => setIsMenuOpen(false)}
        >
          Sign Up
        </Link>
        
      </li>
    </div>
  
  );

  // Links for authenticated users
  const authLinks = (

    <div class="md:flex items-center md:ustify-center">
      <li>
        <Link 
          class='block px-2 md:py-2 py-0 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3  md:hover:bg-transparent md:hover:text-blue-600'
          to='/newsletter'
          onClick={() => setIsMenuOpen(false)}
        >
          Newsletter
        </Link>
        
      </li>
      <li>
        <Link 
          class='block px-2 md:py-2 py-0 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3  md:hover:bg-transparent md:hover:text-blue-600'
          to='/translate'
          onClick={() => setIsMenuOpen(false)}
        >
          Translated
        </Link>
        
      </li>
      <li>
        <button 
          class=' bg-black block text-left text-white px-4 md:py-2 py-0 text-gray-700 hover:bg-yellow-300 hover:text-red-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-red-600'
          onClick={logout_user}
        >
          Logout
        </button>
      </li>
    </div>
  );

  return (
      <nav class=' fixed w-full  bg-white shadow border-b border-gray-200  z-20 '>
        <div class='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div class='flex justify-between items-center h-16 '>

            {/* Desktop */}
            <div className='hidden md:block flex-shrink-0  w-full'>
              <div className="flex items-center w-full justify-between ">
                <ul>
                  <Link
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 md:inline-block md:px-3 md:py-2 md:hover:bg-transparent md:hover:text-blue-600'
                    to='/'
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </ul>
      
                <div>
                  <ul className="flex items-center justify-end ">
                    {isAuthenticated ? authLinks : guestLinks}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Mobile menu  */}
            <div class='md:hidden mt-2 mb-2 flex items-center justify '>
              <button
                class='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200'
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label='Toggle navigation'
              >
                <svg 
                  class='h-6 w-6' 
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
              
                <p class="text-black font-bold text-red-500 ml-25 text-3xl">Breakthru!</p>
              
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div class={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>           
          <div class='px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200'>             
            <Link                
              class='block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 font-medium'               
              to='/'               
              onClick={() => setIsMenuOpen(false)}             
            >               
              Home             
            </Link>             
            <div class="">               
              {isAuthenticated ? authLinks : guestLinks}             
            </div>           
          </div>         
        </div>
      </nav>
  );
};

export default Navbar;

