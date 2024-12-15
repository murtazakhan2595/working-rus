import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { PriorityList } from "data/Data";
import moment from "moment";
import {
  postComment,
  getBoardById,
} from "app/hooks/taskManagment";
import { connect, useSelector } from "react-redux";
import EditCard from "./EditCard";
import { addCommentAttachment } from "app/hooks/taskManagment";
import {
  getCommentsWithAttachments,
  getTaskById,
} from "app/hooks/taskManagment";
import { toast } from "react-toastify";
import {
  Labels,
  MembersList,
  TaskComments,
  CheckList,
  Attachments,
  TaskRelation,
} from "app/modules/TaskManagment/Sections";
import { Button } from "components/ui/button";
import { Trash } from "lucide-react";

import { DetailBox, DetailCard } from "components/SheetCardExtension";

const TaskDetail = ({ taskId, onClose, handleDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [boardName, setBoardName] = useState("Loading...");
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(true);

  const fetchTaskData = async (isMounted) => {
    setIsLoading(true);
    try {
      // Fetch card details
      const cardDetails = await getTaskById(taskId);

      if (!cardDetails) {
        throw new Error("Card details not found.");
      }
      if (isMounted) {
        setTaskData(cardDetails);
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      toast.error("Failed to load task details. Please try again later.");
    } finally {
      if (isMounted) {
        setIsLoading(false); // Stop loading spinner
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (taskId) fetchTaskData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [taskId]);

  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const name = await getBoardById(taskData?.board_id);
        setBoardName(name?.name);
      } catch (error) {
        console.error("Error fetching board name:", error);
      }
    };

    fetchBoardName();
  }, [taskData?.board_id]);

  const editDetails = () => {
    setIsEditCardOpen(true);
    setIsTaskDetailVisible(false);
  };

  function CardValues({ values }) {
    const items = [
      ...(values?.end_date
        ? [
            {
              label: "Due Date",
              value: moment(values?.end_date).format("DD MMM"),
            },
          ]
        : []),
      ...(values?.priority
        ? [
            {
              label: "Priority",
              value: PriorityList.find(
                (option) => option.value === values?.priority
              )?.label,
            },
          ]
        : []),
      ...(values?.label?.length
        ? [
            {
              label: "Label",
              value: (
                <Labels
                  labelsSelected={values.label || []}
                  onSelectedLabelsChange={() => {}}
                  editMode={false}
                />
              ),
            },
          ]
        : []),
      ...(values?.assigned_to?.length
        ? [
            {
              label: "Assign",
              value: <MembersList members={values?.assigned_to} />,
            },
          ]
        : []),
      ...(values?.relation?.length
        ? [
            {
              label: "Relation",
              value: (
                <TaskRelation
                  relationsList={values.relation || []}
                  onChange={() => {}}
                  projectId={taskData.project_id}
                  editMode={false}
                />
              ),
            },
          ]
        : []),
      ...(values?.task_checklist?.length
        ? [
            {
              label: "Checklist",
              value: (
                <CheckList
                  items={values.task_checklist || []}
                  onChange={() => {}}
                  editMode={false}
                />
              ),
            },
          ]
        : []),
    ];

    return (
      <div className="flex flex-col items-start justify-between flex-wrap w-[100%] gap-4">
        {items.map(({ label, value }, idx) => (
          <DetailBox label={label} value={value} className="mt-2" />
        ))}
      </div>
    );
  }
  return (
    <>
      {isEditCardOpen && (
        <EditCard
          cardId={taskData?.id}
          projectId={taskData?.project_id}
          onClose={() => {
            setIsEditCardOpen(false);
            setIsTaskDetailVisible(true);
            let isMounted = true;
            if (taskId) fetchTaskData(isMounted);
            return () => {
              isMounted = false;
            };
          }}
          setIsOpen={setIsEditCardOpen}
        />
      )}
      {isTaskDetailVisible && (
        <>
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#323333] ">
              {taskData?.name}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={editDetails}>
                <CiEdit className="mr-2" />
                Edit
              </Button>

              <Button variant="outline" onClick={handleDelete}>
                <Trash className="mr-2" size={16} />
                Delete
              </Button>
            </div>
          </header>

          <div className="p-2">
            <div className="mb-4">
              <span className="text-[14px]  text-baseGray">Is in list </span>
              <span className="text-[14px]  text-baseGray">{boardName}</span>
            </div>

            <DetailCard detailCardTitle="Card Details">
              <CardValues values={taskData} />
            </DetailCard>

            <DetailBox
              label="Description"
              value={
                <span
                  dangerouslySetInnerHTML={{ __html: taskData?.description }}
                />
              }
            />
            <DetailBox label="Sub Tasks" value="Sub Task 1" />
            <DetailBox
              label="Attachments"
              value={
                <Attachments
                  attachmentSelected={taskData.attachment || []}
                  onChange={() => {}}
                  editMode={false}
                />
              }
            />
            <DetailBox label="Comments" value={<></>} />
            <TaskComments taskId={taskId} />
          </div>
        </>
      )}
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(TaskDetail);
