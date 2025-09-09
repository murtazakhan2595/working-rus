import { Branch, GraceTime, EvaluationType, RatingScaleSetup } from "app/utils/Types/OfficeSetting";

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
      if (key === "grace_time_minutes") acc[key] = parseInt(data[key] || "0");
      else acc[key] = data[key];
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

export function mapGraceTimePayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in GraceTime) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      if (key === "name") payload[key] = data[key].trim();
      if (key === "grace_time_minutes")
        payload[key] = parseInt(data[key] || "0");
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}


//-------------Evaluation Type ---------------

export function mapEvaluationTypeData(data) {
  const graceTimeDetails = Object.keys(EvaluationType).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "name" || key === 'description') acc[key] = data[key].trim()
      else acc[key] = data[key];
    }
    return acc;
  }, {});

  return graceTimeDetails;
}
export async function mapEvaluationTypeList(data) {
  const DataList = await data?.map((graceTime) => {
    const Details = mapEvaluationTypeData(graceTime);
    return {
      value: Details.id,
      label: Details.name,
      ...Details,
    };
  });

  return DataList;
}

export function mapEvaluationTypePayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in EvaluationType) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      if (key === "name" || key === 'description') payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

//-------------Rating Scale Setup ---------------

export function mapRatingScaleSetupData(data) {
  const Details = Object.keys(RatingScaleSetup).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "name") acc[key] = data[key].trim()
      else acc[key] = data[key];
    }
    return acc;
  }, {});

  return Details;
}
export async function mapRatingScaleSetupList(data) {
  const DataList = await data?.map((obj) => {
    const Details = mapRatingScaleSetupData(obj);
    return {
      value: Details.id,
      label: Details.name,
      ...Details,
    };
  });

  return DataList;
}

export function mapRatingScaleSetupPayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in RatingScaleSetup) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      if (key === "name") payload[key] = data[key].trim();
      else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

