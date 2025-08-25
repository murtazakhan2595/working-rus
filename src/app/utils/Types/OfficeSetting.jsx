// export const Branch = {
//   branch_name: null,
//   branch_number: null,
//   branch_address: null,
//   branch_status: "Active",
//   serial_number:null,
// };

export const Branch = {
  branch_name: "",
  branch_number: "",
  branch_status: "Active",
  branch_address: "",
  // Add these new fields
  branch_location: "",
  branch_coordinates: {
    lat: 0,
    lng: 0,
  },
};

export const GraceTime = {
  id: null,
  name: null,
  grace_time_minutes: null,
  created_at: null,
  branches: null,
};


export const ClearanceChecklist = {
  id: "",
  name: "",
  department: "",
  clearance_types: [],
  assignment_scope: "",
  e_signature_required: false,
  status: "active",
  created_by: "",
  created_date: "",
};

export const EvaluationType = {
  name: null,
  description: null,
  id: null,
  created_at: null,
}