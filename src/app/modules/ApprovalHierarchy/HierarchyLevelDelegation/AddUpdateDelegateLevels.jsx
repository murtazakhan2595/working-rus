import {
  getHierarchyLevelData,
  saveUpdateDelegateLevel,
  getDelegationList,
  getDelegateLevelData,
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
import { SelectMultiInputComponent } from "components/FormControl";

const AddUpdateDelegateLevels = React.memo(
  ({ isOpen, setIsOpen, reloadData = () => {}, id, level_id }) => {
    const [FormData, setFormData] = useState(DelegateLevel);
    const [HeirarchyLevelData, setHeirarchyLevelData] = useState({});
    const [FormValues, setFormValues] = useState(DelegateLevel);
    const Departments = useSelector((state) => state.common.departments);
    const Designations = useSelector((state) => state.common.designations);
    const Branches = useSelector((state) => state.common.branches);
    const Employees = useSelector((state) => state.emp.employees);
    const isEditMode = Boolean(id);
    const [isLoading, setIsLoading] = useState(false);
    const [isDelegateExit, setIsDelegateExit] = useState(false);
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
        title: `${isEditMode ? "Update" : "Add"} Delegation`,
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
          handleClose(true);
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
        const response = await getDelegateLevelData(id);
        if (isMounted) {
          if (response.level) {
            const levelData = await getHierarchyLevelData(response.level);
            if (isMounted) {
              setHeirarchyLevelData(levelData);
            }
          }
          setFormData(response);
          setFormValues(response);
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

    const fetchLevelData = async (isMounted) => {
      if (level_id) {
        try {
          setIsLoading(true);
          const response = await getHierarchyLevelData(level_id);
          if (isMounted) {
            setHeirarchyLevelData(response);
          }
        } catch (error) {
          console.error("Error fetching roles:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    useEffect(() => {
      let isMounted = true;
      if (level_id) fetchLevelData(isMounted);
      return () => {
        isMounted = false;
      };
    }, [level_id]);

    const validateDelegateeLevelExist = React.useCallback(
      async (values) => {
        try {
          const { branch, department, delegate, start_date } = values;
          if (branch && department && delegate && start_date) {
            const filterData = {
              ...(level_id ? { level: level_id } : {}),
              branch,
              department,
              delegate,
              start_date,
            };

            const delegations = await getDelegationList({ filterData });
            const delegationList = Array.isArray(delegations?.results)
              ? delegations.results
              : [];
            if (!isEditMode) {
              const isDelegateExist = delegationList.length > 0;
              setIsDelegateExit(isDelegateExist);
              return isDelegateExist;
            } else {
              const DelegateLevels = delegationList.filter(
                (delegateObj) => delegateObj.id !== id
              );
              const isDelegateExist =
                DelegateLevels &&
                Array.isArray(DelegateLevels) &&
                DelegateLevels.length > 0;

              setIsDelegateExit(isDelegateExist);
              return isDelegateExist;
            }
          }
          setIsDelegateExit(false);
          return false;
        } catch (error) {
          console.error("Failed to validate delegatee existence:", error);
          setIsDelegateExit(false);
          return false;
        }
      },
      [level_id]
    );

    const handleClose = (update = false) => {
      setIsOpen(false);
      if (update) reloadData(true);
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
          onSubmitClick: async (values) => {
            await validateDelegateeLevelExist(values);
          },
          renderUpdatedFormValues: setFormValues,
          validateFormSchema: (values) => {
            const errors = validateDelegateLevelFormSchema(values);
            if (isDelegateExit)
              errors.level_delegate_details = `Selected delegate user is already delegated for this level in given start date.`;
            return errors;
          },
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Hierarchy Level Details`,
              InputFields: [
                {
                  InputField: SelectMultiInputComponent,
                  name: "initiative_designation",
                  label: "Request Initiators",
                  value: HeirarchyLevelData.initiative_designation,
                  options: Designations,
                  disabled: true,
                },
                {
                  InputField: SelectInputComponent,
                  name: "designation",
                  label: "Level Designation",
                  options: Designations,
                  disabled: true,
                  value: HeirarchyLevelData.designation,
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: `Level Delegate Details`,
              sheetCardName: "level_delegate_details",
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "branch",
                  label: "Branch",
                  required: true,
                  options: Branches,
                  onFieldUpdate: async (_, __, currentFormValues) => {
                    await validateDelegateeLevelExist(currentFormValues);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "department",
                  label: "Department",
                  options: Departments,
                  required: true,
                  onFieldUpdate: async (_, __, currentFormValues) => {
                    await validateDelegateeLevelExist(currentFormValues);
                  },
                },
                {
                  InputField: SelectInputComponent,
                  name: "delegate",
                  label: "Delegate User",
                  options: FilteredEmployees,
                  required: true,
                  onFieldUpdate: async (_, __, currentFormValues) => {
                    await validateDelegateeLevelExist(currentFormValues);
                  },
                },
                {
                  InputField: DateInput,
                  name: "start_date",
                  label: "Start Date",
                  required: true,
                  minDate: new Date(),
                  onFieldUpdate: async (_, __, currentFormValues) => {
                    await validateDelegateeLevelExist(currentFormValues);
                  },
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
