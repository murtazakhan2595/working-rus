import { saveUpdateRatingScaleSetup, saveUpdateRatingScaleValue } from "app/hooks/officeSetting";
import { RatingScaleSetup, RatingScaleValue } from "app/utils/Types/OfficeSetting";
import { SheetUI } from "components";
import { getRatingScaleSetupList, getRatingScaleSetupData } from "app/hooks/officeSetting";
import { validateRatingScaleFormSchema } from "app/utils/FormSchema/officeSettingFormSchema";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  TextAreaInput,
  NumberInput,
  CheckBoxInput,
  SelectInputComponent,
  errorClassName,
  TextInput
} from "components/FormControl";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { CircleX } from "lucide-react";

const AddRatingScaleSetupForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(RatingScaleSetup);
  const [FormValues, setFormValues] = useState(RatingScaleSetup);
  const [RatingScaleSetupList, setRatingScaleSetupList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Rating Scale`,
    title: `${isEditMode ? "Edit" : "Add"} Rating Scale`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchRatingScaleSetupData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getRatingScaleSetupList();

        if (isMounted) {
          setRatingScaleSetupList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchRatingScaleSetupData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getRatingScaleSetupData(id);
        if (isMounted) {
          setFormData(response);
          setFormValues(response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await saveUpdateRatingScaleSetup(values, id);
      if (response) {
        if (response.id) {
          debugger
          const RatingValues = values.rating_values;
          for (const rating_value of RatingValues) {
            await saveUpdateRatingScaleValue({ ...rating_value, rating_scale: response.id }, rating_value.id)
          }
        }
        toast.success(
          `Rating Scale ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose(); // Pass true to indicate successful update
      }
    } catch (error) {
      console.error("ERROR", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };


  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validateRatingScaleFormSchema,
        renderUpdatedFormValues: setFormValues,
        DataList: RatingScaleSetupList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Evaluation Type Details`,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Name",
                validateDuplicate: true,
              },
              {
                InputField: SelectInputComponent,
                name: "scale_type",
                required: true,
                label: "Scale Type",
                options: [{ value: "numeric", label: 'Numeric' }, { value: "alphabetic", label: "Alphabetic" }, { value: "descriptive", label: "Descriptive" }],
              },
              {
                InputField: CheckBoxInput,
                name: "is_default",
                label: "Mark this rating scale setup as default.",
                colsSpan: 2,
              },
            ],
          },
          ...(FormValues?.rating_values
            ? FormValues.rating_values.map((rating_value, index) => ({
              sheetCardExtension: true,
              sheetCardTitle: `Rating Value ${index + 1}`,
              InputFields: [
                {
                  InputField: RemoveRatingValue,
                  name: "rating_values",
                  value: rating_value,
                  colsSpan: 2
                },
                {
                  InputField: TextAreaInput,
                  name: `rating_values[${index}].description`,
                  label: "Description/Label",
                  value: rating_value.description,
                  required: true,
                  colsSpan: 2
                },
                {
                  InputField: CheckBoxInput,
                  name: `rating_values[${index}].has_score`,
                  label: "Associate with Score/Percentage",
                  value: rating_value.has_score,
                  required: true,
                  colsSpan: 2
                },
                {
                  InputField: NumberInput,
                  name: `rating_values[${index}].max_score`,
                  label: "Max Score",
                  value: rating_value.max_score,
                  required: true,
                },
                {
                  InputField: NumberInput,
                  name: `rating_values[${index}].min_score`,
                  label: "Min Score",
                  value: rating_value.min_score,
                  required: true,
                },

              ],
            }))
            : []),
          {
            sheetCardExtension: false,
            sheetCardTitle: `Form Sections`,
            InputFields: [
              {
                InputField: AddNewRatingValue,
                name: "rating_values",
                colsSpan: 3,
              },
            ],
          },
        ],
      }}
    />
  );
};
const AddNewRatingValue = React.memo(
  ({ name, onChange = () => { }, value = [], error }) => {
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const updatedSections = [...(value || []), RatingScaleValue];
      onChange(name, updatedSections);
    };
    return (
      <div>
        <Button variant="outline" onClick={handleClick}>
          Add Rating Value
        </Button>
        <div className={errorClassName}>{error}</div>
      </div>
    );
  }
);

const RemoveRatingValue = React.memo(
  ({ name, onChange = () => { }, value = [], section, index }) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const handleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenDeleteConfirm(true);
    };
    const confirmDelete = async () => {
      try {
        if (!section) return;
        const remaining_levels = value.filter(
          (levels) => levels.level_number !== section.level_number
        );
        onChange(name, remaining_levels || []);
      } catch (error) {
        console.error("ERROR", error);
      } finally {
        setOpenDeleteConfirm(false);
      }
    };
    return (
      <div className="relative">
        <Button
          variant="icon"
          onClick={handleClick}
          className="absolute top-[-20px] right-[-10px]"
        >
          <CircleX size={22} className="text-red-700" />
        </Button>
        {openDeleteConfirm && (
          <AlertDialogue
            title="Confirm Delete?"
            description={`This action can't be undone. All information associated with this level will be lost.`}
            isOpen={openDeleteConfirm}
            setIsOpen={() => setOpenDeleteConfirm(false)}
            handleContinue={confirmDelete}
          />
        )}
      </div>
    );
  }
);

export default AddRatingScaleSetupForm;
