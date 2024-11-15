import { Button } from 'components/ui/button';
import { Card } from 'components/ui/card';
import React from 'react';

const ApplicationSuccessUI = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center bg-gray-100">
      <Card className="bg-white p-8 rounded-lg shadow mt-10 max-w-lg w-full">
        <h1 className="text-green-700 text-xl font-semibold mb-2">
          Application Submitted
        </h1>
        
        <p className="text-neutral-900 mb-4">
          Your application has been successfully submitted.
        </p>

        <hr className="my-4 border border-neutral-700" />
        
        <div className="flex ">
          <Button
            onClick={() => window.location.href = 'https://tecbrix.com/'}
          >
            Visit Our Website
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ApplicationSuccessUI;

