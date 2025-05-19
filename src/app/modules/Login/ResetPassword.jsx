import React, { useState } from "react";
import { validateResetPasswordForm } from "app/utils/FormSchema/generalFormSchema";
import { SubmitResetPassword } from "app/hooks/general";
import { HandleLogout } from "app/hooks/general";
import NewLogo from "assets/images/NewLogo";
import { SheetUI } from "components";
import enterNewpassword from "assets/images/enterNewPassword.jpg";
import { PasswordInput } from "components/FormControl";
import { useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    uid: uid,
    token:token,
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await SubmitResetPassword(values);
      if (res) {
        return {
          status: true,
          title: "Password Submitted Succesfully",
          description:
            "Your password has been successfully submitted. You will now be rendered to loggin page. Please log in again using your new password.",
          messageType: "Success",
        };
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setFormData({
        uid: uid,
        password: "",
        confirm_password: "",
        token:token,
      });
    }
  };

  return (
    <>
      <div className="container max-w-full mx-auto ">
        <div className={"lg:grid lg:grid-cols-2"}>
          <div className="flex items-center justify-center">
            <div className="grid gap-6 mx-auto">
              <div className="grid justify-center gap-2 text-center">
                <div className="ml-auto mr-auto">
                  <NewLogo />
                </div>
                <h1 className="text-3xl font-bold">Enter New Password</h1>
                <p className="text-balance text-muted-foreground">
                  Your new password must not be the same or contain the same
                  password as your previous ones.
                </p>
              </div>
              <div className="grid gap-4">
                <SheetUI
                  isOpen={true}
                  setIsOpen={() => {
                    HandleLogout("Rendering to login page");
                  }}
                  variant={""}
                  sheetConfig={{}}
                  formConfig={{
                    initialValues: formData,
                    enableReinitialize: true,
                    handleSubmit: handleSubmit,
                    validateFormSchema: validateResetPasswordForm,
                    submitButtonText: "Reset Password",
                    // cancelButtonText: "Cancel",
                    columns: 1,
                    //   renderUpdatedFormValues: setFormValues,
                    disableSubmit: isLoading,
                    formFiels: [
                      {
                        sheetCardExtension: false,
                        InputFields: [
                          {
                            InputField: PasswordInput,
                            name: "password",
                            required: true,
                            label: "New password",
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
              </div>
            </div>
          </div>
          <div className="items-center hidden bg-white lg:flex">
            <img
              src={enterNewpassword}
              className="w-full max-h-screen"
              alt="Enter New Password page Cover Image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
