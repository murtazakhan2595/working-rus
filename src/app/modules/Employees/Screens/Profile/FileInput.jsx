import React from 'react';
import { TfiFiles } from 'react-icons/tfi';

const FileInput = ({ name, onChange }) => {
  return (
    <div className="flex flex-col bg-[#F5F5FA] text-center file-input" style={{ padding: '4rem 2rem', borderRadius: '12px' }}>
      <h4>
        <TfiFiles className="m-auto mb-3" />
        Upload your Experience Letter or drag it here
      </h4>
      <label
        htmlFor={name}
        className="cursor-pointer opacity-70 rounded-lg text-input mt-3"
      >
        <input
          id={name}
          type="file"
          name={name}
          accept=".pdf"
          max-size="104857600"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                onChange(name, {
                  name: file.name,
                  file: event.target.result,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
          style={{ position: 'relative' }}
        />
      </label>
      <br />
    </div>
  );
};

export default FileInput;
