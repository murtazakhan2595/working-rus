import React, { useEffect, useState } from "react";
import { TextInput } from "components/FormControl";

const ThirdPartIntegration = ({ formikProps }) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Third Party Integration</h3>
        <TextInput
          name="biometric_id"
          error={formikProps.errors?.biometric_id}
          touch={formikProps.touched?.biometric_id}
          value={formikProps.values?.biometric_id}
          label="Biometric Id"
          onChange={(field, value) => {
            formikProps.handleChange(field)(value);
          }}
        />
      </div>
    </>
  );
};
export default ThirdPartIntegration;
