import React from 'react';

const ComingSoon = () => {

  return (
    <div className="flex items-center w-full justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're working hard to bring you an awesome experience!
        </p>
        <div className="flex justify-center mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        </div>
        <div className="mt-8">
          <p className="text-gray-600 mb-4">Stay tuned!</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
