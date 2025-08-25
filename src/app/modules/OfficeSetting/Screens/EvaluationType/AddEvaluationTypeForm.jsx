import { saveUpdateGraceTime } from "app/hooks/officeSetting";
import { GraceTime } from "app/utils/Types/OfficeSetting";
import { SheetUI } from "components";
import { intersection } from "lodash";
import { TextInput } from "components/FormControl";
import { getGraceTimeList, getGraceTimeData } from "app/hooks/officeSetting";
import { validateGraceTimeFormSchema } from "app/utils/FormSchema/officeSettingFormSchema";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { SelectMultiInputComponent } from "components/FormControl";
import { NumberInput } from "components/FormControl";

const AddGraceTimeForm = ({
  id = false,
  reloadData = () => {},
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(GraceTime);
  const [GraceTimeList, setGraceTimeList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);
  const [NameExist, setNameExist] = useState(false);
  const [BranchExist, setBranchExist] = useState(false);
  const Branches = useSelector((state) => state.common.branches);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Grace Time`,
    title: `${isEditMode ? "Edit" : "Add"} Grace Time`,
    description: null,
    footer: null,
  };

  const fetchGraceTimeData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available

      const response = await getGraceTimeList();

      if (isMounted) {
        setGraceTimeList(response.results);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchGraceTimeData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getGraceTimeData(id);
      if (isMounted) {
        setFormData(response);
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
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await saveUpdateGraceTime(values, id);
      if (response) {
        toast.success(
          `Grace Time ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose(); // Pass true to indicate successful update
      }
    } catch (error) {
      console.error("ERROR", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const validateGraceTimeName = useCallback(
    (name) => {
      if (!name) return false;

      const grace_time_name = GraceTimeList.filter(
        (grace_time) =>
          grace_time.name.toLowerCase() === name.trim().toLowerCase() &&
          parseInt(grace_time.id) !== parseInt(id)
      );

      setNameExist(grace_time_name.length > 0);
    },
    [GraceTimeList, id] // dependencies
  );
  const validateGraceTimeBranches = useCallback(
    (branches) => {
      if (!Array.isArray(branches) || branches.length === 0) {
        setBranchExist(false);
        return false;
      }

      const isConflict = GraceTimeList.some((grace_time) => {
        if (!Array.isArray(grace_time.branches)) return false;

        const overlap = intersection(grace_time.branches, branches);
        return overlap.length > 0 && parseInt(grace_time.id) !== parseInt(id);
      });

      setBranchExist(isConflict);
      return isConflict;
    },
    [GraceTimeList, id]
  );
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
        onSubmitClick: (values) => {
          validateGraceTimeName(values.name);
          validateGraceTimeBranches(values.name);
        },
        validateFormSchema: (values) => {
          const errors = validateGraceTimeFormSchema(values);
          if (values.name && NameExist)
            errors.name = "Name already exists. Please choose a different name";
          const branches = values.branches;
          if (
            branches &&
            Array.isArray(branches) &&
            branches.length > 0 &&
            BranchExist
          )
            errors.branches =
              "Grace time against branch already exists. Please choose a different branch";
          return errors;
        },
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Grace Time Details`,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Name",
                onFieldUpdate: (_, value) => {
                  validateGraceTimeName(value);
                },
              },
              {
                InputField: SelectMultiInputComponent,
                name: "branches",
                label: "Branches",
                required: true,
                options: Branches,
                onFieldUpdate: (_, value) => {
                  validateGraceTimeBranches(value);
                },
              },
              {
                InputField: NumberInput,
                name: "grace_time_minutes",
                required: true,
                label: "Grace Time (Min)",
                min: 1,
                max: 60,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddGraceTimeForm;
