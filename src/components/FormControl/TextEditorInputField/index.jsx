import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
} from "lucide-react";
import { Button } from "components/ui/button";
import { ScrollArea } from "src/@/components/ui/scroll-area";
import { FormField } from "components/FormControl";
import Avatar from "components/ui/avatar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "src/@/components/ui/command";
import "./style.css";

const TextEditorIconClassName = "w-4 h-4";

const TextEditorInputField = ({
  required = false,
  error = null,
  touch = null,
  disabled = null,
  description = null,
  handleSubmitContent,
  value = "",
  upload,
  onChange = () => { },
  setAttachments = () => { },
  attachments = [],
  name = "editor",
  label = false,
  className = "",
  users = [],
  allowMentions = false,
  editMode = false,
  replyToUser = null,
  commentHeight = "h-[300px]",
  placeholder = "Write a comment..."
}) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showMentionPopover, setShowMentionPopover] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [mentionedUsers, setMentionedUsers] = useState([]);

  // ✅ Keep track of caret position to restore accurately after DOM updates
  const caretRef = useRef(null);

  /** 🧩 Maintain caret position accurately */
  const saveCaret = useCallback(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) caretRef.current = sel.getRangeAt(0).cloneRange();
  }, []);

  const restoreCaret = useCallback(() => {
    const sel = window.getSelection();
    if (caretRef.current) {
      sel.removeAllRanges();
      sel.addRange(caretRef.current);
    }
  }, []);

  /** 🧩 Initialize editor content (once for edit mode) */
  useLayoutEffect(() => {
    if (editorRef.current && editMode) {
      editorRef.current.innerHTML = value || "";
    }
  }, [editMode]);

  /** 🧩 Handle bold, italic, underline, list, etc. */
  const execCommand = (cmd, val = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    saveCaret();
  };

  /** 🧩 Handle input events (updates without resetting caret) */
  const handleInput = useCallback(
    (e) => {
      onChange(name, e.target.innerHTML);
      saveCaret();

      // Detect @mentions
      if (!allowMentions) return;
      const sel = window.getSelection();
      if (!sel.rangeCount) return;

      const range = sel.getRangeAt(0);
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.textContent;
        const lastAt = text.lastIndexOf("@", range.startOffset - 1);
        if (lastAt !== -1) {
          const filter = text.slice(lastAt + 1, range.startOffset);
          if (!filter.includes(" ")) {
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();
            setMentionPosition({
              x: rect.left - editorRect.left,
              y: rect.bottom - editorRect.top + 20,
            });
            setMentionFilter(filter);
            setShowMentionPopover(true);
            return;
          }
        }
      }
      setShowMentionPopover(false);
    },
    [allowMentions, onChange, name, saveCaret]
  );

  /** 🧩 Handle mention selection */
  const handleMentionSelect = useCallback(
    (user) => {
      if (!allowMentions || !caretRef.current) return;

      restoreCaret();
      const range = window.getSelection().getRangeAt(0);

      // Remove the @ text before inserting mention
      const startNode = range.startContainer;
      const offset = range.startOffset;
      const text = startNode.textContent;
      const atIndex = text.lastIndexOf("@", offset - 1);

      if (atIndex >= 0) {
        const before = text.slice(0, atIndex);
        const after = text.slice(offset);
        const mentionSpan = document.createElement("span");
        mentionSpan.className = "mention bg-blue-100 px-1 rounded";
        mentionSpan.textContent = `@${user.name}`;
        mentionSpan.setAttribute("data-user-id", user.id);
        mentionSpan.contentEditable = false;

        const fragment = document.createDocumentFragment();
        if (before) fragment.appendChild(document.createTextNode(before));
        fragment.appendChild(mentionSpan);
        fragment.appendChild(document.createTextNode(" " + after));

        startNode.parentNode.replaceChild(fragment, startNode);

        const newRange = document.createRange();
        newRange.setStartAfter(mentionSpan);
        newRange.collapse(true);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);
      }

      setMentionedUsers((prev) =>
        prev.includes(user.id) ? prev : [...prev, user.id]
      );
      setShowMentionPopover(false);
      onChange(name, editorRef.current.innerHTML);
    },
    [allowMentions, onChange, name, restoreCaret]
  );

  /** 🧩 Handle image upload */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (upload) {
      const uploaded = await upload(file);
      if (uploaded?.attachment) insertImage(uploaded.attachment);
    } else {
      insertImage(URL.createObjectURL(file));
    }
  };

  /** 🧩 Insert image at caret */
  const insertImage = (url) => {
    restoreCaret();
    const img = document.createElement("img");
    img.src = url;
    img.alt = "image";
    img.style.maxWidth = "100%";
    const range = window.getSelection().getRangeAt(0);
    range.insertNode(img);
    range.collapse(false);
    onChange(name, editorRef.current.innerHTML);
  };

  /** 🧩 Handle submit */
  const handleSubmit = () => {
    handleSubmitContent(
      editorRef.current.innerHTML,
      attachments,
      allowMentions ? mentionedUsers : []
    );
  };

  /** 🧩 Filter users for mentions */
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      error={error}
      touched={touch}
      className={className}
      disabled={disabled}
      field_description={description}
    >
      <div className="w-full max-w-full mx-auto relative">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border border-gray-300 bg-gray-50 rounded-t-lg px-2 py-1">
          <ToolbarButton icon={<Bold />} command="bold" exec={execCommand} />
          <ToolbarButton icon={<Italic />} command="italic" exec={execCommand} />
          <ToolbarButton
            icon={<Underline />}
            command="underline"
            exec={execCommand}
          />
          <div className="h-4 w-[1px] bg-gray-400 mx-2"></div>
          <ToolbarButton
            icon={<ListOrdered />}
            command="insertOrderedList"
            exec={execCommand}
          />
          <ToolbarButton
            icon={<List />}
            command="insertUnorderedList"
            exec={execCommand}
          />
          <div className="h-4 w-[1px] bg-gray-400 mx-2"></div>
          <label>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current.click()}
            >
              <Image className={TextEditorIconClassName} />
            </Button>
          </label>
        </div>

        {/* Editable Area */}
        <ScrollArea>
          <div
            ref={editorRef}
            className={`w-full ${commentHeight} p-3 bg-white border-x border-b border-gray-300 rounded-b-lg focus:outline-none textEditorText`}
            contentEditable={!disabled}
            placeholder={placeholder}
            onInput={handleInput}
            onKeyUp={saveCaret}
            suppressContentEditableWarning
          ></div>
        </ScrollArea>

        {/* Mention Popover */}
        {allowMentions && showMentionPopover && (
          <div
            className="absolute z-50 bg-white shadow-lg border rounded-md"
            style={{
              left: mentionPosition.x,
              top: mentionPosition.y,
              width: "220px",
            }}
          >
            <Command>
              <CommandInput
                placeholder="Search users..."
                value={mentionFilter}
                onValueChange={setMentionFilter}
              />
              <CommandList>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleMentionSelect(user)}
                    className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100"
                  >
                    <Avatar
                      src={user.profile_picture}
                      fallbackText={user.name.charAt(0)}
                      className="h-8 w-8"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        )}

        {/* Submit Button */}
        {handleSubmitContent && (
          <div className="flex justify-end border-t border-gray-200 p-2">
            <Button size="sm" variant="outline" onClick={handleSubmit}>
              Comment
            </Button>
          </div>
        )}
      </div>
    </FormField>
  );
};

/** Toolbar Button Component */
const ToolbarButton = ({ icon, command, exec }) => (
  <Button
    type="button"
    size="icon"
    variant="ghost"
    onClick={() => exec(command)}
    className="hover:bg-gray-200"
  >
    {React.cloneElement(icon, { className: TextEditorIconClassName })}
  </Button>
);

export default TextEditorInputField;
