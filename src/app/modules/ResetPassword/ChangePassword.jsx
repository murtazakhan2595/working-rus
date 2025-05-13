import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { SheetUI } from "components";
import { PasswordInput } from "components/FormControl";
import { validateChangePasswordForm } from "app/utils/FormSchema/employeeFormSchema";
import { EmployeeChangePassword } from "app/utils/Types/Employee";
import { UpdatePassword } from "app/hooks/employee";

const FormSheetData = {
  triggerText: "",
  title: "Change Password",
  description: null,
  footer: null,
};
const ChangePassword = () => {
  const baseUrl = useSelector((state) => state.user.baseUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState(EmployeeChangePassword);
  const [response, setResponse] = useState(null);
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await UpdatePassword(values);
      if (res) {
        return {
          status: true,
          title: "Form Submitted Succesfully",
          description:
            "Your password has been changed successfully. You will now be logged out. Please log in again using your new password.",
          messageType: "Success",
        };
      }
    } catch (error) {
      setResponse({
        message: error.response?.data?.error || "Can’t find your email?",
        status: "error",
      });
    } finally {
      setIsLoading(false);

      setFormData(EmployeeChangePassword);
    }
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="modal"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validateChangePasswordForm,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        //   renderUpdatedFormValues: setFormValues,
        disableSubmit: isLoading,
        formFiels: [
          {
            sheetCardExtension: false,
            InputFiels: [
              {
                InputField: PasswordInput,
                name: "current_password",
                required: true,
                label: "Old Password",
              },
              {
                InputField: PasswordInput,
                name: "new_password",
                required: true,
                label: "New Password",
              },
              {
                InputField: PasswordInput,
                name: "confirm_password",
                required: true,
                label: "Confirm Password",
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default ChangePassword;
