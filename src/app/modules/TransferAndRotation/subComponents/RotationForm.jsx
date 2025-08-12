import React, { useEffect, useState } from "react";
import { CardTitle, CardHeader } from "components/ui/card";
import { Card, CardContent } from "components/ui/card";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import { PageLoader, TableCustom } from "components";
import { GetJobRotation } from "app/hooks/Rotation";
import { useSelector } from "react-redux";

const RotationForm = () => {
  const [data, Setdata] = useState([]);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const prepareData = [];
  const onPageChange = (name, value) => {
    console.log("onPageChange called:", name, value);
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const fetchData = async () => {
    const res = await GetJobRotation();
    return res;
  };

  useEffect(() => {
    fetchData()
      .then((res) => {
        console.log(res);
        Setdata(res);
      })
      .catch((err) => {
        console.error("Error fetching job rotation data:", err);
      });
  }, []);

  const isLoading = false;
  const Designations = useSelector((state) => state.common.designations);
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);

  function getDepartmentName(departmentId) {
    const dept = Departments.find((d) => d.id === departmentId);
    return dept ? dept.name : "";
  }

  function getDesignationName(designationId) {
    const desig = Designations.find((d) => d.id === designationId);
    return desig ? desig.name : "";
  }

  function getBranchName(branchId) {
    const branch = Branches.find((b) => b.id === branchId);
    return branch ? branch.name : "";
  }

  function formatRotationCapTime(value) {
    if (!value) return "-";
    return new Date(value * 1000).toLocaleDateString();
  }

  const JobRotationColumns = [
    {
      text: "Request ID",
      dataField: "id",
    },
    {
      text: "Employee Name",
      dataField: "employee_name",
    },
    {
      text: "Current Department",
      dataField: "old_department",
      formatter: (cell) => {
        return getDepartmentName(cell);
      },
    },
    {
      text: "Requested Department",
      dataField: "new_department",
      formatter: (cell) => {
        return getDepartmentName(cell);
      },
    },
    {
      text: "Rotation Start Date",
      dataField: "rotation_cap_time",
      formatter: (cell) => {
        return formatRotationCapTime(cell);
      },
    },
    {
      text: "Rotation End Date",
      dataField: "rotation_expiry_date",
    },
    {
      text: "Status",
      dataField: "status",
      formatter: (cell) => {
        let color =
          cell === "approved" ? "green" : cell === "pending" ? "orange" : "red";
        return <span style={{ color }}>{cell}</span>;
      },
    },
    {
      text: "Actions",
      dataField: "actions",
      formatter: (cell, row) => <EmployeeAction row={row} />,
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Employee Rotation History</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length < 0 ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={data.results}
              columns={JobRotationColumns}
              pagination={true}
              dataTotalSize={data.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default RotationForm;
