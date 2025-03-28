import React, { useState, useEffect, useRef, useCallback } from "react";
import { Undo2, RotateCcw, Redo2, CheckCheck } from "lucide-react";
import {
  FormField,
  inputButtonClassName,
  InvalidInput,
} from "components/FormControl";
import { cn } from "src/@/lib/utils";
import { Button } from "components/ui/button";
import { convert_base64_To_File, convert_Text_To_File } from "utils/fileUtils";

const InputSignature = React.memo(
  ({
    name,
    error,
    touch,
    value = null, // Current selected values
    label = null, // Label for the select field
    onChange = () => {}, // Function to handle selection change
    required = false, // Whether the field is required
    className = "w-full", // Custom styling
    variant = "Draw", // Determine signature variant i.e. [Draw, Type, Image]
    disabled = false,
    setError = () => {},
  }) => {
    const [signature, setSignature] = useState(value);
    const [color, setColor] = useState("#000000");
    const [thickness, setThickness] = useState(2);
    const [font, setFont] = useState("Dancing Script");
    const [fontSize, setFontSize] = useState(32);
    const [typedText, setTypedText] = useState("");
    const canvasRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isDrawing, setIsDrawing] = useState(false);

    const clearSignature = useCallback((event) => {
      event.preventDefault();
      setSignature(null);
      setTypedText("");
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setHistory([]);
      setHistoryIndex(-1);
      onChange(name, null);
    }, []);

    const handleDraw = useCallback(
      (e) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Get canvas offset
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // Account for scaling
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        ctx.lineWidth = thickness;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      },
      [isDrawing]
    );

    const startDrawing = useCallback((e) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      ctx.beginPath();
      ctx.moveTo(x, y);
    }, []);

    const stopDrawing = useCallback(() => {
      if (!isDrawing) return;
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const newHistory = [
        ...history.slice(0, historyIndex + 1),
        canvas.toDataURL(),
      ];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, isDrawing]);

    const undo = useCallback(
      (event) => {
        event.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
          const img = new Image();
          img.src = history[historyIndex - 1];
          img.onload = () => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            ctx.drawImage(img, 0, 0);
          };
        }
      },
      [history, historyIndex]
    );

    const redo = useCallback(
      (event) => {
        event.preventDefault();
        if (historyIndex < history.length - 1) {
          setHistoryIndex(historyIndex + 1);
          const img = new Image();
          img.src = history[historyIndex + 1];
          img.onload = () => {
            const ctx = canvasRef.current.getContext("2d");
            ctx.clearRect(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
            );
            ctx.drawImage(img, 0, 0);
          };
        }
      },
      [history, historyIndex]
    );

    const handleUpload = useCallback(async (file) => {
      try {
        setSignature(file);
        setError(null);
      } catch (err) {
        setError("Failed to upload image");
        console.error(err);
      }
    }, []);

    const handleSave = useCallback(
      async (event) => {
        event.preventDefault();
        let signatureData;
        if (variant === "Draw" && canvasRef.current) {
          signatureData = convert_base64_To_File(canvasRef.current.toDataURL());
        } else if (variant === "Type" && typedText) {
          signatureData = await convert_Text_To_File(typedText);
        } else if (variant === "Image" && signature) {
          signatureData = signature;
        }

        if (!signatureData) {
          setError("Please create a signature before saving");
          return;
        }

        onChange(name, signatureData);
        setError(null);
      },
      [typedText, signature, onChange]
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
      >
        <div
          className={cn(
            inputButtonClassName,
            "w-full p-0",
            error && touch ? InvalidInput : ""
          )}
        >
          <div className="">
            {variant === "Draw" && (
              <div>
                <canvas
                  ref={canvasRef}
                  width="600"
                  height="200"
                  onMouseDown={startDrawing}
                  onMouseMove={handleDraw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="bg-gray-300 rounded-lg w-full"
                />
                <div className="flex items-center text-neutral-1200 justify-end">
                  <Button
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    size="icon"
                    variant="ghost"
                    title="Undo"
                  >
                    <Undo2 size={19} />
                  </Button>
                  <Button
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    size="icon"
                    variant="ghost"
                    title="Redo"
                  >
                    <Redo2 size={19} />
                  </Button>
                  <ClearSignature clearSignature={clearSignature} />
                  <SaveSignature handleSave={handleSave} />
                </div>
              </div>
            )}

            {variant === "Type" && (
              <div>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                >
                  <option value="Dancing Script">Dancing Script</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Great Vibes">Great Vibes</option>
                </select>
                <input
                  type="text"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  placeholder="Type your signature"
                  className="w-full p-2 border rounded-md mb-4"
                />
                <input
                  type="range"
                  min="16"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full mb-4"
                />
                <div
                  className="h-20 border rounded-md flex items-center justify-center"
                  style={{
                    fontFamily: font,
                    fontSize: `${fontSize}px`,
                    color: color,
                  }}
                >
                  {typedText}
                </div>
                <ClearSignature clearSignature={clearSignature} />
                <SaveSignature handleSave={handleSave} />
              </div>
            )}

            {variant === "Image" && (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleUpload(file);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Choose a file
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  or drag and drop here
                </p>
                {signature && (
                  <img
                    src={signature}
                    alt="Uploaded signature"
                    className="mt-4 max-h-40 mx-auto"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </FormField>
    );
  }
);

const SaveSignature = ({ handleSave = () => {} }) => {
  return (
    <Button onClick={handleSave} size="icon" variant="ghost" title="Save">
      <CheckCheck size={19} />
    </Button>
  );
};

const ClearSignature = ({ clearSignature = () => {} }) => {
  return (
    <Button
      onClick={clearSignature}
      size="icon"
      variant="ghost"
      title="Clear All"
    >
      <RotateCcw size={19} />
    </Button>
  );
};

const ViewSignature = ({ signature }) => {
  if (!signature) return null;
  const signatureURL =
    signature instanceof File ? URL.createObjectURL(signature) : signature;

  return (
    <div>
      <img src={signatureURL} alt="Signature" className="w-auto h-auto" />
    </div>
  );
};

export {InputSignature,ViewSignature};
