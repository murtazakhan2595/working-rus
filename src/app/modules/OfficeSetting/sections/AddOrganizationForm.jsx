import { TextAreaInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { ImageInput } from "components/form-control";
import { SheetCardExtension } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import React, { useState } from "react";

const AddOrganizationForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(null);

  const formSheetData = {
    triggerText: "New Organization",
    title: "New Organization",
    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="600px"
    >
      <SheetCardExtension title="Main Office">
        <div className="space-y-2">
          <ImageInput
            name="logo"
            label="Company Logo"
            required={true}
            setImageError={setImageError}
            // onChange={(field, value) => {
            //   props.setFieldValue(field, value);
            //   setImageError(null);
            // }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
          <TextInput
            name="companyTitle"
            label="Company Title"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
          <TextInput
            name="companyLegalName"
            label="Company's Legal Name"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        </div>
        <div className="col-span-1 space-y-2 xl:col-span-3 lg:col-span-2 md:col-span-2">
          <TextAreaInput
            name="companyDescription"
            label="Company Description"
            required={true}
            maxRows={3}
            // error={props.errors?.companyDescription}
            // touch={props.touched?.companyDescription}
            // value={props.values?.companyDescription}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
          <TextInput
            name="licensingNumber"
            label="Licensing Number"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
          <TextInput
            name="licensingAuthority"
            label="Licensing Authority"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
          <TextInput
            name="timezone"
            label="Timezone"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
          <TextInput
            name="timeFormat"
            label="Time Format"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
          <TextInput
            name="teamSize"
            label="Team Size"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
          <TextInput
            name="payrollStartingDate"
            label="Payroll Starting Date"
            required={true}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        </div>
        </SheetCardExtension>

        <SheetCardExtension title="Address Info" className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
            <TextInput
              name="officeContactNumber"
              label="City"
              required={true}
              placeholder="Add value"
            />
            <TextInput
              name="officialEmail"
              label="State"
              required={true}
              placeholder="Add value"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
            <TextInput
              name="contactPersonName"
              label="Country"
              required={true}
              placeholder="Add value"
            />
            <TextInput
              name="contactPersonNumber"
              label="Zip/ Postal Code"
              required={true}
              placeholder="Add value"
            />
          </div>

          <TextAreaInput
            name="companyDescription"
            label="Company Description"
            required={true}
            maxRows={3}
            // error={props.errors?.companyDescription}
            // touch={props.touched?.companyDescription}
            // value={props.values?.companyDescription}
            // onChange={(field, value) => {
            //   props.handleChange(field)(value);
            // }}
          />
        
      </SheetCardExtension>

        <SheetCardExtension title="Contact Info" className="mt-4">
          <TextInput
            name="officialWebsite"
            label="Official Website"
            required={true}
            placeholder="Add value"
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
            <TextInput
              name="officeContactNumber"
              label="Office Contact Number"
              required={true}
              placeholder="Add value"
            />
            <TextInput
              name="officialEmail"
              label="Official Email"
              required={true}
              placeholder="Add value"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
            <TextInput
              name="contactPersonName"
              label="Contact Person Name"
              required={true}
              placeholder="Add value"
            />
            <TextInput
              name="contactPersonNumber"
              label="Contact Person Number"
              required={true}
              placeholder="Add value"
            />
          </div>
        
      </SheetCardExtension>
      
    </SheetComponent>
  );
};

export default AddOrganizationForm;
