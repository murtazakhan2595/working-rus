import React, { useEffect, useRef, useState } from "react";
import { RxCross2, RxPlus } from "react-icons/rx";
import { toast, ToastContainer } from "react-toastify";

import { connect } from "react-redux";
import { Members } from "../Sections";
import {
  FaChevronLeft,
} from "react-icons/fa";
import { Card, CardHeader, CardBody, Row, Col, Button, Form } from "reactstrap";
import { Formik } from "formik";
import {
  TextInput,
  SelectComponent,
  TextAreaEditorInput,
  TextAreaInput,
  DateInput,
} from "components/form-control.jsx";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import calender from "assets/images/calender.svg";
import members from "assets/images/members.svg";
import priority from "assets/images/priority.svg";
import {
  addTask,
  getTaskById,
} from "app/hooks/taskManagment";
import { CardTypes } from "app/utils/Types/TaskManagment";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import {
  addAttachments,
  getAttachmentById,
  deleteAttachment,
} from "app/hooks/taskManagment";


const EditCard = ({
  onClose,
  employees,
  cardId,
}) => {

  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };



  const [initialValues, setInitialValues] = useState({
    ...CardTypes,
    board_id: '',
    project_id: '',
  });
  const [membersOpen, setMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const cardDetails = await getTaskById(cardId);
      if (cardDetails?.attachment.length > 0) {
        const attachment = await Promise.all(
          cardDetails.attachment.map(async (attachmentId) => {
            const response = await getAttachmentById(attachmentId);
            return {...response.attachments, id: response.id};
          })
        );
        if (isMounted) {
          setInitialValues({
            ...cardDetails,
            attachment: attachment,
          });
        }
      }
      else if (isMounted) {
          setInitialValues({
            ...cardDetails,
          });
        }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

const handleSubmit = async (
  formData,
  newfiles,
  files,
  deleteFiles=[],
  resetForm
) => {
  // console.log("Files", files);
  setIsLoading(true);
  try {
    if(deleteFiles.length > 0) {
      deleteFiles.forEach(async (file) => {
        await deleteAttachment(file.id);
      });
    }
    // Map over files to get an array of promises
    const attachmentPromises = newfiles.map(async (file) => {
      const response = await addAttachments(file);
      return response.id; // Return the attachment ID
    });

    // Wait for all promises to resolve
    const attachmentIds = await Promise.all(attachmentPromises);
    const oldAttachmentIds = files.map((file) => file.id);

    // Update formData with attachment IDs
    formData.attachment = [...attachmentIds, ...oldAttachmentIds];

    // Now call addTask
    const response = await addTask(formData);

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

    useEffect(() => {
      let isMounted = true;
      if (cardId) fetchData(isMounted);
      return () => {
        isMounted = false;
      };
    }, [cardId]);

  return (

        <CreateAndEditCardForm
          initialValues={initialValues}
          employees={employees}
          handleSubmit={handleSubmit}
          onClose={onClose}
          isEdit={true}
        />
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(EditCard);
