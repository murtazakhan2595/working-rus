import { Link } from "react-router-dom";
import { Button } from "components/ui/button";
import NewLogo from "../../../../../assets/images/NewLogo";
import { StepForward } from "lucide-react";

const OnboardComplete = ({ nextstep }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
    <div className="space-y-8 text-center">
      <div className="flex flex-col items-center mb-8">
        <NewLogo />

      </div>
      <h2 className="text-4xl font-bold text-Plume-900">
      The Onboarding Process Completed 
      </h2>
      <p className="text-xl text-Plum-600">
        The Onboarding Process Compeleted Let’s get to work
      </p>

      <Button size="xl" className="mt-8" variant="default" >
      <Link>
      Start <StepForward />
      </Link>
      </Button>

    </div>
  </div>
   
  );
};

export default OnboardComplete;
