
import {
  getApprovalHierarchyList,
  saveUpdateApprovalHierarchy,
  getApprovalHierarchyData
} from "app/hooks/approvalHierarchy";
import {
  ApprovalHierarchy,
  ApprovalLevel,
} from "app/utils/Types/ApprovalHierarchy";
import {
  TextAreaInput,
  TextInput,
  FilterInput,
  CheckBoxInputTree,
  SelectInputComponent,
} from "components/FormControl";
import { validateApprovalHierarchyFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI } from "components";
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

const AddUpdateApprovalHierarchy = ({
  isOpen = true,
  setReloadData = () => {},
  id=null,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS } = location.state || {};
  const [formValues, setFormValues] = useState(ApprovalHierarchy);
  const [UserRoles, setUserRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [HierarchyNameExist, setHierarchyNameExist] = useState(false);
  const [HierarchyRequestTypeExist, setHierarchyRequestTypeExist] =
    useState(false);
  const isEditMode = Boolean(id);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Hierarchy" : "Add New Hierarchy",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(ApprovalHierarchy);

  const fetchApprovalHierarchyData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available

      const response = await getApprovalHierarchyList();

      if (isMounted) {
        const HierarchyList = await response.results?.map((item) => {
          return { name: item.name, id: item.id ,request_type:item.request_type};
        });
        setUserRoles(HierarchyList);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchApprovalHierarchyData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getApprovalHierarchyData(id);
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
    setReloadData(true);
    if (GOTO_URLS)
      navigate(GOTO_URLS, {
        state: {
          // activeView: activeView,
          // projectId: taskProjectId,
        },
      });
    else {
      navigate(`/office-settings/approval-hierarchy`);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      // Save role
      const response = await saveUpdateApprovalHierarchy(values, id);
      if (response) {
        // Ensure table is reloaded
        toast.success(
          `Approval Hierarchy ${
            isEditMode ? "Updated" : "Added"
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

  const validateUserRoleName = useCallback(
    (name) => {
      if (!name) return false;
      const hierarchy_name = UserRoles.filter(
        (hierarchy) =>
          hierarchy.name.toLowerCase() === name.trim().toLowerCase() &&
          hierarchy.id !== id
      );
      setHierarchyNameExist(hierarchy_name.length > 0);
    },
    [UserRoles, id] // dependencies
  );
  const validateRequestType = useCallback(
    (request_type) => {
      if (!request_type) return false;

      const hierarchy_request_type = UserRoles.filter(
        (hierarchy) =>
          hierarchy.request_type === request_type && hierarchy.id !== id
      );

      setHierarchyRequestTypeExist(hierarchy_request_type.length > 0);
    },
    [UserRoles, id] // dependencies
  );

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        showBackButton={true}
        navigationLink={GOTO_URLS || "/office-settings/approval-hierarchy"}
      />
      <Card>
        <CardContent>
          <SheetUI
            isOpen={isOpen}
            setIsOpen={handleClose}
            variant="sheet"
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              onSubmitClick: (values) => {
                validateUserRoleName(values.name);
                validateRequestType(values.request_type);
              },
              renderUpdatedFormValues: setFormValues,
              validateFormSchema: (values) => {
                const errors = validateApprovalHierarchyFormSchema(values);
                if (values.name && HierarchyNameExist)
                  errors.name =
                    "Hierarchy Name already exists. Please choose a different name";
                if (values.request_type && HierarchyRequestTypeExist)
                  errors.request_type =
                    "Hierarchy with this request type already exists. Please choose a different type";
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
                  sheetCardTitle: `Approval Hierarchy Details`,
                  InputFields: [
                    {
                      InputField: TextInput,
                      name: "name",
                      required: true,
                      label: "Hierarchy Name",
                      onFieldUpdate: (_, value) => {
                        validateUserRoleName(value);
                      },
                    },
                    {
                      InputField: SelectInputComponent,
                      name: "request_type",
                      options: ApprovalHierarchyRequestType,
                      label: "Request Type",
                      onFieldUpdate: (_, value) => {
                        validateRequestType(value);
                      },
                    },
                   
                  ],
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

const ApprovalHierarchyDetails = React.memo(
  ({ name, onChange = () => {}, value = [] }) => {
    const [formData, setFormData] = useState({
      ...ApprovalLevel,
      level_number: value ? value?.length + 1 : 1,
    }); // Ensure ApprovalLevel is defined/imported
    const [openLevelForm, setOpenLevelForm] = useState(false);
    const Designations = useSelector((state) => state.common.designations);
    const Employees = useSelector((state) => state.emp.employees);

    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenLevelForm(true);
    };
    const handleLevelSubmit = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const existingLevels = value || [];
      const updatedLevels = [...existingLevels, formData];
      onChange(name, updatedLevels);
      setOpenLevelForm(false);
    };

    return (
      <div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {value && Array.isArray(value)
              ? value.map(
                  ({ level_number, assignment_type, designation, user }) => (
                    <>
                      <DetailBox
                        value={level_number}
                        label={"Level Number"}
                        variant="horizontal"
                      />
                      <DetailBox
                        value={assignment_type}
                        label={"Assignment Type"}
                        variant="horizontal"
                      />
                      <DetailBox
                        value={<DesignationName value={designation} />}
                        label={"Designation"}
                        variant="horizontal"
                      />
                    </>
                  )
                )
              : null}
          </div>
        </div>

        <Button variant="outline" onClick={handleClick}>
          Add Level
        </Button>
        {openLevelForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            <NumberInput
              name="level_number"
              value={formData.level_number}
              label="Level Number"
              disabled={true}
              onChange={(field, value) =>
                setFormData((prev) => {
                  const updatedForm = prev;
                  updatedForm[field] = value;
                  return updatedForm;
                })
              }
            />
            <SelectInputComponent
              name="assignment_type"
              value={formData.assignment_type}
              label="Assignment Type"
              options={[]}
              onChange={(field, value) =>
                setFormData((prev) => {
                  const updatedForm = prev;
                  updatedForm[field] = value;
                  return updatedForm;
                })
              }
            />
            {formData.assignment_type === "DESIGNATION" && (
              <SelectInputComponent
                name="designation"
                label="Designation"
                required={true}
                options={Designations}
                onChange={(field, value) =>
                  setFormData((prev) => {
                    const updatedForm = prev;
                    updatedForm[field] = value;
                    return updatedForm;
                  })
                }
              />
            )}
            {formData.assignment_type === "USER" && (
              <SelectInputComponent
                name="user"
                label="User"
                required={true}
                options={Employees}
                onChange={(field, value) =>
                  setFormData((prev) => {
                    const updatedForm = prev;
                    updatedForm[field] = value;
                    return updatedForm;
                  })
                }
              />
            )}
            <div className="cols-span-3">
              <Button onClick={handleLevelSubmit}>Add</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default AddUpdateApprovalHierarchy;
