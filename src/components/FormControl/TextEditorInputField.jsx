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
    TextEditorStyle.includes(active) ? "active:text-primary" : ""
  } p-1`;
};
function useUpload() {
  const [loading, setLoading] = React.useState(false);
  const upload = React.useCallback(async (input) => {
    try {
      setLoading(true);
      let response;
      if ("file" in input) {
        const formData = new FormData();
        formData.append("file", input.file);
        response = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          body: formData,
        });
      } else if ("url" in input) {
        response = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: input.url }),
        });
      } else if ("base64" in input) {
        response = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64: input.base64 }),
        });
      } else {
        response = await fetch(`${window.location.origin}/api/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: input.buffer,
        });
      }
      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("Upload failed: File too large.");
        }
        throw new Error("Upload failed");
      }
      const data = await response.json();
      return { url: data.url, mimeType: data.mimeType || null };
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        return { error: uploadError.message };
      }
      if (typeof uploadError === "string") {
        return { error: uploadError };
      }
      return { error: "Upload failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  return [upload, { loading }];
}
function TextEditorInputField() {
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const [activeStyle, setActiveStyle] = useState([]);
  const [upload, { loading }] = useUpload();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef(null);

  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
  }, []);

  const handleBold = () => {
    execCommand("bold");
    setActiveStyle([...activeStyle,"bold".toUpperCase()]);
  };
  const handleItalic = () => execCommand("italic");
  const handleUnderline = () => execCommand("underline");
  const handleUnorderedList = () => execCommand("insertUnorderedList");
  const handleOrderedList = () => execCommand("insertOrderedList");

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
      if (!file) return;

      const { url, error } = await upload({ file });
      if (error) {
        alert("Error uploading image");
        return;
      }

      execCommand("insertImage", url);
    },
    [upload, execCommand]
  );
  const handleFileChange = (event) => {
    // const file = event.target.files[0]; // Get the single file
    // if (file) {
    //   const attachment = {
    //     attachment: file,
    //     name: file.name,
    //   };
    //   setCommentAttachment([...commentAttachments, ...[attachment]]);
    // }
  };
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-lg border border-neutral-500 bg-white">
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-500 p-2">
          <Button
            variant="ghost"
            onClick={handleBold}
            className={TextEditorButtonClassName("BOLD")}
          >
            <Bold strokeWidth={2.5} className={TextEditorIconClassName} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleItalic}
            className={TextEditorButtonClassName("ITALIC")}
          >
            {/* <Italic strokeWidth={2.5} /> */}
            <Italic strokeWidth={2.5} className={TextEditorIconClassName} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleUnderline}
            className={TextEditorButtonClassName("UNDERLINE")}
          >
            <Underline strokeWidth={2.5} className={TextEditorIconClassName} />{" "}
          </Button>
          <div className="h-4 w-[1px] bg-neutral-500 mx-2"></div>
          <Button
            variant="ghost"
            onClick={handleUnorderedList}
            className={TextEditorButtonClassName}
          >
            <List strokeWidth={2.5} className={TextEditorIconClassName} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleOrderedList}
            className={TextEditorButtonClassName("ORDEREDLIST")}
          >
            <ListOrdered
              strokeWidth={2.5}
              className={TextEditorIconClassName}
            />
          </Button>
          <div className="h-4 w-[1px] bg-neutral-500 mx-2"></div>
          <Button
            variant="ghost"
            onClick={handleLink}
            className={TextEditorButtonClassName("UNORDEREDLIST")}
          >
            <Link strokeWidth={2.5} className={TextEditorIconClassName} />
          </Button>
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
        <div
          ref={editorRef}
          className="w-full min-h-[200px] p-4 focus:outline-none rounded-b-lg "
          contentEditable
          onInput={(e) => setContent(e.target.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div className="p-4 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              // handleSubmitComment(newComment, commentAttachments);
            }}
          >
            {"Comment"}
          </Button>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-900 font-inter">
        {content.replace(/<[^>]*>/g, "").length} characters
      </div>
    </div>
  );
}

export default TextEditorInputField;
