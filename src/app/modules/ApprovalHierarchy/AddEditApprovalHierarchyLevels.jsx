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
import { validateApprovalHierarchyFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import { AddUpdateHierarchyLevels } from "app/modules/ApprovalHierarchy";
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

const AddEditApprovalHierarchyLevels = ({
  isOpen = true,
  setReloadData = () => {},
  id = null,
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
  const Designations = useSelector((state) => state.common.designations);
  const FormSheetData = {
    triggerText: "",
    title: "Add Levels",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(ApprovalHierarchy);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getApprovalHierarchyData(id);
      if (isMounted) {
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

  const handleClose = () => {
    setReloadData();
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
    debugger;
    try {
      const payload = values;
      payload.levels = await values?.levels?.map((level) => ({
        ...level,
        initiative_designation: [values.initiative_designation],
      }));
      const response = await saveUpdateApprovalHierarchy(payload, id);
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
          parseInt(hierarchy.id) !== parseInt(id)
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
          <TableCustom
            columns={HierarchyLevelsColumn(fetchData)}
            data={formValues?.levels || []}
            dataTotalSize={formValues?.levels?.length || 0}
            pagination={false}
            className="ApprovalHierarchiesLevels-table"
          />
          <SheetUI
            isOpen={isOpen}
            setIsOpen={handleClose}
            variant="sheet"
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              // onSubmitClick: (values) => {
              //   validateUserRoleName(values.name);
              //   validateRequestType(values.request_type);
              // },
              renderUpdatedFormValues: setFormValues,
              validateFormSchema: (values) => {
                // const errors = validateApprovalHierarchyFormSchema(values);
                // if (values.name && HierarchyNameExist)
                //   errors.name =
                //     "Hierarchy Name already exists. Please choose a different name";
                // if (values.request_type && HierarchyRequestTypeExist)
                //   errors.request_type =
                //     "Hierarchy with this request type already exists. Please choose a different type";
                return {};
              },
              submitButtonText: "Submit",
              cancelButtonText: "Cancel",
              columns: 2,
              disableSubmit: isLoading || isSubmittingForm,
              loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
              formFiels: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Approval Hierarchy Level`,
                  InputFields: [
                    {
                      InputField: SelectInputComponent,
                      name: "initiative_designation",
                      options: Designations,
                      label: "Request Initiator",
                      onFieldUpdate: (_, value) => {
                        // validateRequestType(value);
                      },
                    },
                    {
                      InputField: AddUpdateHierarchyLevels,
                      name: "levels",
                      colsSpan: 3,
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

export default AddEditApprovalHierarchyLevels;
