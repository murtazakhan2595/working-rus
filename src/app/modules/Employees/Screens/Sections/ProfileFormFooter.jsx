import React from "react";
import { Button } from "components/ui/button";

const ProfileFormFooter = ({
  nextstep = () => {},
  prevStep = () => {},
  handleSubmit = () => {},
  isEditMode = false,
  isEdited = false,
  enableBackButton = false,
}) => {
  return (
    <div className="col-span-2 p-6 border-t border-gray-200 bg-gray-50 w-full">
      <div className="flex justify-end space-x-4">
        {!isEditMode && enableBackButton && (
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              prevStep();
            }}
          >
            Back
          </Button>
        )}
        {isEdited || isEditMode ? (
          <Button
            type="submit"
            size="lg"
            variant="default"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Save
          </Button>
        ) : (
          <Button
            size="lg"
            variant="default"
            onClick={(e) => {
              e.preventDefault();
              nextstep();
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileFormFooter;
