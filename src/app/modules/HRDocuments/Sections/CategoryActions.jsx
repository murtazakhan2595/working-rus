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
import SheetComponent from "components/ui/SheetComponent";
import {CategoryForm} from "app/modules/HRDocuments/Screens";

const CategoryActions = ({ data, reload = () => {} }) => {
  const [OpenDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [EditCategory, setEditCategory] = useState(false);

  const handleEdit = (data) => {
    setEditCategory(true);
  };

  const handleDelete = (data) => {
    setOpenDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRecord(`/branch/${data?.id}`, data?.branch_name);
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
          <DropdownMenuItem onClick={() => handleEdit(data)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(data)}>
            Delete
          </DropdownMenuItem>
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

      {EditCategory && (
        <CategoryForm
          setIsOpen={() => {
            setEditCategory(false);
            reload(true);
          }}
          id={data.id}
          isOpen={EditCategory}
        />
      )}
    </>
  );
};

export default CategoryActions;
