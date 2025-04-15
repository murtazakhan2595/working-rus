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

const SalaryComponents = ({ departments }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [componentFilterData, setComponentFilterData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [closeSheet, setCloseSheet] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
    const [salarySetupData, setSalarySetupData] = useState([]);
  const navigate = useNavigate();
  const [component, setComponent] = useState([]);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      if (row.is_eos_applicable) {
        navigate(`/payroll/salary-setup-eos/${row.id}`);
      } else navigate(`/payroll/salary-setup/${row.id}`);
    },
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
    setComponentFilterData(updatedFilters); // Update component filters
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
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex-col justify-center items-start inline-flex">
          <div className="self-stretch text-[#ab4aba] text-2xl font-medium  leading-normal">
            {"Components"}
          </div>
          <div className="self-stretch text-[#8b8d98] text-sm font-normal  leading-[16.80px]">
            {"Types details are listed here"}
          </div>
        </div>
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
            },
            {
              type: "select-two",
              option: [
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ],
              name: "is_active",
              placeholder: "Active",
            },
          ]}
          onChange={handleComponentFilterChange} // Dynamic filter handler
        />
      </div>
      <div className="flex flex-col gap-4 profile-management">
        {handleCloseWithConfirmation({
          isOpen: closeSheet,
          setCloseSheet,
          setIsOpen,
        })}
        {selectedComponent && (
          <AddComponentSheet
            component={selectedComponent}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            reload={fetchData}
            onClose={handleClose}
          />
        )}

        {isLoading ? (
          <PageLoader />
        ) : (
          <CustomTable
            data={component}
            columns={SalaryComponentColumns(onCheckedChange)}
            pagination={true}
            dataTotalSize={0}
            tableOptions={tableOptions}
          />
        )}
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(SalaryComponents);
