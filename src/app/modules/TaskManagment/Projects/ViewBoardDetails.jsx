import React, { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { MembersList } from "../Sections";
import { Badge } from "components/ui/badge";
import CreateEditProject from "./CreateEditProject";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteProject } from "app/hooks/taskManagment";
import { DetailBox, DetailCard } from "components/SheetCardExtension";

const ViewBoardDetails = ({
  isOpen,
  setIsOpen,
  onClose,
  project,
  fetchData,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const formSheetData = {
    triggerText: "View Details",
    title: "View Details",
    description: null,
    footer: null,
  };

  const onEdit = () => {
    setIsEditMode(true);
  };
  const confirmDelete = async () => {
    const response = await deleteProject(project.id);
    fetchData(true);
    setIsDeleteModalOpen(false);
    setIsOpen(false);
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="568px"
    >
      {isEditMode && project && (
        <CreateEditProject
          project={project}
          isEditMode={true}
          isOpen={isEditMode}
          setIsOpen={setIsEditMode}
          reload={fetchData}
        />
      )}
      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          handleContinue={confirmDelete}
          continueText="Delete"
          title="Are you Sure?"
          description="Are you sure you want to delete this Project? This action is irreversible and will delete all tasks within."
        />
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {project?.profile ? (
            <img
              src={project?.profile}
              alt={project?.name}
              className="h-[50px] w-[50px] object-cover border-2 border-gray-400 rounded-full"
            />
          ) : (
            <div className="h-[50px] w-[50px] object-cover border-2 border-gray-400 rounded-full" style={{ background: project?.color }}></div>
          )}
          <p>{project?.name}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <DetailCard
        detailCardTitle="Project Details"
        date={project?.created_at}
        dateTitle="Created On"
      >
        <DetailBox label="Description" value={project?.description} />
      </DetailCard>

      <DetailCard detailCardTitle="Project Members">
        <DetailBox
          label="Colors"
          value={
            <div
              className={`w-6 h-6 rounded-full border border-gray-400 cursor-pointer`}
              style={{ background: project?.color }}
            />
          }
        />
        <DetailBox
          label="Members"
          value={
            <MembersList members={project?.project_members} displayAll={true} />
          }
        />
        <DetailBox
          label="Status"
          value={
            <Badge
              variant="secondary"
              className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full"
            >
              {project?.status || "Ongoing"}
            </Badge>
          }
        />
      </DetailCard>
    </SheetComponent>
  );
};

export default ViewBoardDetails;
