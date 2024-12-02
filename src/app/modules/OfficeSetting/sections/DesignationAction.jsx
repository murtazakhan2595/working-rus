import { Button } from 'components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }  from '../../../../src/@/components/ui/dropdown-menu'
import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import AlertDialogue from 'components/ui/AlertDialogue'
import { deleteRecord } from 'app/hooks/general'

const DesignationAction = ({data, setEdit, setEditData}) => {
  const [view, setView] = useState(null)
  const [deleteDesignation, setDeleteDesignation] = useState(null)

  const handleView = (data)=>{
    setView({
      visible: true,
      data: data
    })
  }

  const handleEdit = (data)=>{
    setEdit(true)
    setEditData(data)
  }

  const handleDelete = (data) => {
    setDeleteDesignation({
      open: true,
      data: data,
    });
  };

  const confirmDelete = async ()=>{
    try{
      await deleteRecord(`/designation/${deleteDesignation?.data?.id}`, deleteDesignation?.data?.name)
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
    <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>View</DropdownMenuItem>
      <DropdownMenuItem onClick={()=> handleDelete(data)}>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  {deleteDesignation?.open && (
        <AlertDialogue
        title="Confirm Delete?"
        description="This action can't be undone. All information associated with this will be lost."
          isOpen={deleteDesignation?.open}
          setIsOpen={(isOpen) =>
            setDeleteDesignation((prev) => ({ ...prev, open: isOpen }))
          }
          handleContinue={() => {
            confirmDelete()
            setDeleteDesignation(null); 
          }}
        />
      )}
    
    {/* {
      view?.visible && (
        <ViewOrganization
          isOpen={view?.visible}
          setIsOpen={setView}
          data={view?.data}
        />
      )
    } */}
  </>
  )
}

export default DesignationAction
