import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteRecord } from "app/hooks/general";
import ActionAlert from "components/ui/ActionAlert";
import { savePayrun } from "app/hooks/payroll";
import { useNavigate } from "react-router-dom";

const PayrollListActionOptions = ({ payrollData, reloadData = () => {} }) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [PayrunSubmitDialog, setPayrunSubmitDialog] = useState(false);
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/payroll/pay-run/details/${payrollData.id}`);
  };

  const handleProceedToRun = async () => {
    const reponse = await savePayrun({ is_payroll_run: true }, payrollData.id);
    if (reponse) {
      setPayrunSubmitDialog(true);
    }
  };

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(
        `/payroll/payroll-run/${payrollData?.id}`,
        `Payroll for month ${payrollData.month}`
      );
      reloadData(true);
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" size="icon" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleView(payrollData)}>
            View
          </DropdownMenuItem>
          {!payrollData.is_payroll_run && (
            <DropdownMenuItem onClick={() => handleDelete(payrollData)}>
              Delete
            </DropdownMenuItem>
          )}
          {!payrollData.is_payroll_run && (
            <DropdownMenuItem onClick={() => handleProceedToRun(payrollData)}>
              Proceed To Run
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <ActionAlert
        isOpen={PayrunSubmitDialog}
        onClose={setPayrunSubmitDialog}
        title={"Payroll proceed to payrun"}
        description={`Payroll for month ${payrollData.month} is proceeded to payrun.`}
      />
      {OpenDeleteAlert && (
        <AlertDialogue
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this will be lost."
          isOpen={OpenDeleteAlert}
          setIsOpen={(isOpen) => setOpenDeleteAlert(false)}
          handleContinue={() => {
            confirmDelete();
            setOpenDeleteAlert(false);
          }}
        />
      )}
    </>
  );
};

export default PayrollListActionOptions;
