import React, { useState, useEffect } from 'react';
import { FileUp } from 'lucide-react';

const CoverFileUpload = ({
    name,
    value,
    error,
    touch,
    onChange,
    label,
    acceptType,
    required,
    maxSize = 10 // in MB
  }) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);
  
    // Set preview when value changes
    useEffect(() => {
      if (value?.file) {
        setPreview(value.file);
      }
    }, [value]);
  
    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
  
    const validateFile = (file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        return false;
      }
      return true;
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
  
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    };
  
    const handleChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        handleFile(file);
      }
    };
  
    const handleFile = (file) => {
      if (validateFile(file)) {
        const reader = new FileReader();
        reader.onload = () => {
          // Create file object with name and data
          const fileData = {
            name: file.name,
            file: reader.result
          };
          onChange(name, fileData);
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="flex flex-col gap-4">
        <Label className="text-neutral-1000" htmlFor={name}>
          {required && <span className="text-red-600">* </span>}
          {label}
        </Label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              {acceptType === '.pdf' ? (
                // PDF preview
                <div className="w-full h-48 flex items-center justify-center bg-neutral-200 rounded-lg">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-neutral-1000" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-neutral-1000">{value?.name || 'PDF Document'}</p>
                  </div>
                </div>
              ) : (
                // Image preview
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <button
                onClick={() => {
                  setPreview(null);
                  onChange(name, null);
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <div className="mb-4">
                <FileUp className="w-16 h-16 text-neutral-400" />
              </div>
              <p className="mb-2">
                <span className="text-primary-600 font-semibold">Upload a file</span>
                <span className="text-neutral-500"> or drag and drop</span>
              </p>
              <p className="text-sm text-neutral-500">
                {acceptType === '.pdf' ? 'Please upload PNG, JPG, GIF, or PDF up to 10MB' : 'PNG, JPG, GIF up to 10MB'}
              </p>
              
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                accept={acceptType}
                title=""
              />
            </div>
          )}
        </div>
        {error && touch && <div className="text-red-600">{error}</div>}
      </div>
    );
  };
  

export default CoverFileUpload;