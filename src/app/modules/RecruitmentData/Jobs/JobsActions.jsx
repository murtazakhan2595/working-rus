import React, { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../../../src/@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "components/ui/button";
import { deleteJob } from "app/hooks/recruitment";
import AlertDialogue from "components/ui/AlertDialogue";
import SheetComponent from "components/ui/SheetComponent";
import Dialogue from "components/Dialogue";

const JobsActions = ({ row, fetchJobPosts, isEdit= false }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobLink, setJobLink] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  const handleCopyLink = () => {
    const jobLink = `${window.location.origin}/job-description/${row?.id}`;
    navigator.clipboard.writeText(jobLink)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy the link: ', error);
      });
  };

  const handleDelete = (id, jobTitle) => {
    setJobId({
        id, jobTitle
    }); 
    setIsOpen(true); 
  };

  const confirmDelete = async () => {
    if (jobId) {
      const response = await deleteJob(jobId?.id);
      if(response.status === 204){
        fetchJobPosts()
        setIsOpen(false); 
        setJobId(null)
      }

    }
  };

  const handleShare = (job)=>{
    setOpenModal(true)
    setJobLink({
      jobID: job?.id,
      jobTitle: job?.Job_Title,
    });

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
        {isEdit && <DropdownMenuItem onClick={isEdit}>Edit</DropdownMenuItem>}
          <DropdownMenuItem onClick={() => navigate(`/applicants`)}>View Applications</DropdownMenuItem>
          <DropdownMenuItem onClick={()=>handleShare(row)}>Share Link</DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>Copy Link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row?.id, row?.Job_Title)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {
        openModal && (
          <Dialogue
            isOpen={openModal}
            setIsOpen={setOpenModal}
            jobId={jobLink?.jobID}
            jobTitle={jobLink?.jobTitle}
          />
        )
      }

      {isOpen && (
        <AlertDialogue
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleContinue={confirmDelete} // Call the delete function after confirmation
          title="Confirm Delete"
          description={`Are you sure you want to delete this job ${jobId?.jobTitle}`}
          continueText="Yes"
          cancelText="No"
        />
      )}
    </>
  );
};

export default JobsActions;
