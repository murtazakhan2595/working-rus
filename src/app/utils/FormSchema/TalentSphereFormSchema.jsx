export const validateManpowerPlanningFormSchema = (values, DataList = [],) => {
    const errors = {};

    // Basic required field validations
    if (values.planned_headcount && parseFloat(values.planned_headcount) <= 0) errors.planned_headcount = "Planned headcount cannot be negative or zero";
    if (values.total_allocated_budget && parseFloat(values.total_allocated_budget) <= 0) errors.planned_headcount = "Allocated Budget cannot be negative or zero";

    return errors;
};
export const validateHeadCoutnRequestFormSchema = (values, DataList = [],) => {
    const errors = {};

    // Basic required field validations
   if (values.requested_headcount && parseFloat(values.requested_headcount) <= 0) errors.requested_headcount = "Requested headcount cannot be negative or zero";

    return errors;
};
