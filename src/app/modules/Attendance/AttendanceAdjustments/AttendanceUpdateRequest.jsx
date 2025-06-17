import React, { useEffect, useState } from "react";
import { Attendance, AttendanceAdjustment } from "app/utils/Types/Attendance";
import { mapAdjustmentFromAttendnaceData } from "app/utils/MappingObjects/mapAttendanceData";
import { validateAttendanceAdjustmentFormSchema } from "app/utils/FormSchema/AttendanceFormSchema";
import { SheetUI, EmployeeDetailUI } from "components";
import {
  getShiftById,
  getAttendanceData,
  getAttendance,
  saveUpdateAttendanceAdjustment,
  getAttendanceAdjustmentListData,
} from "app/hooks/attendance";
import { useSelector } from "react-redux";
import {
  RadioGroupInput,
  SelectInputComponent,
  TimePicker,
  DateInput,
} from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";
import { TextAreaInput } from "components/FormControl";
import { GetEmployeeFilteredList } from "utils/Lists";
import { GetEmployeeActiveShift } from "app/modules/Attendance/ShiftCalendar/Section/getEmployeeActiveShift";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";

const FormSheetData = {
  triggerText: "Submit",
  title: "Attendance Update Request",
  description: null,
  footer: null,
  className: "max-w-[678px] w-full",
};

const AttendanceUpdateRequest = ({ id }) => {
  const { default_shift } = useSelector(
    (state) => state.attendance.attendance_details
  );
  const [isOpen, setIsOpen] = useState(false);
  const [RecordExit, setRecordExit] = useState(false);
  const UserDetails = useSelector((state) => state.emp.user_details);
  const [formData, setFormData] = useState(AttendanceAdjustment);
  const [formValues, setFormValues] = useState(AttendanceAdjustment);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [ActiveShift, setActiveShift] = useState(false);
  const [DefaultShift, setDefaultShift] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAttendanceAdjustmentData = async (isMounted, attendanceId) => {
    try {
      const response = await getAttendanceAdjustmentListData({
        filterData: { attendance: attendanceId },
      });
      if (isMounted && response) {
        if (response.results && response.results.length > 0) {
          setRecordExit(true);
        } else {
          setRecordExit(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async (isMounted) => {
    try {
      const response = await getAttendanceData(id);
      if (isMounted && response) {
        setFormData(response);
        setFormValues(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendanceData = async (isMounted, date) => {
    if (date && selectedEmployee.id) {
      setIsLoading(true);
      setRecordExit(false);
      try {
        const response = await getAttendance({
          filterData: { date: date, employee_id: selectedEmployee.id },
        });

        const active_shift = await GetEmployeeActiveShift(
          selectedEmployee.id,
          default_shift,
          date
        );
        setActiveShift(active_shift);
        if (isMounted && response) {
          if (response.results && response.results.length > 0) {
            const attendanceRecord = response.results[0];
            const data = mapAdjustmentFromAttendnaceData(attendanceRecord);
            setFormData(data);
            setFormValues(data);
            fetchAttendanceAdjustmentData(true, attendanceRecord.id);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const getDefaultShift = async (isMounted, UserDetails) => {
    if (isMounted && UserDetails?.id) {
      setSelectedEmployee(UserDetails);
      setFormData((prev) => {
        return { ...prev, employee: UserDetails.id };
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (UserDetails) getDefaultShift(isMounted, UserDetails);
    return () => {
      isMounted = false;
    };
  }, [UserDetails]);

  const handleSubmit = async (data) => {
    try {
      const response = await saveUpdateAttendanceAdjustment(data);
      if (response)
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Attendance Update Request Submitted`,
          description: `Attendance updated request for ${renderDate(
            data.date
          )} is submitted successfully`,
        };
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };

  const handleAdjustTimeClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };
  return (
    <>
      <Button disabled={RecordExit} onClick={handleAdjustTimeClick}>
        Update Attendance
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
            validateFormSchema: (values) => {
              const error = validateAttendanceAdjustmentFormSchema(values);
              if (RecordExit)
                error.attendance_date =
                  "Update request is already submitted for this date";

              if (values.attendance_date && !ActiveShift.status) {
                if (!ActiveShift.shift_assigned) {
                  error.attendance_date = `No Shift was assigned to you for this date. Kindly update the shift to record attendance`;
                } else if (ActiveShift.isOffToday) {
                  error.attendance_date = `Its ${
                    ActiveShift?.OffLabel?.toLowerCase() || ""
                  } on this date.Kindly update the shift to request attendance update`;
                }
              }

              return error;
            },
            submitButtonText: "Submit",
            cancelButtonText: "Cancel",
            columns: 3,
            renderUpdatedFormValues: setFormValues,
            disableSubmit: isLoading,
            formFields: [
              {
                sheetCardExtension: true,
                sheetCardTitle: "Employee Details",
                InputFields: [
                  {
                    InputField: EmployeeDetailUI,
                    id: UserDetails.id,
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
                    name: "attendance_date",
                    required: true,
                    label: "Attendance Date",
                    maxDate: new Date(),
                    onFieldUpdate: async (_, value) => {
                      await fetchAttendanceData(true, value);
                    },
                  },
                  {
                    InputField: TimePicker,
                    name: "requested_checkin",
                    required: true,
                    label: "Check-In Time",
                    date: formValues?.date,
                  },

                  {
                    InputField: TimePicker,
                    name: "requested_checkout",
                    required: true,
                    label: "Check-Out Time",
                    date: formValues?.date,
                  },

                  {
                    InputField: RadioGroupInput,
                    name: "status",
                    required: true,
                    disabled: false,
                    label: "Status",
                    options: [
                      { value: "Present", label: "Present" },
                      { value: "Absent", label: "Absent" },
                      { value: "Late", label: "Late" },
                      { value: "Weekend", label: "Weekend" },
                    ],
                    colsSpan: 3,
                    disabled: true,
                  },
                  {
                    InputField: TextAreaInput,
                    name: "reason",
                    required: true,
                    label: "Reason",
                    colsSpan: 3,
                    rows: 3,
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

export default AttendanceUpdateRequest;
