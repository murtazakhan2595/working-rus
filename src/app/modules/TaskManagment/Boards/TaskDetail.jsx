import React, { useState, useEffect, useRef } from "react";
import { CiEdit } from "react-icons/ci";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { IoCalendarOutline } from "react-icons/io5";
import { RxCross2, RxPerson } from "react-icons/rx";
import {
  AiOutlineDownload,
  AiOutlineFile,
  AiOutlinePaperClip,
} from "react-icons/ai";
import { FaRegImage } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { LiaCommentAlt } from "react-icons/lia";
import { PriorityList } from "data/Data";
import { MembersList } from "../Sections";
import moment from "moment";
import {
  postComment,
  getBoardById,
  getAttachmentById,
} from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { connect, useSelector } from "react-redux";
import EditCard from "./EditCard";
import { getRandomColor } from "utils/renderValues";
import { addCommentAttachment } from "app/hooks/taskManagment";
import { getCommentsWithAttachments } from "app/hooks/taskManagment";
import { filebase64Download } from "utils/fileUtils";
import SheetComponent from "components/ui/SheetComponent";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Trash } from "lucide-react";
import { CardTitle } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { getLabelColor } from "./Sections/getTaskStatus";

const TaskDetail = ({ task, onClose, employees }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [boardName, setBoardName] = useState("Loading...");
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState({});
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const [isTaskDetailVisible, setIsTaskDetailVisible] = useState(true);
  const commentRef = useRef(null);
  const userId = useSelector((state) => state.user.userProfile.id);

  const fetchData = async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [task.id] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };
  useEffect(() => {
    const fetchBoardName = async () => {
      try {
        const name = await getBoardById(task?.board_id);
        setBoardName(name?.name);
      } catch (error) {
        console.error("Error fetching board name:", error);
      }
    };

    const fetchAttachments = async () => {
      try {
        if (task?.attachment?.length) {
          const attachmentPromises = task.attachment.map((id) =>
            getAttachmentById(id)
          );
          const attachmentData = await Promise.all(attachmentPromises);
          setAttachments(attachmentData);
        }
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    fetchBoardName();
    fetchData();
    fetchAttachments();
  }, [task?.board_id, task?.id, task?.attachment]);

  const handleAddComment = async () => {
    if (newComment.trim() || newAttachment) {
      try {
        if (newAttachment) {
          console.log("newAttachment", newAttachment);
          try {
            const response = await addCommentAttachment(newAttachment);
            console.log("attachmed response", response);
            if (response) {
              const payload = {
                task_id: task.id,
                user_id: userId,
                comment: newComment,
                commentattach: [response.id],
              };
              const result = await postComment(payload);
              if (result) {
                setNewAttachment([]);
                setNewComment("");
              }
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        } else if (newComment.trim()) {
          const payload = {
            task_id: task.id,
            user_id: userId,
            comment: newComment,
          };
          await postComment(payload);
          setNewComment("");
        }
        console.log("newAttachment", newAttachment);
        fetchData();
      } catch (error) {
        console.error("Error posting comment or uploading attachment:", error);
      }
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  console.log();

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the single file

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = {
          name: file.name, // File name
          file: event.target.result, // Base64 data URL
        };
        setNewAttachment(fileData); // Update state with file data
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error); // Handle errors
      };

      reader.readAsDataURL(file); // Read file as data URL
    }
  };

  const editDetails = () => {
    setIsEditCardOpen(true);
    setIsTaskDetailVisible(false);
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    const mentionStart = value.lastIndexOf("@");
    if (mentionStart !== -1) {
      const mentionQuery = value.substring(mentionStart + 1);
      const matches = employees.filter((user) =>
        user.label.toLowerCase().includes(mentionQuery.toLowerCase())
      );
      setFilteredUsers(matches);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  const handleUserSelect = (user) => {
    const mentionStart = newComment.lastIndexOf("@");
    const comment = newComment.substring(0, mentionStart) + `@${user.label} `;
    setNewComment(comment);
    setShowDropdown(false);

    // Move cursor to the end of the inserted mention
    setTimeout(() => {
      commentRef.current.selectionStart = comment.length;
      commentRef.current.selectionEnd = comment.length;
      commentRef.current.focus();
    }, 0);
  };

  const UserInitials = ({ user }) => {
    const employeeName = EmployeeName({ value: user.value, length: 2 });
    console.log("emp name - ", employeeName);
    const name = employeeName.props.children;
    return (
      <span
        className={`${getRandomColor(
          name?.charAt(0)
        )} font-lato flex justify-center items-center text-[10.5px] font-bold text-[#FAFBFC] w-8 h-8 rounded-full`}
      >
        {name}
      </span>
    );
  };

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  const formSheetData = {
    triggerText: null,
    title: "Edit Card",
    description: null,
    footer: null,
  };

  function CardValues({ values }) {
    console.log("IN CARD VALUES", values);
    const items = [
      {
        label: "Due Date",
        value: moment(values?.end_date).format("DD MMM"),
      },
      {
        label: "Priority",
        value: PriorityList.find((option) => option.value === values?.priority)
          ?.label,
      },
      {
        label: "Label",
        value: values?.label || "Design",
      },
      {
        label:"Assign",
        value: <MembersList members={values?.assigned_to} />
      },
      {
        label:"Relation",
        value: "Relation"
      },
      {
        label:"Checklist",
        value: "CheckList"
      }
    ];
    return (
      <div className="flex flex-col sm:flex-row items-start justify-between flex-wrap w-[60%] gap-4">
        {items.map(({ label, value }, idx) => (
          <div className="flex gap-4 items-center w-full h-5">
            <div className=" text-sm">{label}</div>
            <div className="flex flex-col items-start">
              <div className="text-gray-900 text-sm">{value}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {isEditCardOpen && (
        <SheetComponent
          {...formSheetData}
          isOpen={isEditCardOpen}
          setIsOpen={setIsEditCardOpen}
          width="500px"
          contentClassName="custom-sheet-width"
        >
          <EditCard
            cardId={task?.id}
            projectId={task?.project_id}
            onClose={() => {
              setIsEditCardOpen(false);
              onClose();
            }}
          />
        </SheetComponent>
      )}
      {isTaskDetailVisible && (
        <>
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#323333] font-lato">
              {task?.name}
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={editDetails}>
                <CiEdit className="mr-2" />
                Edit
              </Button>

              <Button variant="outline" onClick={editDetails}>
                <Trash className="mr-2" size={16} />
                Delete
              </Button>
            </div>
          </header>

          <div className="p-2">
            <div className="mb-4">
              <span className="text-[14px] font-lato text-baseGray">
                Is in list{" "}
              </span>
              <span className="text-[14px] font-lato text-baseGray">
                {boardName}
              </span>
            </div>

            <Card className="p-2">
              <CardContent className="p-6">
                <div className="w-full font-semibold">Card Details</div>
                <CardValues values={task} />
              </CardContent>
            </Card>

            <div className="flex items-center p-4 gap-4">
              <p>Description: </p>
              <span
                className="text-sm text-gray-700"
                dangerouslySetInnerHTML={{ __html: task?.description }}
              />
            </div>

            <div className="flex items-center p-4 gap-4">
              <p>SubTasks: </p>
              <p className="text-gray-700">SubTasks 1 </p>
            </div>

            <div className="mb-3 flex">
              <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
                Attachments
              </h2>
              {attachments?.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between w-full p-4  my-1 border border-gray-400 rounded-lg gap-2"
                  onClick={(e) => {
                    if (!e.target.closest(".download-icon")) {
                      const dataURL = attachment?.attachments?.file;
                      console.log(dataURL, "DATA URL");
                      const [metadata, base64Data] = dataURL?.split(",");
                      const mimeType = metadata?.match(/:(.*?);/)[1];
                      const blob = base64ToBlob(base64Data, mimeType);
                      const blobUrl = URL.createObjectURL(blob);

                      window.open(blobUrl, "_blank");
                    }
                  }}
                >
                  <div className="flex items-center">
                    {/* <FaRegImage className="w-4 h-4 text-gray-500" /> */}
                    <img src={attachment?.attachments?.file} alt={attachment?.attachments?.name} className="w-8 h-8"/>
                    <span className="ml-4 text-sm font-lato text-baseGray">
                      {attachment?.attachments?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <a
                      href={attachment?.attachments?.file}
                      download
                      className="text-gray-500 hover:text-gray-700 download-icon"
                    >
                      <AiOutlineDownload className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-lato font-bold text-[#323333] flex gap-x-2 items-center">
                  Comments ({comments.length})
                </h2>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg p-1 bg-[#E8EAED]">
                <div className="relative w-full">
                  {newAttachment?.name && (
                    <div className="flex items-center gap-2 pb-2">
                      <AiOutlineFile className="w-5 h-5 text-black" />
                      <span className="text-sm text-black">
                        {newAttachment.name}
                      </span>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Type your comment here"
                    className="flex-grow px-2 py-1 text-sm bg-transparent text-gray-700 focus:outline-none placeholder:text-[14px] placeholder:font-lato placeholder:text-baseGray w-full"
                    value={newComment}
                    onChange={handleCommentChange}
                    ref={commentRef}
                  />
                  {showDropdown && (
                    <div className="absolute top-0 left-0 z-10 mx-auto mt-8 overflow-y-auto bg-white rounded-lg shadow-lg max-h-32 ">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.value}
                          className="flex items-center gap-2 p-2 mb-1 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleUserSelect(user)}
                        >
                          <UserInitials user={user} />
                          <div className="flex-col gap-1">
                            <p>{user.name}</p>
                            <p className="text-sm">@{user.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <AiOutlinePaperClip
                  onClick={handleFileClick}
                  className="w-5 h-5 mx-2 text-black cursor-pointer"
                />
                <div
                  className="flex items-center justify-center w-6 h-6 mr-1 bg-black rounded-full"
                  onClick={handleAddComment}
                >
                  <RiSendPlaneFill className="w-3 h-3 text-white cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-4">
              {comments?.map((comment, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center font-semibold text-white bg-pink-500 rounded-full h-9 w-9">
                      <EmployeeName value={comment.user_id} length={2} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full ">
                    <div>
                      {comment?.commentattach?.length > 0 &&
                        comment?.attachments?.length > 0 &&
                        comment?.attachments[0]?.attachment && (
                          <button
                            className="flex items-center gap-2 hover:bg-[#E8EAED] p-1"
                            onClick={() => {
                              console.log(
                                comment?.attachments[0]?.attachment?.file
                              );
                              filebase64Download(
                                comment?.attachments[0]?.attachment
                              );
                            }}
                          >
                            <AiOutlineFile className="w-5 h-5 text-black" />
                            <span className="text-sm text-black">
                              {comment?.attachments[0]?.attachment?.name}
                            </span>
                          </button>
                        )}
                      <p className="mt-1 text-[#323333] font-lato text-base">
                        {comment.comment}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-lato text-baseGray">
                        {moment(comment.created_at?.slice(0, 10)).format(
                          "DD-MMM-YY"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
