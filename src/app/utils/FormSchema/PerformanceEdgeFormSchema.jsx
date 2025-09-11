import { calculateTotal } from "utils/renderValues";

export const validatePerformanceFormSchema = (values) => {
    const errors = {};

    if (!values.sections || values.sections.length === 0) {
        errors.sections = "At least one weightage section is required";
        return errors;
    } else {
        const sectionWeightage = calculateTotal(values.sections, "weightage");
        if (parseFloat(sectionWeightage) !== parseFloat(100)) {
            errors.section_weightage = "Section weightage should equal to 100";
        }
    }

    errors.sections = [];

    values.sections.forEach((section, index) => {
        const sectionErrors = {};

        if (!section.fields || section.fields.length === 0) {
            sectionErrors.fields = "At least one section field is required";
        } else {
            const fieldWeightage = calculateTotal(section.fields, "weightage");
            if (parseFloat(fieldWeightage) !== parseFloat(section.weightage)) {
                sectionErrors.field_weightage = "Field weightage should equal section weightage";
            }
        }

        if (Object.keys(sectionErrors).length > 0) {
            errors.sections[index] = sectionErrors;
        }
    });

    return errors;
};


export const validateAssessmentFormSchema = (values) => {
    const errors = {};

    if (!values.sections || values.sections.length === 0) {
        errors.sections = "At least one section is required";
        return errors;
    }
    errors.sections = [];

    values.sections.forEach((section, index) => {
        const sectionErrors = {};

        if (!section.fields || section.fields.length === 0) {
            sectionErrors.fields = "At least one section field is required";
        }

        if (Object.keys(sectionErrors).length > 0) {
            errors.sections[index] = sectionErrors;
        }
    });
    if (Array.isArray(errors.sections) && errors.sections.length === 0)
        delete errors.sections;

    return errors;
};
