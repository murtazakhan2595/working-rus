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

const AddUpdateHierarchyLevels = React.memo(
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
    const handleLevelSubmit = (values) => {
      const existingLevels = value || [];
      const updatedLevels = [...existingLevels, values];
      onChange(name, updatedLevels);
      setOpenLevelForm(false);
    };
    const FormSheetData = {
      triggerText: "",
      title: "Add Level",
      description: null,
      footer: null,
    };
    return (
      <div>
        <div>
          <Levels HierarchyLevels={value} />
        </div>
        <Button variant="outline" onClick={handleClick}>
          Add Level
        </Button>
        {openLevelForm && (
          <AddUpdateLevels
            isOpen={openLevelForm}
            currentLevelNo={value ? value.length + 1 : 1}
            AddLevel={handleLevelSubmit}
          />
        )}
      </div>
    );
  }
);

export default AddUpdateHierarchyLevels;
