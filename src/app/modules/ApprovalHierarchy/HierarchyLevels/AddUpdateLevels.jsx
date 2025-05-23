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
import { validateHierarchyLevelFormSchema } from "app/utils/FormSchema/ApprovalHierarchyFormSchema";
import {
  HierarchyLevelsColumn,
  Levels,
} from "app/modules/ApprovalHierarchy/Sections";
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

const AddUpdateLevels = React.memo(
  ({ isOpen, AddLevel = () => {}, currentLevelNo = 1, currentLevel }) => {
    const formData = currentLevel
      ? currentLevel
      : { ...ApprovalLevel, level_number: currentLevelNo }; // Ensure ApprovalLevel is defined/imported
    const Designations = useSelector((state) => state.common.designations);
    const Employees = useSelector((state) => state.emp.employees);

    const handleLevelSubmit = (values) => {
      AddLevel(values);
    };
    const FormSheetData = {
      triggerText: "",
      title: "Add Level",
      description: null,
      footer: null,
    };
    return (
      <SheetUI
        isOpen={isOpen}
        setIsOpen={() => {}}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: formData,
          enableReinitialize: true,
          handleSubmit: handleLevelSubmit,
          // onSubmitClick: (values) => {
          //   validateUserRoleName(values.name);
          //   validateRequestType(values.request_type);
          // },
          //  renderUpdatedFormValues: setFormValues,
          validateFormSchema: (values) => {
            const errors = validateHierarchyLevelFormSchema(values);
            return errors;
          },
          submitButtonText: "Add Level",
          cancelButtonText: "Cancel",
          columns: 2,
          // disableSubmit: isLoading || isSubmittingForm,
          // loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFiels: [
            {
              sheetCardExtension: false,
              InputFields: [
                {
                  InputField: NumberInput,
                  name: "level_number",
                  label: "Level Number",
                  required: true,
                },
                {
                  InputField: SelectInputComponent,
                  name: "designation",
                  label: "Designation",
                  options: Designations,
                  required: true,
                },
                {
                  InputField: CheckBoxInput,
                  name: "is_final_approval",
                  label: "Final Approver",
                  description:
                    "If selected this level will be the final approver",
                },
              ],
            },
          ],
        }}
      />
    );
  }
);

export default AddUpdateLevels;
