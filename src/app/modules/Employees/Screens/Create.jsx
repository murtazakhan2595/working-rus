import React, { useState, } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import EmployeeForm from "./Sections/EmployeeForm.jsx";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogCancel, DialogAction } from "../../../../src/@/components/ui/dialog.jsx"
import { Button } from "../../../../components/ui/button.jsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../../components/ui/card.jsx"


const CreateUpdateEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState("");
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/profile-management");
  };
  return (
    <>
      <Card>
        <CardContent>
          <EmployeeForm
            setEmail={setEmail}
            setShowSuccessModal={setShowSuccessModal}
            id={id}
          />
        </CardContent>
      </Card>


      {showSuccessModal && (

        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Success!</DialogTitle>

            </DialogHeader>
            <p>User has been successfully registered and has been sent to{" "}
              {email}</p>
          </DialogContent>
          <DialogFooter>
          <Button onClick={closeModal}>Close Modal</Button>
          </DialogFooter>
        </Dialog>


      )}
      <ToastContainer />


    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(CreateUpdateEmployee);
