import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { ImageInput } from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { OrganizationInformation } from "app/utils/Types/Organization";
import { validateOrganizationSchema } from "app/utils/FormSchema/organizationFormSchema";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SelectInputComponent } from "components/FormControl";
import { getTimeZoneList } from "app/hooks/general";
import { dateFormats } from "data/Data";
import { days, CurrencyList } from "data/Data";
import { getOrganizationCountryList } from "app/hooks/officeSetting";
import { getRegionsList } from "app/hooks/officeSetting";
import { getCitiesList } from "app/hooks/officeSetting";
import { getCountryById } from "app/hooks/officeSetting";

const AddOrganizationForm = ({
  handleSubmit,
  isOpen,
  setIsOpen,
  editData,
  edit,
}) => {
  const [formData] = useState(
    edit
      ? editData
      : {
          ...OrganizationInformation,
          time_zone: "GST", // Default timezone to GST
          date_format: "%d/%m/%Y", // Default date format
          payroll_start_date: "10", // Default payroll starting date
        }
  );
  const [closeSheet, setCloseSheet] = useState(false);
  const [TimeZone, setTimeZone] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [state, setState] = useState(null);
  const [cities, setCities] = useState([]);

  // Store the selected display values for location dropdowns
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Loading states
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const fetchData = async () => {
    try {
      const TimeZoneData = await getTimeZoneList();
      setTimeZone(TimeZoneData);

      // Set loading state for countries
      setCountriesLoading(true);
      const countriesResponse = await getOrganizationCountryList();

      if (countriesResponse) {
        const countryList = countriesResponse.results.map((country) => ({
          value: `${country.id}`,
          label: country.name,
        }));
        setCountries(countryList);

        // If editing, try to find the country by its ID
        if (edit && formData.country) {
          const matchingCountry = await getCountryById(formData.country);
          console.log("Matching Country:", matchingCountry);
          console.log("Form Data Country:", formData.country);
          console.log("Countries List:", countryList);
          if (matchingCountry) {
            setSelectedCountry(matchingCountry);
            setCountry(formData.country);
            getStateList(formData.country);
          }
        }
      }

      if (edit && formData.country && formData.state) {
        getStateList(formData.country);
        getCityList(formData.state, formData.country);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCountriesLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  useEffect(() => {
    console.log("Country or state changed:", country, state);
    country && getStateList(country);
    state && getCityList(state, country);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, state]);

  const getStateList = async (country) => {
    console.log("Fetching states for country:", country);
    setStatesLoading(true);
    try {
      let statesResponse = await getRegionsList({
        filterData: { country: country },
      });
      if (statesResponse) {
        const stateList = statesResponse.results.map((state) => ({
          value: `${state.id}`,
          label: state.name,
        }));
        setStates(stateList);

        // If editing, try to find the state by its ID
        if (edit && formData.state) {
          const matchingState = stateList.find(
            (s) => s.value === formData.state
          );
          if (matchingState) {
            setSelectedState(matchingState);
            setState(formData.state);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setStatesLoading(false);
    }
  };

  const getCityList = async (state, country) => {
    setCitiesLoading(true);
    try {
      let citiesResponse = await getCitiesList({
        filterData: { country: country, state: state },
      });
      if (citiesResponse) {
        const cityList = citiesResponse.results.map((city) => ({
          value: `${city.id}`,
          label: city.name,
        }));
        setCities(cityList);

        // If editing, try to find the city by its ID
        if (edit && formData.city) {
          const matchingCity = cityList.find((c) => c.value === formData.city);
          if (matchingCity) {
            setSelectedCity(matchingCity);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setCitiesLoading(false);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={formData}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validate={validateOrganizationSchema}
        enableReinitialize={true}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            {/* Main Office Section */}
            <SheetCardExtension title="Main Office">
              <div className="space-y-4">
                <div className="space-y-2">
                  <ImageInput
                    name={"logo"}
                    error={props.errors.logo}
                    touch={props.touched.logo}
                    value={props.values.logo}
                    label={"Company Logo"}
                    required={true}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    maxFileSize={100} // Max file size in KB
                    acceptedFileTypes={["image/jpeg", "image/png"]} // Allowed file types
                  />
                </div>
                {console.log("Formik props:", props)}
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
                    name="company_description"
                    label="Company Description"
                    required={false} // Changed to optional
                    maxRows={3}
                    value={props.values.company_description}
                    error={props.errors.company_description}
                    touch={props.touched.company_description}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                  <TextInput
                    name="licensing_authority"
                    label="Licensing Authority"
                    required={false} // Changed to optional
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
                    required={false} // Changed to optional
                    value={props.values.registration_number}
                    error={props.errors.registration_number}
                    touch={props.touched.registration_number}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                  <SelectInputComponent
                    name="time_zone"
                    options={TimeZone}
                    error={props.errors.time_zone}
                    touch={props.touched.time_zone}
                    value={props.values.time_zone}
                    label="Timezone"
                    required
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                  <SelectInputComponent
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
                  <SelectInputComponent
                    name="currency"
                    options={CurrencyList}
                    error={props.errors.currency}
                    touch={props.touched.currency}
                    value={props.values.currency}
                    label="Currency"
                    required
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                  <SelectInputComponent
                    name="payroll_start_date"
                    options={days}
                    error={props.errors.payroll_start_date}
                    touch={props.touched.payroll_start_date}
                    value={props.values.payroll_start_date}
                    label="Payroll Starting Date"
                    required
                    onChange={(field, value) => {
                      if (!value) {
                        console.error("Invalid selection");
                        return;
                      }
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
              </div>
            </SheetCardExtension>

            {/* Address Info Section */}
            <SheetCardExtension title="Address Info" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                  <SelectInputComponent
                    name="country"
                    label="Country"
                    required
                    options={countries}
                    value={props.values.country}
                    error={props.errors.country}
                    touch={props.touched.country}
                    disabled={countriesLoading}
                    placeholder={
                      countriesLoading ? "Loading countries..." : null
                    }
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      // Handle dependencies with a small delay to allow form validation to complete
                      setTimeout(() => {
                        setCountry(value);
                        setState(null);
                        setSelectedState(null);
                        setSelectedCity(null);
                        setStates([]);
                        setCities([]);
                        props.setFieldValue("state", "");
                        props.setFieldValue("city", "");
                        props.setFieldValue("state_name", "");
                        props.setFieldValue("city_name", "");
                      }, 0);
                    }}
                  />

                  <SelectInputComponent
                    name="state"
                    label="State"
                    required
                    options={states}
                    value={props.values.state}
                    error={props.errors.state}
                    touch={props.touched.state}
                    disabled={statesLoading || !country}
                    placeholder={statesLoading ? "Loading states..." : null}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      // Handle dependencies with a small delay to allow form validation to complete
                      setTimeout(() => {
                        setState(value);
                        setSelectedCity(null);
                        setCities([]);
                        props.setFieldValue("city", "");
                        props.setFieldValue("city_name", "");
                        
                        // Find the selected state object and set state_name
                        const selectedStateObj = states.find(
                          (s) => s.value === value
                        );
                        if (selectedStateObj) {
                          setSelectedState(selectedStateObj);
                          props.setFieldValue("state_name", selectedStateObj.label);
                        }
                      }, 0);
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2">
                  {console.log("citiesLoading:", citiesLoading)}
                  {console.log("state:", props.values.state)}
                  <SelectInputComponent
                    name="city"
                    label="City"
                    required
                    options={cities}
                    value={props.values.city}
                    error={props.errors.city}
                    touch={props.touched.city}
                    disabled={citiesLoading || !props.values.state}
                    placeholder={citiesLoading ? "Loading cities..." : null}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      // Handle dependencies with a small delay to allow form validation to complete
                      setTimeout(() => {
                        // Find the selected city object and set city_name
                        const selectedCityObj = cities.find(
                          (c) => c.value === value
                        );
                        if (selectedCityObj) {
                          setSelectedCity(selectedCityObj);
                          props.setFieldValue("city_name", selectedCityObj.label);
                        }
                      }, 0);
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
              </div>
            </SheetCardExtension>

            {/* Contact Info Section */}
            <SheetCardExtension title="Contact Info" className="mt-4">
              <div className="space-y-4">
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
                    placeholder="https://example.com"
                    type="url" // Ensure URL validation
                  />
                  <TextInput
                    name="contact_person"
                    label="Official Contact Person"
                    required={false} // Changed to optional
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
                    type="tel" // Use tel input type for phone numbers
                    placeholder="+1234567890" // Example format
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
                    type="email" // Ensure email validation
                    placeholder="office@example.com"
                  />
                </div>
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
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
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
