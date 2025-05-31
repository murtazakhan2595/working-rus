import { Branch, GraceTime } from "app/utils/Types/OfficeSetting";

export async function mapBranchList(data) {
  const branchList = await data?.map((branch) => {
    const branchDetails = Object.keys(Branch).reduce((acc, key) => {
      if (branch.hasOwnProperty(key)) {
        acc[key] = branch[key];
      }
      return acc;
    }, {});
    return {
      value: branch.id,
      id: branch.id,
      label: branch.branch_name,
      ...branchDetails,
    };
  });

  return branchList;
}

export function mapBranchData(data) {
  const branchDetails = Object.keys(Branch).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return branchDetails;
}

export function mapBranchPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in Branch) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

//-------------GRACE TIME ---------------

export function mapGraceTimeData(data) {
  const graceTimeDetails = Object.keys(GraceTime).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return graceTimeDetails;
}
export async function mapGraceTimeList(data) {
  const graceTimeList = await data?.map((graceTime) => {
    const graceTimeDetails = mapGraceTimeData(graceTime);
    return {
      value: graceTimeDetails.id,
      label: graceTimeDetails.branch_name,
      ...graceTimeDetails,
    };
  });

  return graceTimeList;
}
