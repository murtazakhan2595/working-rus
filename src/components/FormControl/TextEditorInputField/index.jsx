import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Italic,
  Bold,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
} from "lucide-react";
import { Button } from "components/ui/button";
import { AiOutlinePaperClip } from "react-icons/ai";
// import { iconButtonClasses } from "@mui/material";
import AttachmentUI from "components/ui/AttachmentUI";
import "./style.css";

const TextEditorStyle = [
  "BOLD",
  "ITALIC",
  "UNDERLINE",
  "UNORDEREDLIST",
  "ORDEREDLIST",
];
const TextEditorIconClassName = "w-4 h-4";
const TextEditorButtonClassName = (active) => {
  return `hover:bg-white hover:text-primary ${
    active ? "active:text-primary" : ""
  } p-1`;
};

function TextEditorInputField({
  handleSubmitContent,
  content = " ",
  upload,
  setContent = () => {},
  setAttachments = () => {},
  removeAttachment = () => {},
  attachments = [],
}) {
  const fileInputRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (content) {
      const editor = document.getElementById("editor");

      if (editor) {
        // Set the desired content
        editor.innerHTML = content;

        // Create and dispatch an input event to simulate user input
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });

        editor.dispatchEvent(inputEvent);
      }
    }
  }, []);

  const execCommand = useCallback((command, value = null) => {
    editorRef.current.focus(); // Ensure the editor is focused before executing commands
    document.execCommand(command, false, value);
  }, []);

  const handleCommand = (command) => {
    execCommand(command);
  };

  const handleLink = useCallback(() => {
    if (!showLinkInput) {
      setShowLinkInput(true);
      return;
    }
    if (linkUrl) {
      execCommand("createLink", linkUrl);
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [showLinkInput, linkUrl, execCommand]);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (upload) {
        const uploadedImage = await upload(file);
        if (uploadedImage?.attachment) {
          execCommand("insertImage", uploadedImage.attachment);
        } else {
          console.error("Image upload failed");
        }
      } else {
        execCommand("insertImage", URL.createObjectURL(file));
      }

      handleFileChange(e);
    },
    [execCommand]
  );
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the single file
    if (file) {
      const attachment = {
        attachment: file,
        name: file.name,
      };
      setAttachments([...attachments, ...[attachment]]);
    }
  };
  const removeAttachmentFile = (file) => {
    if (removeAttachment) {
      removeAttachment(file);
      return;
    }
    const filteredFiles = attachments.filter((f) => f.name !== file.name);
    setAttachments(filteredFiles);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      execCommand("insertLineBreak");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-lg border border-neutral-500 bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-500 p-2">
          <TextEditorButtons
            command={"bold"}
            icon={
              <Bold strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command={"italic"}
            icon={
              <Italic strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command={"underline"}
            icon={
              <Underline
                strokeWidth={2.5}
                className={TextEditorIconClassName}
              />
            }
            handleCommand={handleCommand}
          />

          <div className="h-4 w-[1px] bg-neutral-500 mx-2"></div>
          <TextEditorButtons
            command={"insertOrderedList"}
            icon={
              <List strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command={"insertUnorderedList"}
            icon={
              <ListOrdered
                strokeWidth={2.5}
                className={TextEditorIconClassName}
              />
            }
            handleCommand={handleCommand}
          />

          <div className="h-4 w-[1px] bg-neutral-500 mx-2"></div>
          {/* <Button
            variant="ghost"
            onClick={handleLink}
            className={TextEditorButtonClassName}
          >
            <Link strokeWidth={2.5} className={TextEditorIconClassName} />
          </Button> */}
          <label className={TextEditorButtonClassName}>
            <Image strokeWidth={2.5} className={TextEditorIconClassName} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <label className={TextEditorButtonClassName}>
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
          </label>
          {showLinkInput && (
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Enter URL"
                className="px-2 py-1 border rounded"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Button
                variant="ghost"
                onClick={handleLink}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </Button>
            </div>
          )}
        </div>
        {attachments.length > 0 && (
          <div className="p-1">
            {attachments?.map((file, index) => (
              <div key={index}>
                <AttachmentUI
                  attachment={file.attachment}
                  name={file.name}
                  removeFile={removeAttachmentFile}
                />
              </div>
            ))}
          </div>
        )}
        <div
          ref={editorRef}
          id="editor"
          className="w-full min-h-[150px] p-4 focus:outline-none rounded-b-lg textEditorText"
          contentEditable
          onInput={(e) => {
            setContent(e.target.innerHTML);
          }}
          onKeyDown={handleKeyDown}
        ></div>
        <div className="flex flex-row justify-between border-t border-neutral-500 p-2 ">
          <div className="flex items-center text-sm text-gray-900 font-inter">
            {content ? content.replace(/<[^>]*>/g, "").length : 0} characters
          </div>
          {handleSubmitContent && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleSubmitContent(content, attachments);
                }}
              >
                {"Comment"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function TextEditorButtons({ command, icon, handleCommand }) {
  const [active, setActive] = useState(false);
  return (
    <Button
      variant="ghost"
      onClick={() => {
        handleCommand(command);
        setActive(true);
      }}
      className={`hover:bg-white hover:text-primary ${
        active ? "active:text-primary" : ""
      } p-1`}
    >
      {icon}
    </Button>
  );
}

export default TextEditorInputField;
