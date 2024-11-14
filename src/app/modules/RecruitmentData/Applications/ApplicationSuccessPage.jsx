import { Button } from 'components/ui/button';
import { CheckCheckIcon } from 'lucide-react';
import React from 'react';

const ApplicationSuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <CheckCheckIcon className="w-20 h-20 text-green-500 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Application Submitted!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for submitting your application. We have received it and will review it shortly.
        </p>
        <div className="mt-6">
          <Button
            onClick={() => window.location.href = 'https://tecbrix.com/'}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuccessPage;
