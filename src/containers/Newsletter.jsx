
import React from 'react';
import { Link } from 'react-router-dom';

const Newsletter = () => (
  <div className="container mx-auto px-4 bg-white">
    {/* Centered card with shadow and padding */}
    <div className="mt-10 bg-white shadow-lg rounded-lg p-8 text-center">
      {/* Main heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Auth System!
      </h1>

      {/* Description paragraph */}
      <p className="text-lg text-gray-600 mb-4">
        This is an incredible authentication system with production-level features!
      </p>

      {/* Horizontal rule with margin */}
      <hr className="my-6 border-t border-gray-300" />

      {/* Instruction text */}
      <p className="text-gray-700 mb-6">Click the Log In button</p>

      {/* Link styled as a button to /login */}
      <Link
        to="/login"
        className="inline-block bg-blue-600 text-white text-lg font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Login
      </Link>
    </div>
  </div>
);

export default Newsletter;
