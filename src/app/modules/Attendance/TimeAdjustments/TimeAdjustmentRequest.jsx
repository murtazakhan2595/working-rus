import React, { useEffect, useState } from "react";
import { TimeAdjustment } from "app/utils/Types/Attendance";
import { validateTimeAdjustmentFormSchema } from "app/utils/FormSchema/AttendanceFormSchema";
import { mapTimeAdjustmentFromAttendance } from "app/utils/MappingObjects/mapAttendanceData";
import { SheetUI, EmployeeDetailUI } from "components";
import {
  saveTimeAdjustment,
  getAttendanceData,
  getTimeAdjustmentListData,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import {
  RadioGroupInput,
  SelectInputComponent,
  TimePicker,
  DateInput,
} from "components/FormControl";
import { Timer } from "lucide-react";
import { Button } from "components/ui/button";
import { TextAreaInput } from "components/FormControl";
import moment from "moment";

const FormSheetData = {
  triggerText: null,
  title: "Time Adjustment Request",
  description: null,
  footer: null,
  className: "max-w-[678px] w-full",
};

const TimeAdjustmentRequest = ({ id, attendance }) => {
  const { today_shift } = useSelector(
    (state) => state.attendance.attendance_details
  );
  const { id: employee_id } = useSelector((state) => state.user.userProfile);
  const [formData, setFormData] = useState(TimeAdjustment);
  const [isOpen, setIsOpen] = useState(false);
  const [disableAdjustTimeButton, setDisableAdjustTimeButton] = useState(false);

  const fetchData = async (isMounted) => {
    try {
      const response = await getAttendanceData(id);
      if (isMounted && response) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTimeAdjustmentData = async (isMounted, attendanceId) => {
    try {
      const response = await getTimeAdjustmentListData({
        filterData: { attendance: attendanceId },
      });
      if (isMounted && response) {
        if (response.results && response.results.length > 0) {
          setDisableAdjustTimeButton(true);
        } else {
          setDisableAdjustTimeButton(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (attendance.id) {
      fetchTimeAdjustmentData(isMounted, attendance.id);
    }
    return () => {
      isMounted = false;
    };
  }, [attendance.id]);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, attendance_id: attendance.id };
      const response = await saveTimeAdjustment(payload);
      // return
      if (response) {
        fetchTimeAdjustmentData(true,attendance.id)
        return {
          status: true,
          title: "Form Submitted Succesfully",
          description:
            "Your request of time adjustment has been sent successfully. It will be reviewed shortly.",
          messageType: "Success",
        };
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };
  const handleAdjustTimeClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const FormValues = mapTimeAdjustmentFromAttendance(attendance, today_shift);
    setFormData(FormValues);
    setIsOpen(true);
  };
  return (
    <>
      <Button
        variant="continue"
        size="sm"
        disabled={disableAdjustTimeButton}
        onClick={handleAdjustTimeClick}
      >
        <Timer size={15} /> Adjust Time
      </Button>
      {isOpen && (
        <SheetUI
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          variant="sheet"
          sheetConfig={FormSheetData}
          formConfig={{
            initialValues: formData,
            enableReinitialize: true,
            handleSubmit: handleSubmit,
            validateFormSchema: validateTimeAdjustmentFormSchema,
            submitButtonText: "Submit Request",
            cancelButtonText: "Cancel",
            columns: 3,
            formFields: [
              {
                sheetCardExtension: true,
                sheetCardTitle: "Employee Details",
                InputFields: [
                  {
                    InputField: EmployeeDetailUI,
                    id: employee_id,
                    InformationKeys: ["name", "department", "branch"],
                    variant: "FormView",
                    colsSpan: 3,
                    className: "grid grid-cols-3 gap-4",
                  },
                ],
              },
              {
                sheetCardExtension: true,
                sheetCardTitle: "Attendance Details",
                InputFields: [
                  {
                    InputField: DateInput,
                    name: "date",
                    required: true,
                    label: "Date",
                    value: attendance?.date,
                    disabled: true,
                  },
                  {
                    InputField: TimePicker,
                    name: "checkin",
                    required: true,
                    label: "Check-In Time",
                    date: attendance?.date,
                    value: attendance?.checkin,
                    disabled: true,
                  },

                  {
                    InputField: TextAreaInput,
                    name: "reason",
                    required: true,
                    disabled: false,
                    label: "Reason",
                    colsSpan: 3,
                  },
                ].filter(Boolean),
              },
            ],
          }}
        ></SheetUI>
      )}
    </>
  );
};

export default TimeAdjustmentRequest;
