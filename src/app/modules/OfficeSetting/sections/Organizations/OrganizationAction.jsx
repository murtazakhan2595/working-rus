import { Button } from 'components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }  from 'src/@/components/ui/dropdown-menu'
import React, { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'
import ViewOrganization from './ViewOrganization'
import { toast } from 'react-toastify'
import { deleteOrganization } from 'app/hooks/officeSetting'
import AlertDialogue from 'components/ui/AlertDialogue'

const OrganizationAction = ({ data, setEdit, setEditData, reload }) => {
  const [view, setView] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleView = (data) => {
    setView({
      visible: true,
      data: data,
    });
  };

  const handleEdit = (data) => {
    setEdit(true);
    setEditData(data);
  };

  const handleDelete = async () => {
     setIsDeleteModalOpen(true);

  };
    const confirmDelete = async () => {
      const response = await deleteOrganization(data.id);
      if (response) {
        reload();
        toast.success("Organization deleted successfully");
      } else {
        toast.error("Error deleting organization");
      }
      setIsDeleteModalOpen(false);
    };
  return (
    <>
      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={() => {
            setIsDeleteModalOpen(false);
          }}
          handleContinue={confirmDelete}
          title="Confirm Delete?"
          description="This action can't be undone. All information associated with this
            will be lost."
        />
      )}
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
          <DropdownMenuItem onClick={() => handleView(data)}>
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(data)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {view?.visible && (
        <ViewOrganization
          isOpen={view?.visible}
          setIsOpen={setView}
          data={view?.data}
        />
      )}
    </>
  );
};

export default OrganizationAction
