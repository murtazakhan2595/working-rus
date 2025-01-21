import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
import DatePicker from "react-datepicker";
import { getFileNameFromURL } from "utils/downUtils";
import moment from "moment";
import { Card } from "components/ui/card";
import ReactQuill from "react-quill";
import { Input } from "components/ui/input";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { Calendar as LucideCalendar } from "lucide-react";
import { AiOutlinePaperClip } from "react-icons/ai";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "src/@/components/ui/radio-group";
import AttachmentUI from "components/ui/AttachmentUI";

import {
  ChevronsUpDown,
  Check,
  FileUp,
  CircleX,
  SearchIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/@/components/ui/command";
import { cn } from "src/@/lib/utils";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "src/@/components/ui/calendar";
import { PatternFormat } from "react-number-format";

const CommentsInputField = ({ handleAddComment, users }) => {
    const fileInputRef = useRef(null);
    const commentRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentAttachments, setCommentAttachment] = useState([]);
  
    const handleCommentChange = (e) => {
      const value = e.target.value;
      setNewComment(value);
      const mentionStart = value.lastIndexOf("@");
      if (mentionStart !== -1) {
        const mentionQuery = value.substring(mentionStart + 1);
        const matches = users.filter((user) =>
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
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Get the single file
      if (file) {
        const attachment = {
          attachment: file,
          name: file.name,
        };
        setCommentAttachment([...commentAttachments, ...[attachment]]);
      }
    };
    const removeFile = (file) => {
      const filteredFiles = commentAttachments.filter(
        (f) => f.name !== file.name
      );
      setCommentAttachment(filteredFiles);
    };
  
    const handleSubmitComment = (newComment, commentAttachments) => {
      handleAddComment(newComment, commentAttachments);
      // Reinitialize state variables after successfully adding a comment
      setNewComment("");
      setCommentAttachment([]);
      setFilteredUsers([]);
      setShowDropdown(false);
    };
  
    return (
      <>
        <div className="pb-1">
          <div className="flex items-center">
            <div className="relative w-full">
              <div className="flex w-full flex-col rounded-md border border-neutral-500 bg-white py-3  px-1 h-auto">
                <Input
                  type="textarea"
                  maxLength={"5000"}
                  id={"comment"}
                  name={"comment"}
                  autoComplete="Off"
                  placeholder="Type your comment here"
                  value={newComment}
                  rows={5}
                  className={`h-auto rounded-none border-none focus:outline-none`}
                  onChange={handleCommentChange}
                  style={{ "--tw-ring-color": "transparent" }}
                />
                {commentAttachments.length > 0 && (
                  <div className="">
                    {commentAttachments?.map((file, index) => (
                      <div key={index}>
                        <AttachmentUI
                          attachment={file.attachment}
                          name={file.name}
                          removeFile={removeFile}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-row justify-between mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onClick={(event) => event.stopPropagation()} // Prevent default behavior
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <AiOutlinePaperClip
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    className="w-5 h-5 mx-2 text-black cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSubmitComment(newComment, commentAttachments);
                    }}
                  >
                    {"Comment"}
                  </Button>
                </div>
              </div>
              {showDropdown && (
                <Popover>
                  <PopoverContent className="w-80 p-0" align="start">
                    <Card className="border-0 shadow-none">
                      <div className="p-4 space-y-4">
                        <div className="space-y-3 max-h-[200px] overflow-y-auto scroll-smooth">
                          {filteredUsers?.map((user) => (
                            <div
                              key={user?.value}
                              className="flex items-center space-x-2"
                              onClick={() => {
                                handleUserSelect(user);
                              }}
                            >
                              <span
                                className={`px-3 py-1 rounded-full ${user?.color} inline-block`}
                              >
                                {user?.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  export default CommentsInputField;