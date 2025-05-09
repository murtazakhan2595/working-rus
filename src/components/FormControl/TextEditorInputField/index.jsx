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
import { ScrollArea } from "src/@/components/ui/scroll-area";

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
  users = [], // Users for mentions
  allowMentions = false, // New prop to control mention functionality
  editMode = false,
  replyToUser = null,
  commentHeight = "h-[300px]",
}) {
  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Mention-related state - only used if allowMentions is true
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [lastCaretPosition, setLastCaretPosition] = useState(null);
  const [mentionedUsers, setMentionedUsers] = useState([]);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.innerHTML = content;

      // Move focus to editor
      editor.focus();

      // Create a range and selection
      const selection = window.getSelection();
      const range = document.createRange();

      // Move range to the end of content
      range.selectNodeContents(editor);
      range.collapse(false); // Collapse to end

      // Clear any existing selection and apply the new range
      selection.removeAllRanges();
      selection.addRange(range);

      // Save caret position
      setLastCaretPosition(range);
    }
  }, [editMode]);

  // Effect to handle reply initialization
  useEffect(() => {
    if (replyToUser && editorRef.current) {
      const mentionSpan = document.createElement("span");
      mentionSpan.className = "mention bg-blue-100 px-1 rounded";
      mentionSpan.contentEditable = false;
      mentionSpan.setAttribute("data-user-id", replyToUser.id.toString());
      mentionSpan.textContent = `@${replyToUser.name}`;

      // Clear existing content and add mention
      editorRef.current.innerHTML = "";
      editorRef.current.appendChild(mentionSpan);
      editorRef.current.appendChild(document.createTextNode(" "));

      // Update mentioned users
      setMentionedUsers((prev) =>
        prev.includes(replyToUser.id) ? prev : [...prev, replyToUser.id]
      );

      // Focus editor and move cursor to end
      editorRef.current.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);

      // Trigger input event
      const inputEvent = new Event("input", { bubbles: true });
      editorRef.current.dispatchEvent(inputEvent);
    }
  }, [replyToUser]);

  const execCommand = useCallback((command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
  }, []);

  const handleCommand = (command) => {
    execCommand(command);
  };

  const saveCaretPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setLastCaretPosition(selection.getRangeAt(0).cloneRange());
    }
  };

  const restoreCaretPosition = (editor) => {
    const selection = window.getSelection();
    const range = document.createRange();

    // If lastCaretPosition is valid and inside the editor, restore it
    if (
      lastCaretPosition &&
      editor.contains(lastCaretPosition.commonAncestorContainer)
    ) {
      selection.removeAllRanges();
      selection.addRange(lastCaretPosition);
      return lastCaretPosition;
    }

    // Otherwise, move the caret to the end of the editor
    range.selectNodeContents(editor);
    range.collapse(false); // Move to the end
    selection.removeAllRanges();
    selection.addRange(range);

    return range;
  };

  const insertImageAtCaret = (imageUrl) => {
    const editor = editorRef.current;
    if (!editor) return;

    const caretPosition = restoreCaretPosition(editor);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Inserted Image";
    img.style.maxWidth = "100%"; // Prevent oversized images

    caretPosition.insertNode(img); // Insert image at the restored position
    caretPosition.collapse(false); // Move cursor after image
    // Update content state
    setContent(editorRef.current.innerHTML);
    // Save updated caret position
    setLastCaretPosition(caretPosition);
  };

  const handleImageUpload = useCallback(
    async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const file = e.target.files[0];
      if (upload) {
        const uploadedImage = await upload(file);
        if (uploadedImage?.attachment) {
          insertImageAtCaret(uploadedImage.attachment);
          handleFileChange(uploadedImage);
        } else {
          console.error("Image upload failed");
        }
      } else {
        const localUrl = URL.createObjectURL(file);
        insertImageAtCaret(localUrl);
        handleFileChange({ attachment: file, name: file.name });
      }
    },
    [upload]
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

  const handleMentionSelect = useCallback(
    (user) => {
      if (!allowMentions) return;

      const userId =
        typeof user.id === "string" ? parseInt(user.id, 10) : user.id;

      setMentionedUsers((prev) => {
        if (!prev.includes(userId)) {
          return [...prev, userId];
        }
        return prev;
      });

      if (lastCaretPosition) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(lastCaretPosition);

        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        let text = textNode.textContent;
        let cursorPosition = range.startOffset;
        let mentionStart = cursorPosition;

        while (mentionStart > 0 && text[mentionStart - 1] !== "@") {
          mentionStart--;
        }
        mentionStart = Math.max(0, mentionStart - 1);

        const mentionSpan = document.createElement("span");
        mentionSpan.className = "mention bg-blue-100 px-1 rounded";
        mentionSpan.contentEditable = false;
        mentionSpan.setAttribute("data-user-id", userId.toString());
        mentionSpan.textContent = `@${user.name}`;

        const beforeText = text.substring(0, mentionStart);
        const afterText = text.substring(cursorPosition);

        const fragment = document.createDocumentFragment();
        if (beforeText) {
          fragment.appendChild(document.createTextNode(beforeText));
        }
        fragment.appendChild(mentionSpan);
        fragment.appendChild(document.createTextNode(" "));
        if (afterText) {
          fragment.appendChild(document.createTextNode(afterText));
        }

        const parentNode = textNode.parentNode;
        parentNode.replaceChild(fragment, textNode);

        const newRange = document.createRange();
        newRange.setStartAfter(mentionSpan);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        const inputEvent = new Event("input", { bubbles: true });
        editorRef.current.dispatchEvent(inputEvent);
      }

      setShowMentionPopover(false);
      editorRef.current.focus();
    },
    [lastCaretPosition, allowMentions]
  );

  const handleInput = useCallback(
    (e) => {
      const text = e.target.innerHTML;
      setContent(text);
      saveCaretPosition();

      if (!allowMentions) return;

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setLastCaretPosition(range.cloneRange());

        const editorRect = editorRef.current.getBoundingClientRect();
        const relativeX = rect.left - editorRect.left;
        const relativeY = rect.bottom - editorRect.top;

        const currentNode = range.startContainer;
        if (currentNode.nodeType === Node.TEXT_NODE) {
          const text = currentNode.textContent;
          const cursorPosition = range.startOffset;
          const textBeforeCursor = text.substring(0, cursorPosition);

          const lastAtIndex = textBeforeCursor.lastIndexOf("@");
          if (lastAtIndex !== -1) {
            const mentionText = textBeforeCursor.slice(lastAtIndex + 1);
            if (!mentionText.includes(" ")) {
              setMentionFilter(mentionText);
              setMentionPosition({
                x: relativeX,
                y: relativeY + 20,
              });
              setShowMentionPopover(true);
              return;
            }
          }
        }
        setShowMentionPopover(false);
      }
    },
    [setContent, allowMentions]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        execCommand("insertLineBreak");
        return;
      }

      if (allowMentions && e.key === "Backspace") {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const startContainer = range.startContainer;

          if (
            startContainer.nodeType === Node.TEXT_NODE &&
            range.startOffset === 0
          ) {
            const previousSibling = startContainer.previousSibling;
            if (previousSibling?.classList?.contains("mention")) {
              const userId = previousSibling.getAttribute("data-user-id");
              setMentionedUsers((prev) =>
                prev.filter((id) => id !== Number(userId))
              );
              e.preventDefault();
              previousSibling.remove();
              return;
            }
          }
        }
      }
    },
    [allowMentions]
  );

  const handlePaste = async (e) => {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.Clipboard;
    const items = clipboardData.items;

    for (let item of items) {
      const itemType = item.type;
      if (itemType) {
        if (itemType.startsWith("image/")) {
          const file = item.getAsFile();
          if (file && upload) {
            const uploadedImage = await upload(file);
            if (uploadedImage?.attachment) {
              // execCommand("insertImage", uploadedImage.attachment);
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
              execCommand("insertHTML", html);
            } else if (text) {
              execCommand("insertText", text);
            }

            // Break after inserting one type to prevent duplication
            break;
          }
        }
      }
    }
  };

  // Filter users based on input when mentions are enabled
  const filteredUsers = allowMentions
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
          (user.username &&
            user.username.toLowerCase().includes(mentionFilter.toLowerCase()))
      )
    : [];

  return (
    <div className="w-full max-w-[100%] mx-auto relative">
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
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Image
              strokeWidth={2.5}
              className={TextEditorIconClassName}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                saveCaretPosition(); // Save caret position before opening file picker
                fileInputRef.current.click();
              }}
            />
          </label>
        </div>
        {/* 
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
        )} */}

        <ScrollArea className="[&>div>div[style]]:!block">
          <div
            ref={editorRef}
            id={name}
            className={`w-full ${commentHeight} p-4 focus:outline-none rounded-b-lg textEditorText`}
            contentEditable
            onInput={handleInput}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
          />
        </ScrollArea>

        {allowMentions && showMentionPopover && (
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
                        <div className="text-sm">@{user.username}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-end border-t border-neutral-500 p-2">
          {/* <div className="flex items-center text-sm text-gray-900 font-inter">
            {content?.replace(/<[^>]*>/g, "").length} characters
          </div> */}
          {handleSubmitContent && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitContent(
                    content,
                    attachments,
                    allowMentions ? mentionedUsers : undefined
                  );
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
