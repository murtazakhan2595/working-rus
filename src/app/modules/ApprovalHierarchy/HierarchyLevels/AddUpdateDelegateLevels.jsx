import {
  getHierarchyLevelData,
  saveUpdateDelegateLevel,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  DelegateLevel,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { validateDelegateLevelFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import { Levels } from "app/modules/ApprovalHierarchy";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI, TableCustom } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApprovalHierarchyRequestType } from "data/Data";
import { Button } from "components/ui/button";
import { NumberInput } from "components/FormControl";
import { DetailBox } from "components/SheetCardExtension";
import { DesignationName } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { CardTitle } from "reactstrap";
import { CardDescription } from "components/ui/card";
import { CheckBoxInput } from "components/FormControl";
import { AddUpdateLevels } from "app/modules/ApprovalHierarchy";
import { DateInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";

const AddUpdateDelegateLevels = React.memo(
  ({ isOpen, setReloadData = () => {}, id, level_id }) => {
    const [FormData, setFormData] = useState(DelegateLevel);
    const [FormValues, setFormValues] = useState(DelegateLevel);
    const Departments = useSelector((state) => state.common.departments);
    const Branches = useSelector((state) => state.common.branches);
    const Employees = useSelector((state) => state.emp.employees);
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const FilteredEmployees = React.useMemo(() => {
      return Employees?.filter(
        (employee) =>
          parseInt(employee.department_name) === parseInt(FormValues.department)
      );
    }, [Employees, FormValues.department]);

    const FormSheetData = React.useMemo(() => {
      return {
        triggerText: "",
        title: `${isEditMode ? "Add" : "Update"} Delegation`,
        description: null,
        footer: null,
      };
    }, [isEditMode]);

    const handleSubmit = async (values) => {
      try {
        const payload = { ...values, level: level_id };
        const response = await saveUpdateDelegateLevel(payload, id);
        if (response) {
          // Ensure table is reloaded
          toast.success(
            `${
              isEditMode ? "Delegated Level Updated" : "Level Delegated "
            } Successfully!`,
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
          handleClose();
        }
      } catch (error) {
        // Show error message
        const errorMessage =
          error?.response?.data?.message ||
          error.message ||
          `Failed to ${isEditMode ? "update" : "add"} role.`;
        toast.error(errorMessage);
      } finally {
        setIsSubmittingForm(false);
      }
    };

    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getHierarchyLevelData(id);
        if (isMounted) {
          // setFormData(response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      let isMounted = true;
      if (id) fetchData(isMounted, id);
      return () => {
        isMounted = false;
      };
    }, [id]);
    const handleClose = () => {
      setReloadData(true);
      // if (GOTO_URLS)
      //   navigate(GOTO_URLS, {
      //     state: {
      //       // activeView: activeView,
      //       // projectId: taskProjectId,
      //     },
      //   });
      // else {
      //   navigate(`/office-settings/approval-hierarchy`);
      // }
    };

    return (
      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: FormData,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          // onSubmitClick: (values) => {
          //   validateUserRoleName(values.name);
          //   validateRequestType(values.request_type);
          // },
          renderUpdatedFormValues: setFormValues,
          validateFormSchema: (values) => {
            const errors = validateDelegateLevelFormSchema(values);
            return errors;
          },
          submitButtonText: "Add Level",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFiels: [
            {
              sheetCardExtension: false,
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "branch",
                  label: "Branch",
                  required: true,
                  options: Branches,
                },
                {
                  InputField: SelectInputComponent,
                  name: "department",
                  label: "Department",
                  options: Departments,
                  required: true,
                },
                {
                  InputField: SelectInputComponent,
                  name: "delegate",
                  label: "Delegate User",
                  options: FilteredEmployees,
                  required: true,
                },
                {
                  InputField: DateInput,
                  name: "start_date",
                  label: "Start Date",
                  required: true,
                  minDate: new Date(),
                },
                {
                  InputField: DateInput,
                  name: "end_date",
                  required: true,
                  label: "End Date",
                  minDate: FormValues.start_date ?? new Date(),
                },
                {
                  InputField: TextAreaInput,
                  required: true,
                  name: "reason",
                  label: "Reason",
                  rows: 3,
                  colsSpan: 2,
                },
              ],
            },
          ],
        }}
      />
    );
  }
);

export default AddUpdateDelegateLevels;
