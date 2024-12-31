import { ResignationStatusOptions, TerminationStatusOptions } from "data/Data";
const StatusList = (isResignation = true) => {
  if (isResignation) {
    // Iterate over ResignationStatusOptions and collect the values in the status_list array
    const status_list = ResignationStatusOptions.map(
      (status) => status.value
    ).filter((value) => value !== "exit interview").join(",");
    
    return status_list;
  } else {
    // Iterate over TerminationStatusOptions and collect the values in the status_list array
    const status_list = TerminationStatusOptions.map(
      (status) => status.value
    ).filter((value) => value !== "exit interview").join(",");
    return status_list;
  }
};

const ExitStatusCurrentStep = (status) => {
  switch (status.toLowerCase()) {
    case "accepted by manager":
      return 1;
    case "rejected by manager":
      return 1;
    case "accepted by hr":
      return 2;
    case "rejected by hr":
      return 2;
    case "initiated clearance":
      return 3;
    case "exit interview":
      return 4;
    case "accepted by employee":
      return 0;
    case "rejected by employee":
      return 0;
    default:
      return -1; // In case the status doesn't match any known step
  }
};
const Status = (status, step) => {
  if (!status) return "";
  const normalizedStatus = status.toLowerCase();
  const currentStep = ExitStatusCurrentStep(status);
  if (currentStep === -1) {
    return "Pending";
  } else if (currentStep >= 1 && step === 1) {
    if (normalizedStatus.includes("rejected")) return "Rejected";
    else return "Approved";
  } else if (currentStep >= 0 && step === 0) {
    if (normalizedStatus.includes("rejected")) return "Rejected";
    else return "Approved";
  } else if (currentStep >= 2 && step === 2) {
    if (normalizedStatus.includes("rejected")) return "Rejected";
    else return "Approved";
  } else if (currentStep >= 3 && step === 3) {
    return "Approved";
  } else if (currentStep >= 4 && step === 4) {
    return "Approved";
  } else return "Pending";
};

export { Status, ExitStatusCurrentStep, StatusList };
