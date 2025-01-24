import React, { useState } from "react";
import { TextInput} from "components/FormControl";


const InputTaskTitle = ({
  onChange,
  error,
  value,
  touched,
}) => {
  const [editingMode, setEditingMode] = useState(false);
  return (
    <div onClick={()=>setEditingMode(true)}>
      {(editingMode || !value) ? (
          <TextInput
            name="name"
            error={error}
            touch={touched}
            value={value}
            required={true}
            onChange={(field, value) => {
              onChange(field, value);
            }}
            onBlur={async (e) => {
              // await props.setFieldTouched("name", true);
              // setEditingField(null);
              // if (props.values.name !== taskData.name) {
              //   await props.submitForm();
              // }
              setEditingMode(false)
            }}
            autoFocus
          />
      ) : (
        <div
          className="border border-neutral-500 font-semibold text-neutral-1200 cursor-pointer p-2 rounded"
          // onDoubleClick={() => setEditingField("name")}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default InputTaskTitle;
