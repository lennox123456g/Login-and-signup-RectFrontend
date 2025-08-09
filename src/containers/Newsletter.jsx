
import React from 'react';
import { Link } from 'react-router-dom';

const Newsletter = () => (
  <div className="container mx-auto px-4 bg-white w-full min-h-screen flex flex-col items-center">
    {/* Centered card with shadow and padding */}
    <div className="md:mt-20 bg-white shadow-lg rounded-lg p-8 text-center w-full md:max-w-md  max-w-sm mt-30 border border-black/50 ">
      {/* Main heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Auth System!
      </h1>

      {/* Description paragraph */}
      <p className="text-lg text-gray-600 mb-4">
        This is an incredible authentication system with production-level features!
      </p>

      {/* Horizontal rule with margin */}
      <hr className="my-6 border-t border-gray-300" />

      {/* Instruction text */}
      <p className="text-red-600 mb-6">SPOILER ALERT!</p>
      <p className="text-blue-600 text-3xl  mb-6">THE NEWSLETTER IS COMING</p>

    </div>
  </div>
);

export default Newsletter;
