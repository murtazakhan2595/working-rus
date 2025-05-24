import React from "react";
import { ShieldX, ArrowLeft, HomeIcon } from "lucide-react";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";

const UnauthorizedAccess = ({ 
  title = "Access Denied", 
  message, 
  featureName = "this feature",
  showButtons = false,
  className = "",
  size = "md" // sm, md, lg
}) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: {
      container: "min-h-[200px] p-4",
      icon: "w-8 h-8",
      iconContainer: "p-3 mb-3",
      title: "text-lg",
      message: "text-sm"
    },
    md: {
      container: "min-h-[300px] p-6",
      icon: "w-12 h-12",
      iconContainer: "p-4 mb-4",
      title: "text-xl",
      message: "text-base"
    },
    lg: {
      container: "min-h-[400px] p-8",
      icon: "w-16 h-16",
      iconContainer: "p-4 mb-4",
      title: "text-2xl",
      message: "text-lg"
    }
  };

  const currentSize = sizeClasses[size];
  const defaultMessage = `You don't have permission to access ${featureName}. Please contact your administrator to request access.`;

  const handleGoBack = () => {
    window.history.back();
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className={`flex flex-col items-center justify-center ${currentSize.container} ${className}`}>
      <div className={`bg-red-50 rounded-full ${currentSize.iconContainer}`}>
        <ShieldX className={`${currentSize.icon} text-red-500`} />
      </div>
      <h3 className={`${currentSize.title} font-semibold text-red-700 mb-2`}>
        {title}
      </h3>
      <p className={`${currentSize.message} text-red-600 text-center max-w-md mb-4`}>
        {message || defaultMessage}
      </p>
      
      {showButtons && (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={handleReturnHome}
            className="flex items-center gap-2"
          >
            <HomeIcon className="w-4 h-4" />
            Return Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnauthorizedAccess; 