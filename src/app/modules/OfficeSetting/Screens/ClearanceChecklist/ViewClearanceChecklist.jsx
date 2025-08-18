// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/ViewClearanceChecklist.jsx
import React from "react";
import { NavigationSheetComponent } from "components"; 
import { DetailContent } from "components";
import AddClearanceChecklistForm from "./AddClearanceChecklistForm";
import { FormatID } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";

const ViewClearanceChecklist = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Clearance type labels mapping
  const clearanceTypeLabels = {
    job_rotation: "Job Rotation",
    leave_clearance: "Leave Clearance",
    special_leave: "Special Leave",
    internal_transfer: "Internal Transfer",
    external_transfer: "External Transfer",
    resignation: "Resignation",
    termination: "Termination",
  };

  // Assignment scope labels mapping
  const assignmentScopeLabels = {
    direct: "Direct Reporting",
    indirect: "Indirect Reporting",
  };

  // Define the fields to display
  const fields = [
    {
      title: "Clearance Checklist Details",
      field: [
        {
          key: "id",
          label: "Id",
          formatter: (cell, row) => <FormatID value={cell} prefix={"CC-"} />,
        },
        { key: "name", label: "Checklist Name" },
        {
          key: "department",
          label: "Department",
          formatter: (cell) => <DepartmentName value={cell} />,
        },
        {
          key: "clearance_types",
          label: "Clearance Types",
          formatter: (cell) => {
            if (!cell || cell.length === 0) {
              return "--";
            }
            return (
              <div className="flex flex-wrap gap-1">
                {cell.map((type, index) => (
                  <StatusLabel key={index} variant={"info"}>
                    {clearanceTypeLabels[type] || type}
                  </StatusLabel>
                ))}
              </div>
            );
          },
        },
        {
          key: "assignment_scope",
          label: "Assignment Scope",
          formatter: (cell) => (
            <StatusLabel variant={"secondary"}>
              {assignmentScopeLabels[cell] || cell}
            </StatusLabel>
          ),
        },
        {
          key: "attached_document_required",
          label: "Document Required",
          formatter: (cell) => (
            <StatusLabel variant={cell ? "success" : "warning"}>
              {cell ? "Yes" : "No"}
            </StatusLabel>
          ),
        },
        {
          key: "e_signature_required",
          label: "E-Signature Required",
          formatter: (cell) => (
            <StatusLabel variant={cell ? "success" : "warning"}>
              {cell ? "Yes" : "No"}
            </StatusLabel>
          ),
        },
        {
          key: "status",
          label: "Status",
          formatter: (cell) => (
            <StatusLabel variant={cell === "active" ? "success" : "destructive"}>
              {cell === "active" ? "Active" : "Inactive"}
            </StatusLabel>
          ),
        },
        { key: "created_by", label: "Created By" },
        {
          key: "created_date",
          label: "Created Date",
          formatter: (cell) => {
            if (!cell) return "--";
            return new Date(cell).toLocaleDateString();
          },
        },
      ],
    },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      // TODO: Replace with actual API call
      // const response = await getClearanceChecklistData(id);
      
      // Mock data for now
      const response = {
        id: id,
        name: "Assets",
        department: "IT",
        clearance_types: ["job_rotation"],
        assignment_scope: "direct",
        attached_document_required: true,
        e_signature_required: false,
        status: "active",
        created_by: "HR Admin",
        created_date: "2025-01-15",
      };
      
      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching clearance checklist:", error);
    }
  };

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Clearance Checklist Details"
      currentItem_Id={currentId}
      dataList={DataList}
      reloadData={reloadData}
      editComponent={AddClearanceChecklistForm}
      apiEndpoint={"/clearance-checklist/${id}/"}
      fetchCurrentItemDetails={fetchData}
      deleteItemName="name"
      editTooltip="Edit Clearance Checklist"
      deleteTooltip="Delete Clearance Checklist"
    >
      <DetailContent title="Clearance Checklist Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default ViewClearanceChecklist;