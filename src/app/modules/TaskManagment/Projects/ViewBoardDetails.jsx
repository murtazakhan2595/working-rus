import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";
import dots from "assets/images/dots.svg";
import { getRandomColor } from "utils/renderValues";
import Avatar from "components/ui/Avatar";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import moment from "moment";
import { Members, MembersList } from "../Sections";
import { Badge } from "components/ui/badge";
import CreateEditProject from "./CreateEditProject";
import AlertDialogue from "components/ui/AlertDialogue";
import { deleteProject } from "app/hooks/taskManagment";

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
      width="500px"
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
        />
      )}
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img
            src={project?.profile?.file}
            alt="Testing"
            className="h-[50px] w-[50px] object-cover border-2 border-gray-400 rounded-full"
          />
          <p>{project?.name}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onEdit} >
           
            Edit
          </Button>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-4 border border-gray-500 rounded-md ">
        <div className="p-4">
          <p className="text-sm font-semibold">Project Details </p>
          <div className="flex gap-8 mt-4">
            <p className="text-sm font-normal text-neutral-900">Description</p>
            <p className="text-sm">{project?.description}</p>
          </div>
        </div>

        <div className="bg-gray-500 p-2 flex items-start justify-between rounded-b-md">
          <p className="text-sm text-neutral-1100">
            Created On: {moment(project?.created_at)?.format("MMM D, YYYY")}
          </p>
        </div>
      </div>

      <div className="mt-4 border border-gray-500 rounded-md p-4 flex flex-col gap-4">
        <p className="text-sm font-semibold">Project Members</p>
        <div className="text-sm flex gap-9">
          <div className="space-y-2">
            <span className="text-sm text-neutral-1100">Colors: </span>
          </div>
          <div
            className={`w-6 h-6 rounded-full border border-gray-400 cursor-pointer`}
            style={{ background: project?.color }}
          />
        </div>
        <div className="flex items-center gap-5">
          <p className="text-sm text-neutral-1100">Members: </p>
          <MembersList members={project?.project_members} />
        </div>
        <div className="flex items-center gap-10">
          {" "}
          <p className="text-sm">Status: </p>
          <Badge
            variant="secondary"
            className="relative pl-5 bg-blue-100 text-blue-800 before:bg-blue-800 before:content-[''] before:absolute before:left-2 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full"
          >
            {project?.status || "Ongoing"}
          </Badge>
        </div>
      </div>
      {/* <div className="fixed top-0 right-0 max-w-[35%] w-[35%] h-full z-10 overflow-y-auto hideScroll">
      <div className="bg-white h-full fixed  max-w-[35%] w-[35%] top-0 right-0  shadow px-[50px] py-10 flex flex-col gap-7">
        <div className="flex-col justify-start items-start gap-2.5 flex">
          <div className="inline-flex items-end self-stretch justify-between">
            <div className="flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="text-zinc-800 text-[25px] font-bold ">
                {project.name}
              </div>
              <div className="justify-start items-start gap-2.5 inline-flex">
                <div className="text-sm font-normal text-zinc-600">
                  Created by Hani Hassan | {project.start_date}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 h-9">
              <button
                className="flex items-center justify-center gap-2 px-3 py-2 border rounded border-zinc-600"
                onClick={openEditProjectModal}
              >
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
                <div className="text-base font-medium leading-tight text-zinc-600">
                  Edit
                </div>
              </button>
              <img
                src={dots}
                alt=""
                onClick={() => {}}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col text-base text-zinc-800">
          <div className="font-bold leading-[100%] ">Project Description</div>
          <p
            className="mt-2.5 leading-6 "
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
        <div className="flex flex-col items-center gap-[25px] text-sm text-gray-100 ">
          <h2 className="self-stretch text-xl font-bold text-zinc-600 ">
            Team Members{" "}
            <span className="text-base">
              ({project.project_members.length})
            </span>
          </h2>
          <div className="px-[15px] py-2.5 rounded-[5px]  justify-start items-start gap-4 inline-flex w-[447px]">
            {project.project_members &&
              project.project_members.length > 0 &&
              project.project_members.map((member, index) => (
                <div
                  key={index}
                  className={`w-[35px] h-[35px] p-3 ${getRandomColor()} rounded-[100px] justify-center items-center gap-2.5 inline-flex`}
                >
                  <div className="text-zinc-100 text-sm font-normal ">
                    HP
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div> */}
    </SheetComponent>
  );
};

export default ViewBoardDetails;
