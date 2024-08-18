export function StatusCurrentStep(status) {
  switch (status.toLowerCase()) {
    case "pending":
      return 0;
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
    default:
      return -1; // In case the status doesn't match any known step
  }
}
export const Status = (status, step) => {
  if (!status) return "";
  const normalizedStatus = status.toLowerCase();
  const currentStep = StatusCurrentStep(status);
  if (currentStep === 0) {
    return "Pending";
  } else if (currentStep >= 1 && step === 1) {
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
