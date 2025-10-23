import { validateStartAndEndDateField } from "app/utils/FormSchema/generalFormSchema";

export const validateManpowerPlanningFormSchema = (values) => {
    const errors = {};
    // Basic required field validations
    if (values.planned_headcount) {
        const planned_headcount = parseFloat(values.planned_headcount)
        if (planned_headcount <= 0) errors.planned_headcount = "Planned headcount cannot be negative or zero";
        if (planned_headcount < parseFloat(values.existing_headcount || 0))
            errors.planned_headcount = "Planned headcount cannot be less than existing headcount";
    }
    if (values.total_allocated_budget && parseFloat(values.total_allocated_budget) <= 0) errors.total_allocated_budget = "Allocated Budget cannot be negative or zero";

    return errors;
};
export const validateHeadCoutnRequestFormSchema = (values, DataList = [],) => {
    const errors = {};
    // Basic required field validations
    if (values.requested_headcount && parseFloat(values.requested_headcount) <= 0) errors.requested_headcount = "Requested headcount cannot be negative or zero";

    return errors;
};
export const validatePublishVacancyFormSchema = (values,) => {
    const errors = {};
    const { post_on_cohrus, post_on_linkedin, post_on_indeed, post_on_other, publish_date, due_date } = values;
    // Basic required field validations
    if (publish_date && due_date) {
        const { start_date, end_date } = validateStartAndEndDateField(publish_date, due_date);
        if (start_date)
            errors.publish_date = 'Publish date cannot be after due date.';
        if (end_date)
            errors.due_date = 'Due date cannot be before after date';
    }
    if (!post_on_cohrus && !post_on_linkedin && !post_on_indeed && !post_on_other)
        errors.post_on_other = 'At least 1 platform must be selected.'

    return errors;
};
export const validateRequisitionRequestFormSchema = (values,) => {
    const errors = {};

    // Basic required field validations
    if (values.min_age && parseFloat(values.max_age))
        if (parseFloat(values.min_age) > parseFloat(values.max_age))
            errors.max_age = "Maximum age cannot be greater than minimum age";
    if (values.experience_min && parseFloat(values.experience_max))
        if (parseFloat(values.experience_min) > parseFloat(values.experience_max))
            errors.experience_max = "Maximum experiance cannot be greater than minimum experiance";
    if (values.salary_min && parseFloat(values.salary_max))
        if (parseFloat(values.salary_min) > parseFloat(values.salary_max))
            errors.salary_max = "Maximum salary cannot be greater than minimum salary";

    return errors;
};

/**
 * ✅ Formik-compatible feedback form validation schema.
 *
 * Rules:
 * 1. Must have at least one valid section.
 * 2. Section title is required.
 * 3. Each section must contain at least one field.
 * 4. Each field must have a non-empty label.
 * 5. RADIO fields → radio_options cannot be empty.
 * 6. RATING fields → rating_scale_max must be > 0.
 *
 * @param {Object} formValues - The form values from Formik.
 * @returns {Object} Formik-style errors object.
 */
export const validateFeedbackFormSchema = (formValues) => {
    const errors = {};
    if (!formValues.name || !formValues?.name?.trim()) {
        errors.name = "Name is required.";
    }
    // 🧩 Step 1: Validate sections
    if (!formValues?.sections || !Array.isArray(formValues.sections) || formValues.sections.length === 0) {
        errors.sections = "Form must have at least one valid section.";
        return errors;
    }

    const sectionErrors = [];

    formValues.sections.forEach((section, secIndex) => {
        const sectionError = {};
        const title = section?.title?.trim();

        // 🟡 Title validation
        if (!title || !title?.trim()) {
            sectionError.title = "Section title is required.";
        }

        // 🟡 Fields validation
        if (!Array.isArray(section.fields) || section.fields.length === 0) {
            sectionError.fields = "Section must contain at least one field.";
        } else {
            const fieldErrors = [];

            section.fields.forEach((field, fieldIndex) => {
                const fieldError = {};
                const label = field?.label?.trim();
                const type = field?.field_type;

                // Label check
                if (!label) {
                    fieldError.label = "Field label is required.";
                }

                // RADIO check
                if (type === "RADIO") {
                    const radioOptions =
                        typeof field.radio_options === "string"
                            ? field.radio_options
                                .split(",")
                                .map((opt) => opt.trim())
                                .filter(Boolean)
                            : null;
                    debugger
                    if (!radioOptions || !Array.isArray(radioOptions) || radioOptions?.length === 0) {
                        fieldError.radio_options = "Radio options cannot be empty for RADIO type.";
                    }
                }

                // RATING check
                if (type === "RATING") {
                    const rating = Number(field.rating_scale_max);
                    if (isNaN(rating) || rating <= 0) {
                        fieldError.rating_scale_max = "Rating scale must be greater than zero.";
                    }
                }

                if (Object.keys(fieldError).length > 0) {
                    fieldErrors[fieldIndex] = fieldError;
                }
            });

            if (fieldErrors.length > 0) {
                sectionError.fields = fieldErrors;
            }
        }

        if (Object.keys(sectionError).length > 0) {
            sectionErrors[secIndex] = sectionError;
        }
    });

    if (sectionErrors.length > 0) {
        errors.sections = sectionErrors;
    }

    return errors;
};


