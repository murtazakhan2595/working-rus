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
export const validateRequisitionRequestFormSchema = (values, ) => {
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
