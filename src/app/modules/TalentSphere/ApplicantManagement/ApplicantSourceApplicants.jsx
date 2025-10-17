import React from "react";
import AllApplicants from "./AllApplicants";

// Dedicated view for applicants filtered by application source only.
// Uses a custom variant so no implicit status (e.g., "new") is applied.
export default function ApplicantSourceApplicants() {
  return <AllApplicants variant="by_source" />;
}


