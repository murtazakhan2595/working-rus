import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import { CardTypes } from "app/utils/Types/TaskManagment";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import { addTask, addAttachments } from "app/hooks/taskManagment";
import { Card } from "components/ui/card";

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

const handleSubmit = async (formData, files, resetForm) => {
  // console.log("Files", files);
  setIsLoading(true);
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
    console.log("formData", formData)

    // Now call addTask
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
          <CreateAndEditCardForm
            initialValues={initialValues}
            employees={employees}
            handleSubmit={handleSubmit}
            onClose={onClose}
          />
        <ToastContainer />
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
