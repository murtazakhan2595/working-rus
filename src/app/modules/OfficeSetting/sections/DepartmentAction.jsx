import { Button } from 'components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../../src/@/components/ui/dropdown-menu';
import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import ViewOrganization from './ViewOrganization';
import AlertDialogue from 'components/ui/AlertDialogue';
import { deleteRecord } from 'app/hooks/general';
import { department } from 'data/Data';
import SheetComponent from 'components/ui/SheetComponent';
import AddDepartmentForm from './AddDepartmentForm';

const DepartmentAction = ({ data }) => {
  const [view, setView] = useState(null);
  const [deleteDept, setDeleteDept] = useState(null);
  const [edit, setEdit] = useState(null)
  
  const formSheetData = {
    triggerText: null,
    title: "Update Department",
    description: null,
    footer: null,
  };

  const handleView = (data) => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = (data) => {
    setEdit({
      open: true,
      data: data
    })
  };

  console.log(edit, "EDIT")
  const handleDelete = (data) => {
    setDeleteDept({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async ()=>{
    try{
      await deleteRecord(`/department/${deleteDept?.data?.id}`, deleteDept?.data?.name)
    }
    catch(error){
      console.log("ERROR", error)
    }
  }

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
          <DropdownMenuItem onClick={() => handleEdit(data)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleView(data)}>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(data)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {deleteDept?.open && (
        <AlertDialogue
        title="Confirm Delete?"
        description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteDept.open}
          setIsOpen={(isOpen) =>
            setDeleteDept((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete()
            setDeleteDept(null); 
          }}
        />
      )}

      {
        edit?.open && (
          <SheetComponent
            {...formSheetData}
            isOpen={edit?.open}
            setIsOpen={(isOpen)=> setEdit((prev)=> ({...prev, open: isOpen}))}
          >
            <AddDepartmentForm edit={edit} setEdit={setEdit}/>
          </SheetComponent>
        )
      }

      {/* Uncomment and adjust if the ViewOrganization component is required */}
      {/* {view?.visible && (
        <ViewOrganization
          isOpen={view.visible}
          setIsOpen={(isOpen) =>
            setView((prev) => ({ ...prev, visible: isOpen }))
          }
          data={view.data}
        />
      )} */}
    </>
  );
};

export default DepartmentAction;
