import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { RxCross2, RxPlus } from "react-icons/rx";
import { Card } from "reactstrap";
import { CardTypes } from "app/utils/Types/TaskManagment";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import plus from "assets/images/plus.svg";
import CreateAndEditCardForm from "../Sections/CreateAndEditCardForm";
import { addTask, getTaskById } from "app/hooks/taskManagment";

const CreateAndUpdateCard = ({ employees, onClose, boardId, projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    ...CardTypes,
    board_id: boardId,
    project_id: projectId,
  });


  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await addTask({
        ...formData,
        priority: priorityMapping[formData.priority],
      });
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll flex justify-center items-center backdrop-blur-sm py-5 h-[100vh] ">
        <Card
          className="overflow-y-auto h-100 p-4 w-[90%]"
          style={{ maxWidth: "650px" }}
        >
          <div
            className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
            onClick={onClose}
          >
            <RxCross2 />
          </div>
          <CreateAndEditCardForm
            initialValues={initialValues}
            employees={employees}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
        </Card>
        <ToastContainer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};
export default connect(mapStateToProps)(CreateAndUpdateCard);
