import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HomeIcon } from "lucide-react";

const Error = ({ errorType }) => {
  const [countdown, setCountdown] = useState(8);
  const errorDetails =
    errorType === 401
      ? {
          number: 1,
          title: "Unauthorized Access",
          message: `You don't have permission to access this page. Please log in or
            contact an administrator for assistance.`,
        }
      : {
          number: 4,
          title: "Oops! Looks like you're lost",
          message: `The page you're looking for seems to have wandered off. Don't worry, we'll help
            you find your way back.`,
        };
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-10 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-8">
          <h1 className="relative font-bold text-neutral-300 text-[250px]">
            4
            <span className="relative">
              0
              <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="w-4 h-4 rounded-full bg-plum-500"></div>
              </div>
            </span>
            {errorDetails.number}
          </h1>
        </div>

        <div className="text-center">
          <h2 className="mb-3 text-2xl font-bold text-neutral-1200">
            {errorDetails.title}
          </h2>
          <p className="mb-8 text-neutral-1000">{errorDetails.message}</p>

          <div className="flex justify-center gap-4 mb-6">
            <button
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
            </button>
          </div>

          <p className="text-sm text-neutral-700">
            Redirecting to homepage in {countdown} seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
