import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewLogo from "assets/images/NewLogo";

const AccessRevokedPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("accessRevoked");

    // Redirect to login
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <NewLogo />
          </div>
          <div className="mx-auto mb-4 p-3 bg-amber-100 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-neutral-1200">
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-neutral-1100">
            Your access has been temporarily restricted due to clearance
            requirements.
          </p>
          <p className="text-sm text-neutral-1000">
            Please contact your HR department for more information about the
            clearance process.
          </p>

          <div className="pt-4">
            <Button onClick={handleLogout} className="w-full" variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessRevokedPage;
