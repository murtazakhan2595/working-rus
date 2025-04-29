import { getDepartmentList } from "app/hooks/general";
import { saveDepartment } from "app/hooks/general";
import { getOrganizationList } from "app/hooks/general";
import { DepartmentsInformation } from "app/utils/Types/Departments";
import { SelectInputComponent } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddDepartmentForm = ({ isOpen, setIsOpen, edit, setEdit, reload }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [formData, setFormData] = useState(
    edit?.data || DepartmentsInformation
  );
  const [organization, setOrganization] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getOrganizationList();
        setOrganization(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await saveDepartment(values?.id, values);
      if (response) {
        toast.success(
          `Department ${edit?.data ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);
        // setEdit({
        //   open: false,
        //   data: null,
        // });
        reload();
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik initialValues={formData} onSubmit={handleSubmit}>
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Department Details">
              <SelectInputComponent
                name={"organization"}
                options={organization}
                error={props.errors.organization}
                touch={props.touched.organization}
                value={props.values.organization}
                label={"Organization"}
                required
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
              <TextInput
                name="name"
                label="Department Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <TextAreaInput
                name="description"
                label="Description"
                required
                error={props.errors.description}
                touch={props.touched.description}
                value={props.values.description}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <TextInput
                name="parent_department"
                label="Parent Department"
                error={props.errors.parent_department}
                touch={props.touched.parent_department}
                value={props.values.parent_department}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
            </SheetCardExtension>
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
                  {edit ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddDepartmentForm;
