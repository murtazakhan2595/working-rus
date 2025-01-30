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

const TextEditorIconClassName = "w-4 h-4";
const TextEditorButtonClassName = (active) =>
  `hover:bg-white hover:text-primary ${active ? "text-primary" : ""} p-1`;

function TextEditorInputField({
  handleSubmitContent,
  content = " ",
  upload,
  setContent = () => {},
  setAttachments = () => {},
  removeAttachment = () => {},
  attachments = [],
  name = "editor",
  displayAttachments = false,
}) {
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]); // State to store tagged users

  useEffect(() => {
    if (content) {
      const editor = editorRef.current;
      if (editor) {
        editor.innerHTML = content;
        const inputEvent = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        editor.dispatchEvent(inputEvent);
      }
    }
  }, []);

  const execCommand = useCallback((command, value = null) => {
    editorRef.current.focus();
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
      e.preventDefault();
      const file = e.target.files[0];
      if (upload) {
        const uploadedImage = await upload(file);
        if (uploadedImage?.attachment) {
          execCommand("insertImage", uploadedImage.attachment);
          handleFileChange(uploadedImage);
        } else {
          console.error("Image upload failed");
        }
      } else {
        execCommand("insertImage", URL.createObjectURL(file));
        handleFileChange({ attachment: file, name: file.name });
      }
    },
    [execCommand, upload]
  );

  const handleFileChange = (fileEvent) => {
    const file = fileEvent?.target?.files[0];
    if (file && file instanceof File) {
      const attachment = { attachment: file, name: file.name };
      setAttachments([...attachments, attachment]);
    } else {
      setAttachments([...attachments, fileEvent]);
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

  const handlePaste = async (e) => {
    debugger;
    e.preventDefault();
    const clipboardData = e.clipboardData || window.Clipboard;
    const items = clipboardData.items;
    let TextAdded = "";

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file && upload) {
          const uploadedImage = await upload(file);
          if (uploadedImage?.attachment) {
            execCommand("insertImage", uploadedImage.attachment);
            handleFileChange(uploadedImage);
          }
        }
      } else if (
        item.type.startsWith("text/html") ||
        item.type.startsWith("text/plain")
      ) {
        const html = clipboardData.getData("text/html");
        const text = clipboardData.getData("text/plain");
        if (html) {
          if (html !== TextAdded) {
            execCommand("insertHTML", html);
            TextAdded = html;
          }
        } else if (text) {
          if (text !== TextAdded) {
            execCommand("insertText", text);
            TextAdded = text;
          }
        }
      }
    }
    // const text = clipboardData.getData("text/plain");
    // if (text && text.startsWith("http")) {
    //   execCommand("createLink", text);
    //   return;
    // }

    // if (!handled) {
    //   const html = clipboardData.getData("text/html");
    //   const text = clipboardData.getData("text/plain");

    //   if (html) {
    //     execCommand("insertHTML", html);
    //   } else if (text) {
    //     execCommand("insertText", text);
    //   }
    // }
  };

  const handleTagUser = (user) => {
    setTaggedUsers([...taggedUsers, user]);
    const tagText = `@${user.username}`;
    execCommand("insertText", tagText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-lg border border-neutral-500 bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-500 p-2">
          <TextEditorButtons
            command="bold"
            icon={
              <Bold strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command="italic"
            icon={
              <Italic strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command="underline"
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
            command="insertOrderedList"
            icon={
              <List strokeWidth={2.5} className={TextEditorIconClassName} />
            }
            handleCommand={handleCommand}
          />
          <TextEditorButtons
            command="insertUnorderedList"
            icon={
              <ListOrdered
                strokeWidth={2.5}
                className={TextEditorIconClassName}
              />
            }
            handleCommand={handleCommand}
          />
          <div className="h-4 w-[1px] bg-neutral-500 mx-2"></div>
          <label className={TextEditorButtonClassName}>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onClick={(event) => event.stopPropagation()}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Image
              strokeWidth={2.5}
              className={TextEditorIconClassName}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current.click();
              }}
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
        {attachments.length > 0 && displayAttachments && (
          <div className="p-1">
            {attachments.map((file, index) => (
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
          id={name}
          className="w-full min-h-[150px] p-4 focus:outline-none rounded-b-lg max-h-[350px] overflow-y-scroll textEditorText"
          contentEditable
          onInput={(e) => setContent(e.target.innerHTML)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        ></div>
        <div className="flex flex-row justify-between border-t border-neutral-500 p-2 ">
          <div className="flex items-center text-sm text-gray-900 font-inter">
            {content?.replace(/<[^>]*>/g, "").length} characters
          </div>
          {handleSubmitContent && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitContent(content, attachments);
                }}
              >
                Comment
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
      onClick={(e) => {
        e.preventDefault();
        handleCommand(command);
        setActive(!active);
      }}
      className={`hover:bg-white hover:text-primary ${
        active ? "text-primary" : ""
      } p-1`}
    >
      {icon}
    </Button>
  );
}

export default TextEditorInputField;
