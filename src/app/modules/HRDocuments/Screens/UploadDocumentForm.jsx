import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Document, DocumentAssignment } from "app/utils/Types/HRDocuments";
import { validationHRDocumentFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { HRDocumentTargetAudience, HRDocumentCategory } from "data/Data";
import {
  RadioGroupInput,
  TextAreaInput,
  SelectInputComponent,
  DateInput,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";
import { SheetUI } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  getHRDocumentData,
  addUpdateHRDocumentDetails,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";

const FormSheetData = {
  triggerText: "Submit",
  title: "Upload New Document",
  description: null,
  footer: null,
};

const UploadDocumentForm = ({
  id = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const Departments = useSelector((state) => state.common.departments);
  const Employees = useSelector((state) => state.emp.employees);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [formData, setFormData] = useState({
    ...Document,
    ...DocumentAssignment,
  });
  const [formValues, setFormValues] = useState({
    ...Document,
    ...DocumentAssignment,
  });
  const fetchData = async (isMounted) => {
    try {
      const response = await getHRDocumentData(id);
      if (isMounted && response) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  // const fetchFolder = async (isMounted, value) => {
  //   try {
  //     const response = await getHRDocumentData(id);
  //     if (isMounted && response) {
  //       setFormData(response);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (data) => {
    try {
      const response = await addUpdateHRDocumentDetails(data, id);
      // return
      if (response) {
        if (id) {
          toast.success("Document Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Document Submitted Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setIsOpen(false);
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };
  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validationHRDocumentFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 2,
        renderUpdatedFormValues: setFormValues,
        formFiels: [
          {
            sheetCardExtension: false,
            // sheetCardTitle: "Employee Details",
            InputFiels: [
              {
                InputField: RadioGroupInput,
                name: "acknowledgment_type",
                required: true,
                disabled: false,
                label: "Acknowledgment Type",
                options: [
                  { value: "MANDATORY", label: "MANDATORY" },
                  { value: "OPTIONAL", label: "OPTIONAL" },
                ],
                colsSpan: 2,
              },
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Document Name",
              },
              {
                InputField: SelectInputComponent,
                name: "category",
                required: true,
                label: "Category",
                options: Document_Category,
                onChange: (_, value) => {
                  // if(value){
                  //   fetchFolder(true,value);
                  // }
                },
              },
              {
                InputField: SelectInputComponent,
                name: "target_audience",
                required: true,
                label: "Target Audience",
                options: HRDocumentTargetAudience,
              },
              ...(formValues.target_audience === "Department"
                ? [
                    {
                      InputField: SelectInputComponent,
                      name: "object_id",
                      required: true,
                      label: "Department",
                      options: Departments,
                    },
                  ]
                : []),
              ...(formValues.target_audience === "Specific Employee"
                ? [
                    {
                      InputField: SelectInputComponent,
                      name: "object_id",
                      required: true,
                      label: "Employee",
                      options: Employees,
                    },
                  ]
                : []),
              {
                InputField: DateInput,
                name: "expiration_date",
                label: "Expiration Date",
                minDate:moment(),
              },
              {
                InputField: DateInput,
                name: "due_date",
                label: "Due Date",
              },
              {
                InputField: TextAreaInput,
                name: "description",
                required: true,
                label: "Note",
                colsSpan: 2,
                maxRows: 5,
                maxLength: 1000,
              },
              {
                InputField: CoverFileUpload,
                name: "file",
                required: true,
                label: "Document",
                colsSpan: 2,
                variant: "AttachmentFileUpload",
                allowUpdate: true,
                multiple: false,
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

const Form = ({ id = null, setIsOpen = () => {}, handleClose = () => {} }) => {
  const formRef = React.createRef();
  const Departments = useSelector((state) => state.common.departments);
  const AllEmployees = useSelector((state) => state.emp.employees);
  const Employees = React.useMemo(() => {
    return AllEmployees?.filter(
      (employee) => employee.employee_status === "Active"
    );
  }, [AllEmployees]);
  const [formData, setFormData] = useState(Document);
  const fetchData = async (isMounted) => {
    try {
      const response = await getHRDocumentData(id);
      if (isMounted && response) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      const response = await addUpdateHRDocumentDetails(data, id);
      // return
      if (response) {
        if (id) {
          toast.success("Document Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Document Submitted Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setIsOpen(false);
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={formData}
      innerRef={formRef}
      enableReinitialize={true}
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values, resetForm);
      }}
      validate={(values) => {
        const errors = validationHRDocumentFormSchema(values);
        console.error(errors, values, "Errors");
        return errors;
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-2">
            <div className="space-y-4 col-span-2">
              <RadioGroupInput
                name={"transfer_type"}
                // label={"Tranfer Type"}
                error={props.errors?.transfer_type}
                touch={props.touched?.transfer_type}
                value={props.values?.transfer_type}
                options={[
                  { value: "Mandatory", label: "Mandatory" },
                  { value: "Optional", label: "Optional" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
            </div>
            <div className="space-y-4">
              <TextInput
                name={"reason_of_transfer"}
                error={props.errors?.reason_of_transfer}
                touch={props.touched?.reason_of_transfer}
                value={props.values?.reason_of_transfer}
                required={true}
                label={"Document Name"}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
            </div>
            <div className="space-y-4">
              <SelectInputComponent
                name={"employee_id"}
                options={HRDocumentCategory}
                error={props.errors?.employee_id}
                touch={props.touched?.employee_id}
                value={props.values?.employee_id}
                required={true}
                label={"Category"}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
            </div>
            <div className="space-y-4">
              <SelectInputComponent
                name={"reporting_manager"}
                options={HRDocumentTargetAudience}
                error={props.errors?.reporting_manager}
                touch={props.touched?.reporting_manager}
                value={props.values?.reporting_manager}
                required={true}
                label={"Target Audience"}
                placeholder={"Target Audience"}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
            </div>

            {props.values?.reporting_manager === "Department" && (
              <div className="space-y-4">
                <SelectInputComponent
                  name={"reporting_manager"}
                  options={Departments}
                  error={props.errors?.reporting_manager}
                  touch={props.touched?.reporting_manager}
                  value={props.values?.new_location}
                  required={true}
                  label={"Department"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
            )}

            {props.values?.reporting_manager === "Specific Employee" && (
              <div className="space-y-4">
                <SelectInputComponent
                  name={"reporting_manager"}
                  options={Employees}
                  error={props.errors?.reporting_manager}
                  touch={props.touched?.reporting_manager}
                  value={props.values?.new_location}
                  required={true}
                  label={"Employee"}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
              </div>
            )}

            <div className="space-y-4">
              <DateInput
                name={"effective_transfer_date"}
                error={props.errors?.effective_transfer_date}
                touch={props.touched?.effective_transfer_date}
                value={props.values?.effective_transfer_date}
                required={true}
                label={"Expiration Date"}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                size="lg"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" variant="default">
                {id ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default UploadDocumentForm;
