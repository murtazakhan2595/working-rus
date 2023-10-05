import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router

const Err404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r to-blue-400 from-[#283b91] text-white">
      <div className="text-6xl font-extrabold tracking-tight mb-4">404</div>
      <div className="text-2xl font-semibold mb-4">Page not found</div>
      <p className="text-lg text-gray-200 mb-8">
        The page you're looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-[#283b91] hover:bg-white rounded-lg text-white hover:text-[#283b91] text-lg transition duration-300 ease-in-out"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Err404;
