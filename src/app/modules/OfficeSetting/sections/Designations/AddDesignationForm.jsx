import { getDepartmentList } from "app/hooks/general";
import { saveDesignation } from "app/hooks/general";
import { getOrganizationList } from "app/hooks/general";
import { DesignationInfo } from "app/utils/Types/Designation";
import { SelectComponent } from "components/form-control";
import { TextAreaInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddDesignationForm = ({ isOpen, setIsOpen, edit, setEdit, reload }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [formData, setFormData] = useState(edit?.data || DesignationInfo);
  const [organization, setOrganization] = useState([]);

  console.log("reload designation in add design form", reload);

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
    console.log(values, "VALUES");
    try {
      const response = await saveDesignation(values?.id, values);
      if (response) {
        toast.success(
          `Designation ${edit?.data ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        reload()
        setIsOpen(false);
      }
    } catch (error) {
      console.log("ERROR", error);
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
            <SheetCardExtension title="Designation Details">
              <SelectComponent
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
                label="Designation"
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
                <Button type="submit" size="lg" variant="default">
                  {edit?.data ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddDesignationForm;
