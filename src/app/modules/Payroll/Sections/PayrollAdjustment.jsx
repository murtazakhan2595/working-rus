import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card.jsx";
import { AdjustmentComponentColumns } from "app/modules/Payroll/Sections";
import CustomTable from "components/CustomTable";
import Header from "../../../../components/Header.jsx";
import { FilterInput } from "components/FormControl";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { getEarnAndDeduction } from "app/hooks/payroll.jsx";
import { saveEarnAndDeduction } from "app/hooks/payroll.jsx";
import AddAdjustmentSheet from "./AddAdjustmentSheet.jsx";
import { handleCloseWithConfirmation } from "components/SheetCardExtension.jsx";
import { getEmployeeEarnAndDeduction } from "app/hooks/payroll.jsx";

const PayrollAdjustment = ({ componentFilterData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [adjustment, setAdjustment] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [adjustmentComponent, setAdjustmentComponent] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setIsOpen(true);
      setAdjustmentComponent(row);
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getEmployeeEarnAndDeduction({
      options,
      filterData: { ...componentFilterData },
    });
    if (response) {
      setAdjustment(response.results);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, [options, componentFilterData]);


  const handleClose = () => {
    setIsOpen(false)
    setCloseSheet(true);
  };

  return (
    <div className="flex flex-col gap-4 profile-management">
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      {adjustmentComponent && (
        <AddAdjustmentSheet
          adjustment={adjustmentComponent}
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
          data={adjustment}
          columns={AdjustmentComponentColumns}
          pagination={true}
          dataTotalSize={adjustment.length}
          tableOptions={tableOptions}
        />
      )}
    </div>
  );
};

export default PayrollAdjustment;
