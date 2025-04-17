import React, { useEffect, useState } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SalaryComponentColumns } from "app/modules/Payroll/Sections";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { SalaryTypeOptions } from "data/Data.js";
import { connect } from "react-redux";
import {
  saveEarnAndDeduction,
  getEarnAndDeduction,
} from "app/hooks/payroll.jsx";
import { getSalarySetupData } from "app/hooks/payroll.jsx";
import AddComponentSheet from "../../Sections/AddComponentSheet.jsx";
import { Button } from "components/ui/button";
import Header from "components/Header.jsx";

const SalaryComponents = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [componentFilterData, setComponentFilterData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [closeSheet, setCloseSheet] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [salarySetupData, setSalarySetupData] = useState([]);
  const [selectedIncomeType, setSelectedIncomeType] = useState("");
  const [selectedAmountType, setSelectedAmountType] = useState("");
  const [selectedIsActive, setSelectedIsActive] = useState("");
  const navigate = useNavigate();
  const [component, setComponent] = useState([]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    // onRowClick: (row) => {
    //   if (row.is_eos_applicable) {
    //     navigate(`/payroll/salary-setup-eos/${row.id}`);
    //   } else navigate(`/payroll/salary-setup/${row.id}`);
    // },
  };

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getEarnAndDeduction({
      options,
      filterData: { ...componentFilterData },
    });
    if (response) {
      setComponent(response.results);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [options, componentFilterData]);

  // Separate handler for Component filters
  const handleComponentFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    const updatedFilters = { ...componentFilterData };
    if (filterValue === "") {
      delete updatedFilters[filterName];
    } else {
      updatedFilters[filterName] = filterValue;
    }
    
    // Update the corresponding state based on filter name
    if (filterName === "income_type") {
      setSelectedIncomeType(filterValue);
    } else if (filterName === "amounts_types") {
      setSelectedAmountType(filterValue);
    } else if (filterName === "is_active") {
      setSelectedIsActive(filterValue);
    }
    
    setComponentFilterData(updatedFilters);
  };
  const onCheckedChange = async (value, component) => {
      const updatedComponent = { ...component, is_active: value };
      const response = await saveEarnAndDeduction(updatedComponent);
      if (response) {
        setComponent((prevState) =>
          prevState.map((item) =>
            item.id === updatedComponent.id ? updatedComponent : item
          )
        );
      }
    };
  const handleClose = () => {
    setIsOpen(false);
    setCloseSheet(true);
    fetchData();
  };

  const handleDeleteComponent = async (componentId) => {
    setIsLoading(true);
    try {
      // Implement your delete API call here
      // const response = await deleteEarnAndDeduction(componentId);
      // if (response) {
      //   // Success message if needed
      // }
      // Refresh data after deletion
      await fetchData();
    } catch (error) {
      console.error("Error deleting component:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function specifically for component addition
  const handleAddComponent = () => {
    setSelectedComponent(null); // Ensure we're creating a new component
    setIsOpen(true);
  };

  // Modified to add the component to state directly for immediate UI update
  const handleComponentAdded = (newComponent) => {
    // Update the component list without waiting for API fetch
    setComponent(prevComponents => [newComponent, ...prevComponents]);
    
    // Still fetch fresh data to ensure everything is in sync
    fetchData();
    
    // Close the sheet
    setIsOpen(false);
    setCloseSheet(true);
  };

  return (
    <div className="relative">
      {!isOpen && (
        <Button
          variant="default"
          size="default"
          onClick={handleAddComponent}
          className="absolute top-[-176px] right-[10px] z-10"
        >
          Add Component
        </Button>
      )}
      
      <div className="flex items-center justify-between mt-12">
        <div className="inline-flex flex-col items-start justify-center">
          <div className="self-stretch text-[#ab4aba] text-2xl font-medium  leading-normal">
            {"Components"}
          </div>
          <div className="self-stretch text-[#8b8d98] text-sm font-normal  leading-[16.80px]">
            {"Types details are listed here"}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Component Name",
                name: "name",
              },
              {
                type: "select-one",
                option: [
                  { value: "earning", label: "Earning" },
                  { value: "deduction", label: "Deduction" },
                ],
                name: "income_type",
                placeholder: "Component Type",
                values: selectedIncomeType,
              },
              {
                type: "select-three",
                option: [
                  { value: "fixed", label: "Fixed" },
                  { value: "percentage", label: "Variable" },
                ],
                name: "amounts_types",
                placeholder: "Amount Type",
                values: selectedAmountType,
              },
              {
                type: "select-two",
                option: [
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ],
                name: "is_active",
                placeholder: "All",
                values: selectedIsActive,
              },
            ]}
            onChange={handleComponentFilterChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 profile-management">
        {handleCloseWithConfirmation({
          isOpen: closeSheet,
          setCloseSheet,
          setIsOpen,
        })}
        {isOpen && (
          <AddComponentSheet
            component={selectedComponent}
            isOpen={isOpen}
            setIsOpen={handleClose}
            onSuccess={handleComponentAdded}
            existingComponents={component}
          />
        )}

        {isLoading ? (
          <PageLoader />
        ) : (
          <CustomTable
            data={component}
            columns={SalaryComponentColumns(onCheckedChange, handleComponentAdded, component)}
            pagination={true}
            dataTotalSize={0}
            tableOptions={tableOptions}
          />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(SalaryComponents);
