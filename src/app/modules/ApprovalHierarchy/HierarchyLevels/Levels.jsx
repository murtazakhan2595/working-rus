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
import { HierarchyLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
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

const Levels = React.memo(({ HierarchyLevels = [] }) => {
    console.log(HierarchyLevels,'HierarchyLevels');
  return (
    <TableCustom
      columns={HierarchyLevelsColumn()}
      data={HierarchyLevels || []}
      dataTotalSize={HierarchyLevels?.length || 0}
      pagination={false}
      className="ApprovalHierarchies-table"
    />
  );
});

export default Levels;
