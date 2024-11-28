import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import EmployeeForm from "./Sections/EmployeeForm.jsx";
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  DialogFooter,
  // DialogCancel,
  // DialogAction,
} from "../../../../src/@/components/ui/dialog.jsx";
import { Button } from "../../../../components/ui/button.jsx";
import {
  Card,
  // CardHeader,
  // CardTitle,
  // CardDescription,
  CardContent,
  // CardFooter,
} from "../../../../components/ui/card.jsx";
import Header from "components/Header.jsx";

const CreateUpdateEmployee = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  // const id = location?.state?.id;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFormSubmittedModal, setShowFormSubmittedModal] = useState(false);
  const [email, setEmail] = useState("");
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate("/profile-management");
  };
  useEffect(() => {
    // Show "Form submitted successfully!" for 2 seconds, then show the success modal
    if (showFormSubmittedModal) {
      const timer = setTimeout(() => {
        setShowFormSubmittedModal(false); // Hide the first dialog
        setShowSuccessModal(true); // Show the success dialog
      }, 2000);

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [showFormSubmittedModal]);
  return (
    <>
    <div className={`max-w-[840px] mx-auto ${window.location.pathname.substring(1)}`}>
    <Header />
      <Card>
        <CardContent>
          <EmployeeForm
            setEmail={setEmail}
            setShowFormSubmittedModal={setShowFormSubmittedModal}
            id={id}
            setIsOpen={()=>{}}
            discard={true}
          />
        </CardContent>
      </Card>
      {showFormSubmittedModal && (
        <Dialog open={showFormSubmittedModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Form submitted successfully!</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {showSuccessModal && (
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Success!</DialogTitle>
            </DialogHeader>
            <p>
              User has been successfully registered and has been sent to {email}
            </p>
          </DialogContent>
          <DialogFooter>
            <Button onClick={closeModal}>Close Modal</Button>
          </DialogFooter>
        </Dialog>
      )}
      <ToastContainer />
    </div>
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
