import {
  getApprovalHierarchyList,
  saveUpdateApprovalHierarchy,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  ApprovalHierarchy,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import { TextInput, SelectInputComponent } from "components/FormControl";
import { validateAddHierarchyLevelsForm } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import { deleteRecord } from "app/hooks/general";
import { AddUpdateDelegateLevels } from "app/modules/ApprovalHierarchy";
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
import AlertDialogue from "components/ui/AlertDialogue";
import { SwitchInput } from "components/FormControl";
import { CardTitle } from "reactstrap";
import { CardDescription } from "components/ui/card";
import { CheckBoxInput } from "components/FormControl";
import { SelectMultiInputComponent } from "components/FormControl";
import { errorClassName } from "components/FormControl";
import isEqual from "lodash/isEqual";
import { CircleX } from "lucide-react";

const AddEditApprovalHierarchyLevels = ({
  isOpen = true,
  setReloadData = () => {},
  id = null,
  request_initiative, // if edit, contains list request initiators to edit
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS } = location.state || {};
  const [HierarchyData, setHierarchyData] = useState({});
  const [formValues, setFormValues] = useState(ApprovalHierarchy);
  const [FormData, setFormData] = useState(ApprovalHierarchy);
  const [UserRoles, setUserRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [HierarchyNameExist, setHierarchyNameExist] = useState(false);
  const [HierarchyRequestTypeExist, setHierarchyRequestTypeExist] =
    useState(false);
  const isEditMode = Boolean(request_initiative?.length);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const Designations = useSelector((state) => state.common.designations);
  const FormSheetData = {
    triggerText: "",
    title: "Add Approval Hierarchy Levels",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getApprovalHierarchyData(id);
      // Handles mounting and form population in edit mode
      if (isMounted) {
        if (isEditMode) {
          const hierarchy = response;
          const requestInitiatorToEdit = request_initiative || [];

          // Filter levels matching the current request initiator
          const levelsToEdit =
            hierarchy.levels?.filter((level) =>
              isEqual(
                [...(level.initiative_designation || [])].sort(),
                [...requestInitiatorToEdit].sort()
              )
            ) || [];

          // Set form data with filtered levels and request initiator
          const updatedForm = {
            ...ApprovalHierarchy,
            request_initiative: requestInitiatorToEdit,
            levels: levelsToEdit,
          };

          setFormData(updatedForm);
          setFormValues(updatedForm);

          // Identify initiators that are not editable (not in current edit context)
          const requestInitiatorsNonEditable = (
            response.request_initiative || []
          ).filter((initiator) => !requestInitiatorToEdit.includes(initiator));

          // Identify levels not included in edit set
          const levelsToEditIds = new Set(
            levelsToEdit.map((level) => level.id)
          );
          const levelsNonEdit = (hierarchy.levels || []).filter(
            (level) => !levelsToEditIds.has(level.id)
          );

          // Set hierarchy data (if needed elsewhere)
          setHierarchyData({
            ...hierarchy,
            request_initiative: requestInitiatorsNonEditable,
            levels: levelsNonEdit,
          });
        } else {
          setHierarchyData(response);
        }
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
    setReloadData();
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const payload = HierarchyData;
      const newLevels = await values?.levels?.map((level) => ({
        ...level,
        initiative_designation: values.request_initiative,
      }));
      payload.levels = [...HierarchyData.levels, ...newLevels];
      payload.request_initiative = [
        ...HierarchyData.request_initiative,
        ...values.request_initiative,
      ];
      const response = await saveUpdateApprovalHierarchy(payload, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Levels ${
            isEditMode ? "Updated" : "Added"
          } for Approval Hierarchy`,
          description: `Levels have been successfully ${
            isEditMode ? "updated" : "added"
          } against request initiator in ${(
            HierarchyData.name || ""
          ).toLowerCase()} approval hierarchy`,
        };
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
        renderUpdatedFormValues: setFormValues,
        validateFormSchema: (values) => {
          const errors = validateAddHierarchyLevelsForm(
            values,
            HierarchyData.request_initiative
          );
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
            sheetCardTitle: `Approval Hierarchy Detail`,
            InputFields: [
              {
                InputField: SelectMultiInputComponent,
                name: "request_initiative",
                options: Designations,
                label: "Request Initiator",
                onFieldUpdate: (_, value) => {
                  // validateRequestType(value);
                },
                colsSpan:2,
              },
            ],
          },
          // Conditionally render levels from formValues.level
          ...(formValues?.levels
            ? formValues.levels.map((level, index) => ({
                sheetCardExtension: true,
                sheetCardTitle: `Approval Hierarchy Level ${level.level_number}`,
                InputFields: [
                  {
                    InputField: SelectInputComponent,
                    name: `levels[${index}].designation`,
                    label: "Designation",
                    options: Designations,
                    required: true,
                  },
                  {
                    InputField: RemoveHierarchyLevels,
                    name: "levels",
                    level: level,
                  },
                  {
                    InputField: CheckBoxInput,
                    name: `levels[${index}].auto_forward_enabled`,
                    label: "Auto Forward",
                  },
                  ...(level.auto_forward_enabled
                    ? [
                        {
                          InputField: NumberInput,
                          name: `levels[${index}].auto_forward_threshold`,
                          label: "Auto Farward Threshold Type",
                          description:
                            "Add the thershold time in hours. Request will be forwarded to next level automatically if not responded in mentioned time",
                          min: 1,
                        },
                      ]
                    : []),
                  {
                    InputField: CheckBoxInput,
                    name: `levels[${index}].is_final_approval`,
                    label: "Final Approver",
                    description:
                      "If selected this level will be the final approver",
                    colsSpan: 2,
                  },
                ],
              }))
            : []),
          {
            sheetCardExtension: false,
            sheetCardTitle: `Approval Hierarchy Level`,
            InputFields: [
              {
                InputField: AddNewHierarchyLevels,
                name: "levels",
                colsSpan: 3,
              },
            ],
          },
        ],
      }}
    />
  );
};

const AddNewHierarchyLevels = React.memo(
  ({ name, onChange = () => {}, value = [], error }) => {
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const updatedLevels = [
        ...(value || []),
        { ...ApprovalLevel, level_number: value ? value.length + 1 : 1 },
      ];
      onChange(name, updatedLevels);
    };
    return (
      <div>
        <Button variant="outline" onClick={handleClick}>
          Add Level
        </Button>
        <div className={errorClassName}>{error}</div>
      </div>
    );
  }
);

const RemoveHierarchyLevels = React.memo(
  ({ name, onChange = () => {}, value = [], error, level }) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!level.id && !level.designation) confirmDelete();
      else setOpenDeleteConfirm(true);
    };
    const confirmDelete = async () => {
      try {
        if (!level) return;

        if (level.id)
          await deleteRecord(
            `/levels/${level.id}`,
            `Level No ${level.level_number || ""}`
          );

        const remaining_levels = value.filter(
          (levels) => levels.level_number !== level.level_number
        );
        onChange(name, remaining_levels || []);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setOpenDeleteConfirm(false);
      }
    };
    if (level.level_number !== value.length) return null;
    return (
      <div className="relative">
        <Button
          variant="icon"
          onClick={handleClick}
          className="absolute top-[-20px] right-[-10px]"
        >
          <CircleX size={22} className="text-red-700" />
        </Button>
        {openDeleteConfirm && (
          <AlertDialogue
            title="Confirm Delete?"
            description={`This action can't be undone. All information associated with this level will be lost.`}
            isOpen={openDeleteConfirm}
            setIsOpen={() => setOpenDeleteConfirm(false)}
            handleContinue={confirmDelete}
          />
        )}
      </div>
    );
  }
);

export default AddEditApprovalHierarchyLevels;
