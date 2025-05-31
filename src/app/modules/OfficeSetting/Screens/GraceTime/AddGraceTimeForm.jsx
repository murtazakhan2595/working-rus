import { addUpdateBranch } from "app/hooks/general";
import { GraceTime } from "app/utils/Types/OfficeSetting";
import { SheetUI } from "components";
import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { getGraceTimeList, getGraceTimeData } from "app/hooks/officeSetting";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import { Button } from "components/ui/button";
import { Switch } from "src/@/components/ui/switch";
import { Label } from "src/@/components/ui/label";
import { Formik } from "formik";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchBranches } from "state/slices/CommonSlice";
import { SelectLocationOnMap } from "components/FormControl";
import { SelectMultiInputComponent } from "components/FormControl";
import { NumberInput } from "components/FormControl";

const AddGraceTimeForm = ({ id = false, reloadData = () => {} , IsOpen=false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(IsOpen);
  const [FormData, setFormData] = useState(GraceTime);
  const [FormValues, setFormValues] = useState(GraceTime);
  const [GraceTimeList, setGraceTimeList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);
  const [NameExist, setNameExist] = useState(false);
  const [BranchExist, setBranchExist] = useState(false);
  const dispatch = useDispatch();

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
        setGraceTimeList(
          response.results?.map((item) => {
            return { name: item.name, id: item.id };
          })
        );
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
    if (isOpen) reloadData(true);
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await addUpdateBranch(values, id);
      if (response) {
        toast.success(
          `Branch ${isEditMode ? "Updated" : "Added"} Successfully!`,
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
      if (!branches) return false;

      const grace_time_name = GraceTimeList.filter(
        (grace_time) =>
          grace_time.name.toLowerCase() === branches.trim().toLowerCase() &&
          parseInt(grace_time.id) !== parseInt(id)
      );

      setBranchExist(grace_time_name.length > 0);
    },
    [GraceTimeList, id] // dependencies
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
          const errors = validateUserRoleFormSchema(values);
          if (values.name && NameExist)
            errors.name =
              "Role Name already exists. Please choose a different name";
          return errors;
        },
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFiels: [
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
                name: "description",
                label: "Branches",
                required: true,
                options: [],
                onFieldUpdate: (_, value) => {
                  validateGraceTimeBranches(value);
                },
              },
              {
                InputField: NumberInput,
                name: "description",
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
