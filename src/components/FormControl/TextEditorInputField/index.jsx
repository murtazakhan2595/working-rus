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
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "src/@/components/ui/command";
import Avatar from "components/ui/Avatar";

const TextEditorIconClassName = "w-4 h-4";

function TextEditorInputField({
  handleSubmitContent,
  content = "",
  upload,
  setContent = () => {},
  setAttachments = () => {},
  removeAttachment = () => {},
  attachments = [],
  name = "editor",
  displayAttachments = false,
  users = [], // Add users prop for mentions
}) {
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [lastCaretPosition, setLastCaretPosition] = useState(null);
  const [mentionedUsers, setMentionedUsers] = useState([]);

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

  const handleInput = useCallback(
    (e) => {
      const text = e.target.innerHTML;
      setContent(text);

      // Handle mentions
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setLastCaretPosition(range.cloneRange());

        // Get the editor's position
        const editorRect = editorRef.current.getBoundingClientRect();

        // Calculate position relative to the editor
        const relativeX = rect.left - editorRect.left;
        const relativeY = rect.bottom - editorRect.top;

        // Get text before cursor
        const currentNode = range.startContainer;
        const textBeforeCursor = currentNode.textContent.substring(
          0,
          range.startOffset
        );
        const words = textBeforeCursor.split(/\s+/);
        const lastWord = words[words.length - 1];

        if (lastWord.startsWith("@")) {
          setMentionFilter(lastWord.slice(1));
          setMentionPosition({
            x: relativeX,
            y: relativeY + 20, // Add some offset to prevent overlap
          });
          setShowMentionPopover(true);
        } else {
          setShowMentionPopover(false);
        }
      }
    },
    [setContent]
  );

  const handleMentionSelect = useCallback(
    (user) => {
      setMentionedUsers((prev) => {
        if (!prev.includes(user.id)) {
          return [...prev, user.id];
        }
        return prev;
      });
      if (lastCaretPosition) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(lastCaretPosition);

        // Replace the @mention text with the selected user
        const mentionSpan = document.createElement("span");
        mentionSpan.className = "mention bg-blue-100 px-1 rounded";
        mentionSpan.contentEditable = false;
        mentionSpan.setAttribute("data-user-id", user.id);
        mentionSpan.textContent = `@${user.name}`;

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        const startOffset = range.startOffset;

        // Find the start of the @mention
        let mentionStart = startOffset;
        while (
          mentionStart > 0 &&
          textNode.textContent[mentionStart - 1] !== "@"
        ) {
          mentionStart--;
        }
        if (mentionStart > 0) mentionStart--; // Include the @ symbol

        // Replace the @mention text with the mention span
        const textBefore = textNode.textContent.substring(0, mentionStart);
        const textAfter = textNode.textContent.substring(startOffset);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(textBefore));
        fragment.appendChild(mentionSpan);
        fragment.appendChild(document.createTextNode(" " + textAfter));

        const parentNode = textNode.parentNode;
        parentNode.replaceChild(fragment, textNode);

        // Move cursor to end
        const newRange = document.createRange();
        newRange.setStartAfter(mentionSpan);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }

      setShowMentionPopover(false);
      editorRef.current.focus();
    },
    [lastCaretPosition]
  );

  const handlePaste = async (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.Clipboard;
    const items = clipboardData.items;
    let TextAdded = "";

    for (let item of items) {
      const itemType = item.type;
      if (itemType)
        if (itemType.startsWith("image/")) {
          const file = item.getAsFile();
          if (file && upload) {
            const uploadedImage = await upload(file);
            if (uploadedImage?.attachment) {
              execCommand("insertImage", uploadedImage.attachment);
              handleFileChange(uploadedImage);
            }
          }
        } else if (
          itemType.startsWith("text/html") ||
          itemType.startsWith("text/plain")
        ) {
          const html = clipboardData.getData("text/html");
          const text = clipboardData.getData("text/plain");
          if (text.startsWith("http")) {
            execCommand(
              "insertHTML",
              `<a href="${text}" target="_blank">${text}</a>`
            );
            return;
          } else {
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
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Backspace") {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;

        // Check if we're at the beginning of a text node right after a mention
        if (
          startContainer.nodeType === Node.TEXT_NODE &&
          range.startOffset === 0
        ) {
          const previousSibling = startContainer.previousSibling;
          if (previousSibling?.classList?.contains("mention")) {
            const userId = previousSibling.getAttribute("data-user-id");
            // Remove user from mentionedUsers array
            setMentionedUsers((prev) =>
              prev.filter((id) => id !== Number(userId))
            );
            e.preventDefault();
            previousSibling.remove();
          }
        }

        // Check if we're right after a mention in an empty text node
        const parentNode = startContainer.parentNode;
        if (parentNode?.previousSibling?.classList?.contains("mention")) {
          const userId =
            parentNode.previousSibling.getAttribute("data-user-id");
          // Remove user from mentionedUsers array
          setMentionedUsers((prev) =>
            prev.filter((id) => id !== Number(userId))
          );
          e.preventDefault();
          parentNode.previousSibling.remove();
        }
      }
    }
  }, []);
  // Filter users based on input
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
      (user.username &&
        user.username.toLowerCase().includes(mentionFilter.toLowerCase()))
  );

  return (
    <div className="w-full max-w-4xl mx-auto relative">
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
          <label className="hover:bg-white hover:text-primary p-1">
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
        </div>

        {attachments.length > 0 && displayAttachments && (
          <div className="p-1">
            {attachments.map((file, index) => (
              <div key={index}>
                <AttachmentUI
                  attachment={file.attachment}
                  name={file.name}
                  removeFile={removeAttachment}
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
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
        />

        {showMentionPopover && (
          <div
            className="absolute z-50"
            style={{ left: mentionPosition.x, top: mentionPosition.y }}
          >
            <div className="w-64 bg-white rounded-lg shadow-lg border border-gray-200">
              <Command>
                <CommandInput
                  placeholder="Search users..."
                  value={mentionFilter}
                  onValueChange={setMentionFilter}
                />
                <CommandList className="max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleMentionSelect(user)}
                      className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                    >
                      <Avatar
                        className="h-8 w-8"
                        src={user.profile_picture || ""}
                        fallbackText={user.name?.charAt(0)?.toUpperCase() || ""}
                        text={user.name || "Unknown User"}
                        alt={`Avatar of ${
                          user.first_name || user.name || "User"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          @{user.username}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-between border-t border-neutral-500 p-2">
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
                  handleSubmitContent(content, attachments, mentionedUsers);
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
