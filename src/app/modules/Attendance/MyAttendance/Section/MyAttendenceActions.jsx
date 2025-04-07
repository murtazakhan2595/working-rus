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
import { UpdateEmployeeAttendance } from "app/modules/Attendance/Sections";

const MyAttendenceActions = ({ data, reload = () => {} }) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [OpenEditAttendance, setOpenEditAttendance] = useState(false);

  const handleDelete = (event) => {
    event.preventDefault();
    setOpenDeleteAlert(true);
  };
  const handleEdit = (event) => {
    event.preventDefault();
    setOpenEditAttendance(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/attendance/${data?.id}`, "Attendance");
      reload(true);
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
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
      {OpenEditAttendance && (
        <UpdateEmployeeAttendance
          id={data.id}
          isOpen={OpenEditAttendance}
          setIsOpen={() => {
            setOpenEditAttendance(false);
            reload(true);
          }}
          // isEmployee={true}
        />
      )}
    </>
  );
};

export default MyAttendenceActions;
