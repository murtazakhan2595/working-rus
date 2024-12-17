import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { connect } from "react-redux";
import { getTaskById } from "app/hooks/taskManagment";
import { CardTypes } from "app/utils/Types/TaskManagment";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import SheetComponent from "components/ui/CustomSheet";
import { PageLoader } from "components";

const EditCard = ({
  onClose,
  employees,
  cardId,
  projectId,
  setIsOpen,
  isOpen,
}) => {
  const [initialValues, setInitialValues] = useState({
    ...CardTypes,
    board_id: "",
    project_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (isMounted) => {
    setIsLoading(true);

    try {
      // Fetch card details
      const cardDetails = await getTaskById(cardId);

      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setInitialValues(cardDetails);
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

  const formSheetEditData = {
    triggerText: null,
    title: "Edit Card",
    description: null,
    footer: null,
  };

  return isLoading ? (
    <PageLoader />
  ) : (
    <CreateAndEditCardForm
      initialValues={initialValues}
      employees={employees}
      onClose={onClose}
      isEdit={true}
      isOpen={isOpen}
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
