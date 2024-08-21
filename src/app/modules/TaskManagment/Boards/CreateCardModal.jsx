import { toast, ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { Card } from "reactstrap";
import { CardTypes } from "app/utils/Types/TaskManagment";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import { addTask, addAttachments } from "app/hooks/taskManagment";

const CreateAndUpdateCard = ({ employees, onClose, boardId, projectId }) => {
  const initialValues = {
    ...CardTypes,
    board_id: boardId,
    project_id: projectId,
  };

const handleSubmit = async (formData, files, resetForm) => {
  try {
    // Map over files to get an array of promises
    const attachmentPromises = files.map(async (file) => {
      const response = await addAttachments(file);
      return response.id; // Return the attachment ID
    });

    // Wait for all promises to resolve
    const attachmentIds = await Promise.all(attachmentPromises);

    // Update formData with attachment IDs
    formData.attachment = attachmentIds;

    // Now call addTask
    const response = await addTask({
      ...formData,
    });

    if (response) {
      onClose();
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error(error.response.data.detail, {
      position: toast.POSITION.TOP_RIGHT,
    });
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
