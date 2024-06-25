import { visaOptions } from "../data/Data";

export const getVisaLabel = (value) => {
  const option = visaOptions.find((option) => option.value === value);
  return option ? option.label : null; // Return the label or null if not found
};
