import { memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/button";
import NewLogo from "../../../../../assets/images/NewLogo";
import { StepForward } from "lucide-react";
import { saveEmployeePersonalInfoData } from "app/hooks/employee.jsx";

const OnboardComplete = ({ nextstep = () => {}, employeeId }) => {
  const handleCompleteOnBoarding = useCallback(async (event) => {
    event.preventDefault();
    try {
      const personalInformation = { is_filled: true };
      await saveEmployeePersonalInfoData(employeeId, personalInformation);
      nextstep(); // Call the callback after successful save
    } catch (error) {
      console.error("Onboarding completion failed:", error);
      // Optionally, show toast/alert or notify the user
    }
  }, [employeeId, nextstep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="space-y-8 text-center">
        <div className="flex flex-col items-center mb-8">
          <NewLogo />
        </div>
        <h2 className="text-4xl font-bold text-Plume-900">
          The Onboarding Process Completed
        </h2>
        <p className="text-xl text-Plum-600">Let's Start the Work</p>

        <Button
          size="xl"
          className="mt-8"
          variant="default"
          onClick={handleCompleteOnBoarding}
        >
          Start <StepForward />
        </Button>
      </div>
    </div>
  );
};

export default memo(OnboardComplete);
