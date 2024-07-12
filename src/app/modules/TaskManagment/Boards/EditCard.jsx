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
import CreateAndEditCardForm from "../Sections/CreateAndEditCardForm";


const EditCard = ({
  onClose,
  employees,
  cardId,
}) => {
console.log("cardId", cardId)
  const dropdownOptions = [
    {
      label: "High",
      icon: highpriorityIcon,
      value: "High",
    },
    { label: "Low", icon: lowpriorityIcon, value: "Low" },
    { label: "Medium", icon: mediumpriorityIcon, value: "Medium" },
  ];
  const priorityMapping = {
    High: 1,
    Medium: 2,
    Low: 3,
  };
  const reversePriorityMapping = Object.fromEntries(
    Object.entries(priorityMapping).map(([key, value]) => [value, key])
  );


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
      console.log("cardDetails", cardDetails)
      if (isMounted) {
        setInitialValues({...cardDetails, priority: reversePriorityMapping[cardDetails.priority]});
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  const formRef = useRef();

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
    useEffect(() => {
      let isMounted = true;
      if (cardId) fetchData(isMounted);
      return () => {
        isMounted = false;
      };
    }, [cardId]);

  return (
    <div className="fixed top-0 right-0 max-w-[35%] w-[35%] h-full z-10 overflow-y-auto hideScroll ">
      <div className="bg-white h-full fixed  max-w-[35%] w-[35%] top-0 right-0  shadow px-[50px] py-10 flex flex-col gap-7 overflow-y-auto hideScroll">
        <div className="flex-col justify-start items-start gap-2.5 flex">
          <RxCross2 className="cursor-pointer self-end" onClick={onClose} />
          <div className="flex gap-4 items-center text-xl font-bold text-zinc-800">
            <FaChevronLeft
              onClick={onClose}
              className="text-zinc-800 text-[0.65rem] text-xs cursor-pointer"
            />
            <div>Edit Card</div>
          </div>
        </div>
        <CreateAndEditCardForm
          initialValues={initialValues}
          employees={employees}
          handleSubmit={handleSubmit}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(EditCard);
