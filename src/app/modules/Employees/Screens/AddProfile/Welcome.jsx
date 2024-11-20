import React from "react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/button";
import NewLogo from "../../../../../assets/images/NewLogo";
import { StepForward } from "lucide-react";


const Welcome = ({ nextstep }) => {
  return (
    <>

      <div className="flex flex-col items-center justify-center min-h-screen main-content ">
        <div className="space-y-8 text-center bg-white p-10 rounded-lg min-h-screen ">
        
          <div className="flex flex-col items-center mb-8">
            <NewLogo />

          </div>
          <h2 className="text-4xl font-bold text-Plume-900">
            Welcome to HR Management System
          </h2>
          <p className="text-xl text-Plum-600">
            Let's Start the Onboarding Process
          </p>

          <Button size="xl" className="mt-8" variant="default" onClick={nextstep}>
            Start <StepForward />
          </Button>

        </div>
      </div>
    </>
  );
};

export default Welcome;
