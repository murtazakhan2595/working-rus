import { TextAreaInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { ImageInput } from "components/form-control";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import React, { useState, createRef, useEffect } from "react";
import { Formik } from "formik";
import { OrganizationInformation } from "app/utils/Types/Organization";
import { validateOrganizationSchema } from "app/utils/FormSchema/organizationFormSchema";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { currencies } from "country-data";
import { SelectComponent } from "components/form-control";
import { getCurrenciesList } from "app/hooks/general";
import { dateFormats } from "data/Data";
import { days } from "data/Data";
import { getOrganizationCountryList } from "app/hooks/officeSetting";

const AddOrganizationForm = ({
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  edit,
}) => {
  const formRef = createRef();
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState(
    edit ? editData : OrganizationInformation
  );
  const [closeSheet, setCloseSheet] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);

  console.log("formData", formData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currencyData = await getCurrenciesList();
        setCurrencies(currencyData);
        const countries = await getOrganizationCountryList();
        if (countries) {
          const countryList = countries.results.map((country) => ({
            value: `${country.id}`,
            label: country.name,
          }));
          setCountries(countryList);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  console.log("COU", countries);
  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={formData}
        // innerRef={formRef}
        onSubmit={(values, { resetForm }) => {
          console.log(values, "VALUES ARE HERE");
          handleSubmit(values, resetForm); // Call the parent function here
        }}
        validate={validateOrganizationSchema}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            {/* Main Office Section */}
            <SheetCardExtension title="Main Office">
              {/* <div className="space-y-2">
                <ImageInput
                  name="logo"
                  label="Company Logo"
                  // required
                  // error={props.errors.logo}
                  // touch={props.touched.logo}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    setImageError(null);
                  }}
                  setImageError={setImageError}
                />
              </div> */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="name"
                  label="Company Title"
                  required
                  error={props.errors.name}
                  touch={props.touched.name}
                  value={props.values.name}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <TextInput
                  name="legal_name"
                  label="Company's Legal Name"
                  required
                  value={props.values.legal_name}
                  error={props.errors.legal_name}
                  touch={props.touched.legal_name}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="col-span-1 space-y-2 xl:col-span-3 lg:col-span-2 md:col-span-2">
                <TextAreaInput
                  name="companyDescription"
                  label="Company Description"
                  required
                  maxRows={3}
                  value={props.values.companyDescription}
                  error={props.errors.companyDescription}
                  touch={props.touched.companyDescription}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="licensing_authority"
                  label="Licensing Authority"
                  required
                  error={props.errors.licensing_authority}
                  touch={props.touched.licensing_authority}
                  value={props.values.licensing_authority}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <TextInput
                  name="registration_number"
                  label="Licensing Number"
                  required
                  value={props.values.registration_number}
                  error={props.errors.registration_number}
                  touch={props.touched.registration_number}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="time_zone"
                  label="Timezone"
                  required
                  error={props.errors.time_zone}
                  touch={props.touched.time_zone}
                  value={props.values.time_zone}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <SelectComponent
                  name="date_format"
                  options={dateFormats}
                  error={props.errors.date_format}
                  touch={props.touched.date_format}
                  value={props.values.date_format}
                  label="Date Format"
                  required
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
              {console.log("CURRENCIES", currencies)}
                <SelectComponent
                  name="currency"
                  options={currencies}
                  error={props.errors.currency}
                  touch={props.touched.currency}
                  value={props.values.currency}
                  label="Currency"
                  required
                  onChange={(field, value) => {
                    console.log("MKKK", field, value);
                    props.handleChange(field)(value);
                  }}
                />
                <SelectComponent
                  name="payroll_start_date"
                  options={days}
                  error={props.errors.payroll_start_date}
                  touch={props.touched.payroll_start_date}
                  value={props.values.payroll_start_date}
                  label="Payroll Starting Date"
                  required
                  onChange={(field, value) => {
                    console.log("MKKK", field, value);
                    if (!value) {
                      console.error("Invalid selection");
                      return;
                    }
                    props.handleChange(field)(value);
                  }}
                />
              </div>
            </SheetCardExtension>

            {/* Address Info Section */}
            <SheetCardExtension title="Address Info" className="mt-4">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <SelectComponent
                  name="country"
                  label="Country"
                  required
                  options={countries}
                  value={props.values.country}
                  error={props.errors.country}
                  touch={props.touched.country}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />

                <TextInput
                  name="state"
                  label="State"
                  required
                  value={props.values.state}
                  error={props.errors.state}
                  touch={props.touched.state}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="city"
                  label="City"
                  required
                  value={props.values.city}
                  error={props.errors.city}
                  touch={props.touched.city}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <TextInput
                  name="po_box"
                  label="Zip/Postal Code"
                  required
                  value={props.values.po_box}
                  error={props.errors.po_box}
                  touch={props.touched.po_box}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <TextAreaInput
                name="address"
                label="Address"
                required
                maxRows={3}
                value={props.values.address}
                error={props.errors.address}
                touch={props.touched.address}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
            </SheetCardExtension>

            {/* Contact Info Section */}
            <SheetCardExtension title="Contact Info" className="mt-4">
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="website"
                  label="Official Website"
                  required
                  value={props.values.website}
                  error={props.errors.website}
                  touch={props.touched.website}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <TextInput
                  name="contact_person"
                  label="Official Contact Person"
                  required
                  value={props.values.contact_person}
                  error={props.errors.contact_person}
                  touch={props.touched.contact_person}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                <TextInput
                  name="phone_number"
                  label="Office Contact Number"
                  required
                  value={props.values.phone_number}
                  error={props.errors.phone_number}
                  touch={props.touched.phone_number}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
                <TextInput
                  name="email"
                  label="Official Email"
                  required
                  value={props.values.email}
                  error={props.errors.email}
                  touch={props.touched.email}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
            </SheetCardExtension>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" variant="default">
                  {edit ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddOrganizationForm;
