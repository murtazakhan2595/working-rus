import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { PayrunEmployeePayrollColumns } from "app/modules/Payroll/Sections";
import CustomTable from "components/CustomTable";
import { getDropdownList } from "utils/Lists";
import { getEmployeePayroll } from "app/hooks/payroll";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getPayrollSummary } from "app/hooks/payroll";
import { CircleCheckBig } from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "../../../../src/@/components/ui/dialog.jsx";
import { savePayrun } from "app/hooks/payroll";
import moment from "moment";
import { getPayun } from "app/hooks/payroll";
import { getEmpPayrolDetails } from "app/hooks/payroll";
import { PageLoader } from "components";
import AlertDialogue from "components/ui/AlertDialogue";
import { DateInput, MonthInput, DateRangeInput } from "components/FormControl";
import { Formik } from "formik";
import { GenderOptions, countriesList } from "data/Data";
import { PayRun } from "app/utils/Types/Payroll";
import { validateGeneratePayRun } from "app/utils/FormSchema/payrollFormSchema";
import { SelectMultiInputComponent } from "components/FormControl";
const CreatePayRun = () => {
  const formRef = React.createRef();
  const [Errors, setErrors] = useState({});
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [component, setComponent] = useState([]);
  const [withheldRows, setWithheldRows] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [payrollData, setPayrollData] = useState([]);
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.userProfile);
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const Managers = useSelector((state) => state.emp.reportingManagers);
  const [payrunSubmitDialog, setPayrunSubmitDialog] = useState(false);
  const [payrunConfirmationDialog, setPayrunConfirmationDialog] =
    useState(false);
  const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
  const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");
  const [payrunDraft, setPayrunDraft] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchEmpPayrolData = async (isMounted) => {
    const response = await getEmpPayrolDetails({ filterData });
    if (response && isMounted) {
      const employeeOptions = getDropdownList(
        response.results,
        "name",
        "employee",
        "serial_number",
        "-"
      );
      setEmployeeData(employeeOptions);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchEmpPayrolData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const earnAndDeductions = await getEarnAndDeduction({
  //       filterData: { is_active: true },
  //     });
  //     if (earnAndDeductions) {
  //       setComponent(earnAndDeductions.results);
  //     }
  //     const payRunData = await getPayun({
  //       filterData: { date_range: `${currentMonthStart},${currentMonthEnd}` },
  //     });
  //     if (payRunData) {
  //       const payRun = payRunData?.results[0];
  //       setPayrunDraft(payRun);
  //       setWithheldRows(payRun?.excluded_employees || []);
  //       setPayrollData([
  //         {
  //           title: "Payroll Cost",
  //           value: payRun?.gross_amount,
  //         },
  //         {
  //           title: "Employees' Net Pay",
  //           value: payRun?.net_amount,
  //         },
  //         {
  //           title: "Total Employees'",
  //           value: payRun?.total_employees,
  //         },
  //       ]);
  //     }
  //     if (payRunData?.count === 0) {
  //       const payrollSummary = await getPayrollSummary();
  //       if (payrollSummary) {
  //         const updatedPayrollData = [
  //           {
  //             title: "Payroll Cost",
  //             value: payrollSummary?.total_gross_salary,
  //           },
  //           {
  //             title: "Employees' Net Pay",
  //             value: payrollSummary?.total_net_salary,
  //           },
  //           {
  //             title: "Total Employees'",
  //             value: payrollSummary?.total_employees,
  //           },
  //         ];
  //         setPayrollData(updatedPayrollData);
  //         setPayrunDraft({
  //           total_amount: updatedPayrollData.find(
  //             (item) => item.title === "Payroll Cost"
  //           )?.value,
  //           start_date: currentMonthStart,
  //           end_date: currentMonthEnd,
  //           is_payroll_run: false,
  //           excluded_employees: withheldRows,
  //           gross_amount: updatedPayrollData.find(
  //             (item) => item.title === "Payroll Cost"
  //           ).value,
  //           net_amount: updatedPayrollData.find(
  //             (item) => item.title === "Employees' Net Pay"
  //           ).value,
  //           total_employees: updatedPayrollData.find(
  //             (item) => item.title === "Total Employees'"
  //           ).value,
  //         });
  //       }
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, []);

  // Function to handle withholding salary

  // const handleWithholdSalary = () => {
  //   const updatedWithheldEmployees = [...selectedRows, ...withheldRows];
  //   // Find employees in employeedata.results whose IDs are in updatedWithheldEmployees
  //   const withheldEmployeeData = updatedWithheldEmployees
  //     .map((withheldEmployeeId) => {
  //       return employeeData?.find(
  //         (employee) => employee.id === withheldEmployeeId
  //       );
  //     })
  //     .filter((employee) => employee);
  //   // Calculate the total withheld salary
  //   const totalWithheldSalary = withheldEmployeeData.reduce(
  //     (total, employee) => {
  //       return total + parseFloat(employee.basic_salary || 0); // Ensure basic_salary is a number
  //     },
  //     0
  //   );
  //   const updatedPayrollData = payrollData.map((item) => {
  //     if (item.title === "Payroll Cost") {
  //       return {
  //         ...item,
  //         value: (item.value - totalWithheldSalary).toFixed(2),
  //       };
  //     }
  //     if (item.title === "Employees' Net Pay") {
  //       return {
  //         ...item,
  //         value: (item.value - totalWithheldSalary).toFixed(2),
  //       };
  //     }
  //     if (item.title === "Total Employees'") {
  //       return { ...item, value: item.value * 1 - selectedRows.length }; // Add the number of employees withheld
  //     }
  //   });
  //   setPayrollData(updatedPayrollData);
  //   console.log("UPDATED PAYROLL DATA", updatedPayrollData);

  //   setWithheldRows(updatedWithheldEmployees);
  //   setSelectedRows([]);

  //   saveDraft(updatedWithheldEmployees, updatedPayrollData);
  // };

  // Function to handle providing salary back for selected withheld rows
  const handleProvideSalary = () => {
    // Find employees in employeeData.results whose IDs are in selectedRows
    const providedEmployeeData = selectedRows
      .map((providedEmployeeId) => {
        return employeeData.find(
          (employee) => employee.id === providedEmployeeId
        );
      })
      .filter((employee) => employee);

    // Calculate the total salary to be provided back
    const totalProvidedSalary = providedEmployeeData.reduce(
      (total, employee) => {
        return total + parseFloat(employee.basic_salary || 0); // Ensure basic_salary is a number
      },
      0
    );
    // Update payroll data by adding back the provided salary
    const updatedPayrollData = payrollData.map((item) => {
      if (item.title === "Payroll Cost") {
        return {
          ...item,
          value: (item.value * 1 + totalProvidedSalary).toFixed(2),
        }; // Add back to Payroll Cost
      }
      if (item.title === "Employees' Net Pay") {
        return {
          ...item,
          value: (item.value * 1 + totalProvidedSalary).toFixed(2),
        }; // Add back to Net Pay
      }
      if (item.title === "Total Employees'") {
        return { ...item, value: item.value * 1 + selectedRows.length }; // Subtract the number of employees provided salary back
      }
    });
    console.log("UPDATED PAYROLL DATA", updatedPayrollData);
    setPayrollData(updatedPayrollData);

    // Remove selected withheld rows from withheldRows state
    const updatedWithheldEmployees = withheldRows.filter(
      (id) => !selectedRows.includes(id)
    );

    setWithheldRows(updatedWithheldEmployees);
    setSelectedRows([]);
    saveDraft(updatedWithheldEmployees, updatedPayrollData);
  };

  // Determine the selected row types
  const normalSelectedRows = selectedRows.filter(
    (row) => !withheldRows.includes(row)
  );
  const withheldSelectedRows = selectedRows.filter((row) =>
    withheldRows.includes(row)
  );

  const showWithholdButton = normalSelectedRows.length > 0;
  const showProvideButton = withheldSelectedRows.length > 0;

  useEffect(() => {
    if (showWithholdButton && showProvideButton) {
      toast.error(
        "You can't select both Withhold and Provide Salary Back at the same time"
      );
    }
  }, [showWithholdButton, showProvideButton]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    const reponse = await savePayrun({
      ...values,
      is_payroll_run: false,
    });
    if (reponse) {
      setPayrunDraft(values);
      setPayrunConfirmationDialog(false);
      setPayrunSubmitDialog(true);
      setTimeout(() => {
        navigate("/pay-run");
      }, 2000);
    }
  };
  const handleConfirmSubmit = async () => {
    console.log("IN HANDLE CONFIRM SUBMIT", payrunDraft);
    const reponse = await savePayrun({
      ...payrunDraft,
      is_payroll_run: true,
    });
    if (reponse) {
      setPayrunConfirmationDialog(false);
      setPayrunSubmitDialog(true);
      setTimeout(() => {
        navigate("/pay-run");
      }, 2000);
    }
  };

  const saveDraft = async (updatedWithheldEmployees, updatedPayrollData) => {
    console.log("IN SAVE DRAFT", payrollData);
    if (payrunDraft) {
      const response = await savePayrun({
        ...payrunDraft,
        excluded_employees: updatedWithheldEmployees,
        gross_amount: updatedPayrollData.find(
          (item) => item.title === "Payroll Cost"
        ).value,
        net_amount: updatedPayrollData.find(
          (item) => item.title === "Employees' Net Pay"
        ).value,
        total_employees: updatedPayrollData.find(
          (item) => item.title === "Total Employees'"
        ).value,
      });
      console.log("SAVE DRAFT", response);
      if (!response) {
        toast.error("Something went wrong!");
      } else {
        setPayrunDraft(response);
      }
    } else {
      console.log("IN ELSE");
      const payRunDraftData = {
        total_amount: updatedPayrollData.find(
          (item) => item.title === "Payroll Cost"
        )?.value,
        start_date: currentMonthStart,
        end_date: currentMonthEnd,
        is_payroll_run: false,
        excluded_employees: updatedWithheldEmployees,
        gross_amount: updatedPayrollData.find(
          (item) => item.title === "Payroll Cost"
        ).value,
        net_amount: updatedPayrollData.find(
          (item) => item.title === "Employees' Net Pay"
        ).value,
        total_employees: updatedPayrollData.find(
          (item) => item.title === "Total Employees'"
        ).value,
      };
      const response = await savePayrun(payRunDraftData);
      if (!response) {
        toast.error("Something went wrong!");
      } else {
        setPayrunDraft(response);
      }
    }
  };
  const handleCloseConfirmationDialog = () => {
    setPayrunConfirmationDialog(false);
  };

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const handlePayRunDateChange = (value, props) => {
    props.setFieldValue("payrun_date", value);
    const dates = value ? value.split(",") : null;
    if (dates && dates?.length > 0) {
      if (dates[0]) props.setFieldValue("start_date", dates[0]);
      if (dates[1]) props.setFieldValue("end_date", dates[1]);
    }
  };

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <SuccessNotification
            isOpen={payrunSubmitDialog}
            onClose={setPayrunSubmitDialog}
            date={moment(payrunDraft?.month).format("MMMM YYYY")}
          />

          <div className="flex flex-wrap gap-10 justify-between items-center h-11">
            <div className="flex items-center gap-4">
              <button
                className="w-[27px] h-[27px] bg-white rounded-3xl border border-[#e8e8ec] justify-center items-center gap-1 inline-flex"
                onClick={handleBack}
              >
                <ArrowLeft size={14} color="#000" />
              </button>
              <div>
                <span className="text-neutral-1200 text-xl font-semibold  leading-tight">
                  Pay Run
                </span>
              </div>
            </div>
          </div>
          <Card>
            {/* <CardHeader>
              <div className="flex items-center justify-between mt-5">
                {showProvideButton && !showWithholdButton && (
                  <Button
                    className="px-3 py-1.5 bg-[#f9f9fb] rounded-3xl justify-center items-center gap-1 inline-flex"
                    onClick={handleProvideSalary}
                  >
                    <div className="text-center text-neutral-1200 text-sm font-medium">
                      Provide Salary Back
                    </div>
                  </Button>
                )}
              </div>
            </CardHeader> */}
            <CardContent>
              <div className="space-y-4">
                <Formik
                  initialValues={PayRun}
                  ref={formRef}
                  enableReinitialize={true}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                  }}
                  validate={(values) => {
                    const errors = validateGeneratePayRun(values);
                    return errors;
                  }}
                >
                  {(props) => (
                    <form
                      onSubmit={props.handleSubmit}
                      className="mt-6 space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <MonthInput
                            name="month"
                            placeholder="Payroll Month"
                            value={props.values.month}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                              handlePayRunDateChange(null, props);
                            }}
                            error={props.errors.month}
                            required={true}
                            label={"Payroll Month"}
                            touch={props.touched.month}
                            dateFormat="yyyy-mm"
                            showMonthYearPicker={true}
                          />
                        </div>

                        <div className="space-y-2">
                          <DateRangeInput
                            name="payrun_date"
                            placeholder="Pay Run Date"
                            label="Payroll Date"
                            error={props.errors.payrun_date}
                            touch={props.touched.payrun_date}
                            value={props.values.payrun_date}
                            onChange={(_, value) => {
                              handlePayRunDateChange(value, props);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"departments"}
                            value={props.values.departments}
                            options={Departments}
                            label={"Department"}
                            required={true}
                            onChange={(field, value) => {
                              handleFilterChange(field, value);
                              props.setFieldValue(field, value);
                            }}
                            SelectAllOption={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"branches"}
                            options={Branches}
                            value={props.values.branches}
                            label={"Branch"}
                            onChange={(field, value) => {
                              handleFilterChange(field, value);
                              props.setFieldValue(field, value);
                            }}
                            SelectAllOption={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"managers"}
                            options={Managers}
                            value={props.values.managers}
                            label={"Direct Report"}
                            onChange={(field, value) => {
                              handleFilterChange(field, value);
                              props.setFieldValue(field, value);
                            }}
                            SelectAllOption={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"genders"}
                            options={GenderOptions}
                            value={props.values.genders}
                            label={"Gender"}
                            onChange={(field, value) => {
                              handleFilterChange(field, value);
                              props.setFieldValue(field, value);
                            }}
                            SelectAllOption={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"nationalities"}
                            options={countriesList}
                            value={props.values.nationalities}
                            label={"Nationality"}
                            onChange={(field, value) => {
                              handleFilterChange(field, value);
                              props.setFieldValue(field, value);
                            }}
                            SelectAllOption={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <SelectMultiInputComponent
                            name={"salary_on_hold"}
                            options={employeeData}
                            value={props.values.salary_on_hold}
                            label={"Salary On Hold"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            setPayrunConfirmationDialog(true);
                          }}
                        >
                          Generate Payroll
                        </Button>
                      </div>
                      <PayRunSubmitDialog
                        isOpen={payrunConfirmationDialog}
                        onClose={handleCloseConfirmationDialog}
                        onConfirm={() => {
                          props.handleSubmit();
                        }}
                        payrunDraft={payrunDraft}
                      />
                    </form>
                  )}
                </Formik>
              </div>
              {/* <CustomTable
                data={employeeData?.results || []}
                columns={PayrunEmployeePayrollColumns}
                pagination={false}
                dataTotalSize={employeeData?.count || 0}
                selectable={true}
                setSelectedRows={setSelectedRows}
                selectedRows={selectedRows}
                disabledRows={withheldRows}
              /> */}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

const SuccessNotification = ({ isOpen, onClose, date }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-3 items-start text-sm leading-tight text-teal-600 bg-white rounded-xl">
          <CircleCheckBig size={16} color="#0d9488" />
          <div className="flex flex-col min-w-[240px]">
            <div className="font-bold">Success!</div>
            <div className="mt-1">
              Your pay run for <span className="font-semibold">{date}</span> was
              successfully added
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function PayRunSubmitDialog({ isOpen, onClose, onConfirm, payrunDraft }) {
  const date = moment(payrunDraft?.start_date);
  const monthName = date.format("MMMM");
  const year = date.format("YYYY");

  return (
    <AlertDialogue
      isOpen={isOpen}
      setIsOpen={onClose}
      handleContinue={onConfirm}
      continueText="Yes"
      buttonType=""
      title={`Submit Pay Run for ${monthName} ${year}?`}
      description={`Are you sure you want to submit the pay run for ${monthName} ${year}.`}
      cancelText="No"
      className="text-neutral-900"
    />
  );
}
export default CreatePayRun;
