import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { connect } from "react-redux";
import { getFileNameFromURL } from "utils/downUtils";
import { getTaskById } from "app/hooks/taskManagment";
import { CardTypes } from "app/utils/Types/TaskManagment";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import {
  getAttachmentById,
  getTaskCheckListItem,
} from "app/hooks/taskManagment";
import { PageLoader } from "components";

const EditCard = ({ onClose, employees, cardId, projectId, setIsOpen }) => {
  const [initialValues, setInitialValues] = useState({
    ...CardTypes,
    board_id: "",
    project_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (isMounted) => {
    setIsLoading(true);

    // Helper function to fetch checklist item details
    const getCheckListItemDetails = async (checklistIds) => {
      if (!checklistIds || checklistIds.length === 0) return [];
      try {
        const checklistDetails = await Promise.all(
          checklistIds.map(async (id) => {
            const response = await getTaskCheckListItem(id);
            return {
              id: response.id,
              description: response.description,
              is_completed: response.is_completed,
            };
          })
        );
        return checklistDetails;
      } catch (error) {
        console.error("Error fetching checklist items:", error);
        throw error; // Propagate error to the caller
      }
    };

    // Helper function to fetch attachment details
    const getAttachmentDetails = async (attachmentIds) => {
      if (!attachmentIds || attachmentIds.length === 0) return [];
      try {
        const attachmentDetails = await Promise.all(
          attachmentIds.map(async (id) => {
            const response = await getAttachmentById(id);
            return {
              attachments: response.attachments,
              id: response.id,
              name: getFileNameFromURL(response.attachments),
            };
          })
        );
        return attachmentDetails;
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error("Failed to fetch attachments.");
        throw error; // Propagate error to the caller
      }
    };

    try {
      // Fetch card details
      const cardDetails = await getTaskById(cardId);

      if (!cardDetails) {
        throw new Error("Card details not found.");
      }

      // Fetch attachment and checklist details if they exist
      const attachments = cardDetails.attachment?.length
        ? await getAttachmentDetails(cardDetails.attachment)
        : [];
      const checklistItems = cardDetails.task_checklist?.length
        ? await getCheckListItemDetails(cardDetails.task_checklist)
        : [];

      // Update state only if the component is still mounted
      if (isMounted) {
        setInitialValues({
          ...cardDetails,
          attachment: attachments,
          task_checklist: checklistItems,
        });
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to load task details. Please try again later.");
    } finally {
      if (isMounted) {
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (cardId) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [cardId]);

  return isLoading ? (
    <PageLoader />
  ) : (
    <CreateAndEditCardForm
      initialValues={initialValues}
      employees={employees}
      onClose={onClose}
      isEdit={true}
      setIsOpen={setIsOpen}
      projectId={projectId}
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
