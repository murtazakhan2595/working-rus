// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/AddClearanceChecklistForm.jsx
import {
  saveUpdateClearanceChecklist,
  getClearanceChecklistList,
  getClearanceChecklistData,
  getClearanceTypeList,
} from "app/hooks/officeSetting";
import { SheetUI } from "components";
import {
  TextInput,
  SelectInputComponent,
  SelectMultiInputComponent,
  SwitchInput,
  CoverFileUpload,
} from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddClearanceChecklistForm = ({
  id = false,
  reloadData = () => {},
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [FormData, setFormData] = useState({
    name: "",
    department: [],
    clearance_types: [],
    assignment_scope: "",
    e_signature_required: false,
    attached_document: null,
    status: "ACTIVE",
  });
  const [NameExist, setNameExist] = useState(false);
  const [ClearanceChecklistList, setClearanceChecklistList] = useState([]);
  const [ClearanceTypeOptions, setClearanceTypeOptions] = useState([]);

  const isEditMode = Boolean(id);
  const Departments = useSelector((state) => state.common.departments);

  // Assignment Scope options
  const assignmentScopeOptions = [
    { value: "DIRECT", label: "Direct Reporting" },
    { value: "INDIRECT", label: "Indirect Reporting" },
  ];

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Clearance Checklist`,
    title: `${isEditMode ? "Edit" : "Add"} Clearance Checklist`,
    description: null,
    footer: null,
  };

  const fetchClearanceChecklistData = async (isMounted) => {
    try {
      setIsLoading(true);
      const response = await getClearanceChecklistList();

      if (isMounted) {
        setClearanceChecklistList(response.results || []);
      }
    } catch (error) {
      console.error("Error fetching clearance checklist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClearanceTypes = async (isMounted) => {
    try {
      const response = await getClearanceTypeList();
      if (isMounted) {
        const options = response?.results.map((type) => ({
          value: type.id,
          label: type.name,
        }));
        setClearanceTypeOptions(options);
      }
    } catch (error) {
      console.error("Error fetching clearance types:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchClearanceChecklistData(isMounted);
    fetchClearanceTypes(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getClearanceChecklistData(id);

      if (isMounted) {
        setFormData(response);
      }
    } catch (error) {
      console.error("Error fetching clearance checklist data:", error);
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

  // Sync file upload visibility with form data
  useEffect(() => {
    setShowFileUpload(FormData.e_signature_required);
  }, [FormData.e_signature_required]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await saveUpdateClearanceChecklist(values, id);

      if (response) {
        toast.success(
          `Clearance Checklist ${
            isEditMode ? "Updated" : "Added"
          } Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      console.error("ERROR", error);
      toast.error("An error occurred while saving the checklist item.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const validateChecklistName = useCallback(
    (name) => {
      if (!name) return false;

      const existingChecklist = ClearanceChecklistList.filter(
        (checklist) =>
          checklist.name.toLowerCase() === name.trim().toLowerCase() &&
          parseInt(checklist.id) !== parseInt(id)
      );

      setNameExist(existingChecklist.length > 0);
    },
    [ClearanceChecklistList, id]
  );

  const validateFormSchema = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Checklist name is required";
    } else if (NameExist) {
      errors.name = "Name already exists. Please choose a different name";
    }

    if (!values.department || values.department.length === 0) {
      errors.department = "At least one department is required";
    }

    if (!values.clearance_types || values.clearance_types.length === 0) {
      errors.clearance_types = "At least one clearance type is required";
    }

    if (!values.assignment_scope) {
      errors.assignment_scope = "Assignment scope is required";
    }

    // File validation when e_signature_required is true
    if (values.e_signature_required && !values.attached_document) {
      errors.attached_document =
        "Attached document is required when e-signature is enabled";
    }

    return errors;
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
        onSubmitClick: (values) => {
          validateChecklistName(values.name);
        },
        validateFormSchema: validateFormSchema,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Clearance Checklist Details`,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Checklist Name",
                placeholder: "e.g., Assets, Finance Dues",
                onFieldUpdate: (_, value) => {
                  validateChecklistName(value);
                },
              },
              {
                InputField: SelectMultiInputComponent,
                name: "department",
                label: "Clearance Department",
                required: true,
                options: Departments,
                placeholder: "Select departments",
              },
              {
                InputField: SelectMultiInputComponent,
                name: "clearance_types",
                label: "Clearance Types",
                required: true,
                options: ClearanceTypeOptions,
                placeholder: "Select one or more clearance types",
              },
              {
                InputField: SelectInputComponent,
                name: "assignment_scope",
                label: "Clearance Assignment Scope",
                required: true,
                options: assignmentScopeOptions,
                placeholder: "Select assignment scope",
              },
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: `Document Requirements`,
            InputFields: [
              {
                InputField: SwitchInput,
                name: "e_signature_required",
                label: "E-Signature Required from Employee",
                field_description:
                  "Whether employee e-signature is required for this checklist item",
                onFieldUpdate: (_, value) => {
                  setShowFileUpload(value);
                },
              },
              // Conditionally add file upload field
              ...(showFileUpload
                ? [
                    {
                      InputField: CoverFileUpload,
                      name: "attached_document",
                      required: true,
                      label: "Attached Document",
                      variant: "AttachmentFileUpload",
                      allowUpdate: true,
                      multiple: false,
                      field_description:
                        "Upload document required for this checklist item",
                    },
                  ]
                : []),
            ],
          },
        ],
      }}
    />
  );
};

export default AddClearanceChecklistForm;
