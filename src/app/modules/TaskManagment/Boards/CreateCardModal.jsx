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
import moment from "moment";

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
    // Add start_date to the formData object
    const updatedData = {
      ...formData,
      start_date: moment(new Date()).format("YYYY-MM-DD"),
    };

    setIsLoading(true);

    try {
      // Map over files to get an array of promises
      const attachmentPromises = files.map(async (file) => {
        const response = await addAttachments(file);
        return response.id; // Return the attachment ID
      });

      // Wait for all attachment upload promises to resolve
      const attachmentIds = await Promise.all(attachmentPromises);

      // Update formData with attachment IDs
      const finalData = {
        ...updatedData,
        attachment: attachmentIds,
        priority: priorityMapping[formData.priority], // Map priority to the expected value
      };

      // Now call addTask with the final data
      const response = await addTask(finalData);

      if (response) {
        onClose(); // Close the modal or perform any other action upon success
        // resetForm(); // Optionally reset the form after successful submission
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.detail || "An error occurred", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false); // Stop loading indicator
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
