import React, { useState, useEffect, useRef, useCallback } from "react";

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
  const [content, setContent] = useState("");
  const [upload, { loading }] = useUpload();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const editorRef = useRef(null);

  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
  }, []);

  const handleBold = () => execCommand("bold");
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 p-2">
          <button
            onClick={handleBold}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-bold"></i>
          </button>
          <button
            onClick={handleItalic}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-italic"></i>
          </button>
          <button
            onClick={handleUnderline}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-underline"></i>
          </button>
          <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
          <button
            onClick={handleUnorderedList}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            onClick={handleOrderedList}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-list-ol"></i>
          </button>
          <div className="h-4 w-[1px] bg-gray-200 mx-2"></div>
          <button
            onClick={handleLink}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <i className="fas fa-link"></i>
          </button>
          <label className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">
            <i className="fas fa-image"></i>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
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
              <button
                onClick={handleLink}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div
          ref={editorRef}
          className="w-full min-h-[200px] p-4 focus:outline-none rounded-b-lg font-inter text-gray-800"
          contentEditable
          onInput={(e) => setContent(e.target.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
      <div className="mt-2 text-sm text-gray-500 font-inter">
        {content.replace(/<[^>]*>/g, "").length} characters
      </div>
    </div>
  );
}

export default TextEditorInputField;
