import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HomeIcon, ShieldX } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-10 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <ShieldX className="w-64 h-64 text-red-500" />
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold text-neutral-1200">Access Denied</h2>
          <p className="mb-8 text-neutral-1000">
            You don't have the necessary permissions to access this resource. Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex justify-center gap-4 mb-6">
            {/* <button
              onClick={handleGoBack}
              className="flex items-center px-4 py-2 transition-colors bg-white border border-gray-300 rounded hover:bg-gray-50"
              aria-label="Go back to previous page"
              tabIndex="0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            
            <button
              onClick={handleReturnHome}
              className="flex items-center px-4 py-2 text-white transition-colors rounded bg-plum-1100 hover:bg-plum-600"
              aria-label="Return to homepage"
              tabIndex="0"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Return Home
            </button> */}
          </div>

          <p className="text-sm text-neutral-700">
            Please contact your administrator for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
