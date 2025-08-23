// src/app/modules/OfficeSetting/Screens/ClearanceChecklist/ViewClearanceChecklist.jsx
import { NavigationSheetComponent } from "components";
import { DetailContent } from "components";
import AddClearanceChecklistForm from "./AddClearanceChecklistForm";
import { FormatID } from "utils/getValuesFromTables";
import { DepartmentName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import {
  getClearanceChecklistData,
  getClearanceTypeList,
} from "app/hooks/officeSetting";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { MultiStatusLabel } from "components";
import AttachmentUI from "components/ui/AttachmentUI";

const ViewClearanceChecklist = ({
  isOpen,
  setIsOpen,
  currentId,
  reloadData = () => {},
  DataList = [],
}) => {
  // Get departments from Redux for ID to name mapping
  const Departments = useSelector((state) => state.common.departments);

  // State for clearance types
  const [clearanceTypes, setClearanceTypes] = useState([]);

  // Fetch clearance types on component mount
  useEffect(() => {
    let isMounted = true;
    const fetchClearanceTypes = async () => {
      try {
        const response = await getClearanceTypeList();
        if (isMounted && response?.results) {
          setClearanceTypes(response.results);
        }
      } catch (error) {
        console.error("Error fetching clearance types:", error);
      }
    };
    fetchClearanceTypes();
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to get department names from IDs
  const getDepartmentNames = (departmentIds) => {
    if (
      !departmentIds ||
      !Array.isArray(departmentIds) ||
      departmentIds.length === 0
    ) {
      return "All Departments";
    }

    const names = departmentIds
      .map((id) => {
        const dept = Departments?.find((d) => d.value === id || d.id === id);
        return dept ? dept.label || dept.name : `Dept-${id}`;
      })
      .filter(Boolean);

    return names.length > 0 ? names.join(", ") : "Unknown Departments";
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
        {
          key: "name",
          label: "Checklist Name",
          formatter: (cell) => <span className="font-medium">{cell}</span>,
        },
        {
          key: "department",
          label: "Departments",
          formatter: (cell) => {
            const departmentNames = getDepartmentNames(cell);
            if (departmentNames === "All Departments") {
              return (
                <StatusLabel variant="outline">All Departments</StatusLabel>
              );
            }

            // If multiple departments, show them as individual labels
            if (Array.isArray(cell) && cell.length > 1) {
              const names = cell
                .map((id) => {
                  const dept = Departments?.find(
                    (d) => d.value === id || d.id === id
                  );
                  return dept ? dept.label || dept.name : `Dept-${id}`;
                })
                .filter(Boolean);

              return (
                <div className="flex flex-wrap gap-1">
                  {names.map((name, index) => (
                    <StatusLabel key={index} variant="info">
                      {name}
                    </StatusLabel>
                  ))}
                </div>
              );
            }

            return departmentNames;
          },
        },
        {
          key: "clearance_types",
          label: "Clearance Types",
          formatter: (cell) => {
            if (!cell || cell.length === 0) {
              return "--";
            }
            const clearanceTypeNames = cell
              ?.map((typeId) => {
                const type = clearanceTypes.find(
                  (t) => t?.value === typeId || t?.id === typeId
                );
                return type?.label || type?.name;
              })
              ?.filter(Boolean);
            return (
              <MultiStatusLabel
                statusList={clearanceTypeNames}
                variant="info"
                fallBackText="All Clearance Types"
                displayCount={5} // Show first 5 types, then +X more
              />
            );
          },
        },
        {
          key: "assignment_scope",
          label: "Assignment Scope",
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
            <StatusLabel
              variant={cell === "ACTIVE" ? "success" : "destructive"}
            >
              {cell === "ACTIVE" ? "Active" : "Inactive"}
            </StatusLabel>
          ),
        },
        {
          key: "created_by_name",
          label: "Created By",
        },
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
      const response = await getClearanceChecklistData(id);

      if (isMounted) {
        return response;
      }
    } catch (error) {
      console.error("Error fetching clearance checklist:", error);
      return {};
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
      apiEndpoint={"/clearance-checklists/${id}/"}
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
