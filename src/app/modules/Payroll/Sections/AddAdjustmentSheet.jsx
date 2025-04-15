import { useState, useEffect } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { Button } from "../../../../components/ui/button";
import { Formik } from "formik";
import { RadioGroupInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { Switch } from "../../../../src/@/components/ui/switch";
import { Label } from "../../../../src/@/components/ui/label";

import { saveEmployeeEarnDeduction, getEmployeePayroll } from "app/hooks/payroll";
import { getEmployeeCustomList } from "app/hooks/general";
import { toast } from "react-toastify";

import { deleteEarnAndDeduction } from "app/hooks/payroll";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { DetailCard } from "components/SheetCardExtension";
import { DetailBox } from "components/SheetCardExtension";
import { EmployeeOverview } from "components";
import { connect } from "react-redux";

const initialAdjustment = {
  employee_id: "",
  employee_name: "",
  income_type: "earning",
  amounts_types: "fixed",
  amounts: "",
  reason: "",
  description: "",
  month: "",
  employee_payroll: null,
  is_manager_approval: false,
  manager_approval: {
    status: "not_required",
    date: null,
  },
};

const AddAdjustmentSheet = ({
  adjustment,
  employees,
  openSheet,
  reload,
  isOpen,
  setIsOpen,
  onClose,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [adjustmentData, setAdjustmentData] = useState(
    adjustment || initialAdjustment
  );

  const formSheetData = {
    triggerText: adjustment ? "" : "Add Adjustment",
    title: adjustment ? "Adjustment Details" : "Add Adjustment",
    description: null,
    footer: null,
  };

  const handleSubmit = async (values) => {
    // Set manager approval status based on toggle
    if (!values.is_manager_approval) {
      values.manager_approval = {
        status: "not_required",
        date: null,
      };
    } else {
      values.manager_approval = {
        status: "pending",
        date: null,
      };
    }

    const response = await saveEmployeeEarnDeduction(values);
    if (response) {
      if (values.id) {
        toast.success("Adjustment updated successfully");
      } else {
        toast.success("Adjustment added successfully");
      }
      setIsOpen(false);
      setIsEdit(false);
      reload();
    }
  };

  const handleAdjustmentDelete = async () => {
    const response = await deleteEarnAndDeduction(adjustment.id);
    if (response) {
      toast.success("Adjustment deleted successfully");
      setIsOpen(false);
      reload();
    }
  };

  const handleOpenState = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsEdit(false);
    } else {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <>
      <div>
        {handleCloseWithConfirmation({
          isOpen: closeSheet,
          setCloseSheet,
          setIsOpen,
        })}
        <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={handleOpenState}
          width="568px"
        >
          {adjustment && !isEdit ? (
            <ViewAdjustment
              adjustment={adjustment}
              handleAdjustmentDelete={handleAdjustmentDelete}
              setIsEdit={setIsEdit}
              isDelete={isDelete}
              setIsDelete={setIsDelete}
            />
          ) : (
            <AdjustmentForm
              adjustmentData={adjustmentData}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              setIsEdit={setIsEdit}
              onClose={handleClose}
              employees={employees}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
    userProfile: state.user.userProfile,
    designations: state.common.designations,
    departments: state.common.departments,
    managers: state.emp.reportingManagers,
  };
};
export default connect(mapStateToProps)(AddAdjustmentSheet);

const AdjustmentForm = ({
  adjustmentData,
  handleSubmit,
  setIsOpen,
  setIsEdit,
  onClose,
  employees,
}) => {
  // State for employee search
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeesList, setEmployeesList] = useState(
    employees.map((emp) => ({
      value: emp.id,
      label: `${emp.name} (${emp.serial_number || "No ID"})`,
    }))
  );
  const [isSearching, setIsSearching] = useState(false);

const searchEmployees = (query) => {
  if (!query) {
    setEmployeesList([]);
    return;
  }

  setIsSearching(true);
  try {
    // Use employees from props instead of making API call
    const filteredEmployees = employees.filter((emp) => {
      // Convert query and employee data to lowercase for case-insensitive comparison
      const searchQuery = query.toLowerCase();
      const nameMatch = emp.name?.toLowerCase().includes(searchQuery);
      const serialMatch = emp.serial_number
        ?.toLowerCase()
        .includes(searchQuery);

      // Return true if either name or serial_number contains the search query
      return nameMatch || serialMatch;
    });

    setEmployeesList(
      filteredEmployees.map((emp) => ({
        value: emp.id,
        label: `${emp.name} (${emp.serial_number || "No ID"})`,
      }))
    );
  } catch (error) {
    console.error("Error searching employees:", error);
  } finally {
    setIsSearching(false);
  }
};

  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (employeeSearch) {
        searchEmployees(employeeSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [employeeSearch]);

  return (
    <Formik
      initialValues={adjustmentData}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          {/* Employee Selection */}
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Employee Information</div>
              </div>
              <div className="pt-4">
                <div>Select Employee</div>
              </div>
              <SelectInputComponent
                name="employee_id"
                error={props.errors?.employee_id}
                touch={props.touched?.employee_id}
                value={props.values?.employee_id}
                options={employeesList}
                onInputChange={(value) => setEmployeeSearch(value)}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                  // Auto-populate employee name and payroll ID when employee is selected
                  const selectedEmployee = employeesList.find(
                    (emp) => emp.value === value
                  );
                  if (selectedEmployee) {
                    // Extract name from the label (format: "Name (ID)")
                    const nameMatch = selectedEmployee.label.match(/(.*) \(/);
                    const name = nameMatch ? nameMatch[1] : "";
                    props.setFieldValue("employee_name", name);

                    // Fetch employee payroll details
                    getEmployeePayroll({ filterData: { employee_id: value } })
                      .then((response) => {
                        if (response?.results && response.results.length > 0) {
                          props.setFieldValue(
                            "employee_payroll",
                            response.results[0].id
                          );
                        }
                      })
                      .catch((error) =>
                        console.error("Error fetching payroll:", error)
                      );
                  }
                }}
                placeholder="Search by ID or Name"
                required={true}
                isLoading={isSearching}
              />

              {props.values.employee_id && (
                <div className="pt-4">
                  <EmployeeOverview
                    id={props.values.employee_id}
                    showEmail={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Adjustment Type */}
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Adjustment Details</div>
              </div>
              <div className="pt-4">
                <div>Adjustment Type</div>
              </div>
              <RadioGroupInput
                name={"income_type"}
                error={props.errors?.income_type}
                touch={props.touched?.income_type}
                value={props.values?.income_type}
                options={[
                  { value: "earning", label: "Addition" },
                  { value: "deduction", label: "Deduction" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <div className="pt-4">
                <div>Amount Type</div>
              </div>
              <RadioGroupInput
                name={"amounts_types"}
                error={props.errors?.amounts_types}
                touch={props.touched?.amounts_types}
                value={props.values?.amounts_types}
                options={[
                  { value: "fixed", label: "Fixed" },
                  { value: "percentage", label: "Variable (% of Gross)" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <div className="pt-4">
                <div>Amount</div>
              </div>
              <TextInput
                name={"amounts"}
                error={props.errors?.amounts}
                touch={props.touched?.amounts}
                value={props.values?.amounts}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
                placeholder={
                  props.values.amounts_types === "fixed"
                    ? "Enter amount"
                    : "Enter percentage"
                }
              />
              <div className="pt-4">
                <div>Payable Month</div>
              </div>
              <DateInput
                name={"month"}
                error={props.errors?.month}
                touch={props.touched?.month}
                value={props.values?.month}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
                dateFormat="MM/yyyy"
                showMonthYearPicker
                placeholder="Select Month-Year"
              />
            </div>
          </div>

          {/* Reason and Description */}
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Additional Information</div>
              </div>
              <div className="pt-4">
                <div>Reason</div>
              </div>
              <TextInput
                name={"reason"}
                error={props.errors?.reason}
                touch={props.touched?.reason}
                value={props.values?.reason}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
                placeholder="E.g., Bonus, Loan Repayment, etc."
              />
              <div className="pt-4">
                <div>Description</div>
              </div>
              <TextAreaInput
                name={"description"}
                error={props.errors?.description}
                touch={props.touched?.description}
                value={props.values?.description}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
                placeholder="Provide additional details"
                maxRows={3}
              />
            </div>
          </div>

          {/* Approval Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_manager_approval"
              checked={props.values.is_manager_approval}
              onCheckedChange={(value) =>
                props.setFieldValue("is_manager_approval", value)
              }
            />
            <Label htmlFor="is_manager_approval">Approval Required</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button variant="outline" size="lg" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="lg" variant="default">
              {adjustmentData.id ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

const ViewAdjustment = ({
  adjustment,
  handleAdjustmentDelete,
  setIsEdit,
  isDelete,
  setIsDelete,
}) => {
  // Format the amount display based on type
  const formattedAmount =
    adjustment.amounts_types === "fixed"
      ? `AED ${parseFloat(adjustment.amounts).toFixed(2)}`
      : `${adjustment.amounts}% of Gross Salary`;

  // Format the month display
  const formattedMonth = adjustment.month
    ? new Date(adjustment.month).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not specified";

  // Format approval status
  const approvalStatus = adjustment.is_manager_approval
    ? adjustment.manager_approval?.status || "pending"
    : "not required";

  const details = [
    {
      label: "Amount Type",
      value: adjustment.amounts_types === "fixed" ? "Fixed" : "Variable",
    },
    { label: "Amount", value: formattedAmount },
    { label: "Payable Month", value: formattedMonth },
    { label: "Reason", value: adjustment.reason || "Not specified" },
    { label: "Approval Status", value: approvalStatus },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-[217px] h-9 py-1.5 justify-start items-start gap-3 inline-flex">
          <div className="text-black text-sm font-semibold">
            {adjustment.reason || "Adjustment"}
          </div>
          <div className="px-3 py-[3px] rounded-[999px] border border-[#f0f0f3] justify-center items-center gap-1.5 flex">
            <div
              className={`w-1.5 h-1.5 ${
                adjustment.income_type === "earning"
                  ? "bg-[#29a385]"
                  : "bg-[#ef4444]"
              } rounded-full`}
            ></div>
            <div className="text-neutral-1200 text-xs font-semibold capitalize leading-3">
              {adjustment.income_type === "earning" ? "Addition" : "Deduction"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsDelete(true);
            }}
          >
            Delete
          </Button>
          {isDelete && (
            <AlertDialogue
              isOpen={isDelete}
              setIsOpen={setIsDelete}
              handleContinue={handleAdjustmentDelete}
              continueText="Delete"
              title="Are you sure you want to delete this adjustment?"
              description="This action cannot be undone. Once deleted, the adjustment data
                  will be permanently removed."
            />
          )}
        </div>
      </div>

      {/* Employee Information */}
      <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
        <section className="flex flex-col justify-center p-6 text-sm bg-white">
          <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            Employee Information
          </div>
          <div className="flex w-full mt-3">
            <EmployeeOverview id={adjustment.employee_id} showEmail={true} />
          </div>
        </section>
      </div>

      {/* Adjustment Details */}
      <DetailCard
        detailCardTitle="Adjustment Details"
        date={adjustment?.created_at}
        dateTitle="Created On"
      >
        {details.map((detail, index) => (
          <DetailBox key={index} label={detail?.label} value={detail?.value} />
        ))}
      </DetailCard>

      {/* Description if available */}
      {adjustment.description && (
        <div className="font-[inter] mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 text-sm font-medium leading-[1.2] tracking-[0px] ">
          <section className="flex flex-col justify-center p-6 text-sm bg-white">
            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              Description
            </div>
            <div className="mt-3 text-neutral-900">
              {adjustment.description}
            </div>
          </section>
        </div>
      )}
    </>
  );
};
