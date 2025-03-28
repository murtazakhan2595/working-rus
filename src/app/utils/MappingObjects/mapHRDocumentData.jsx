import {
  DocumentCategory,
  Document,
  DocumentAssignment,
} from "app/utils/Types/HRDocuments";

export function mapDocumentAssignedData(data) {
  const employeeTransferDetails = Object.keys(DocumentAssignment).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return employeeTransferDetails;
}

export function mapDocumentCategoryData(data) {
  const employeeTransferDetails = Object.keys(DocumentCategory).reduce(
    (acc, key) => {
      if (data.hasOwnProperty(key)) {
        acc[key] = data[key];
      }
      return acc;
    },
    {}
  );

  return employeeTransferDetails;
}

export function mapDocumentCategoryPayloadData(data) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in DocumentCategory) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapDocumentPayloadData(data) {
  // Initialize an empty payload object
  const payload = new FormData();
  // Iterate over the keys in the Task object
  for (const key in Document) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      payload.append(key, data[key]);
    }
  }

  // Return the constructed payload
  return payload;
}
export function mapDocumentAssignmentPayloadData(data) {
  // Initialize an empty payload object
  const payload = new FormData();
  // Iterate over the keys in the Task object
  for (const key in DocumentAssignment) {
    // Check if the key exists in the data object
    if (data.hasOwnProperty(key) && data[key]) {
      // Add the key and its value to the payload
      if (key === "signature_file") {
        if (data[key] instanceof File) payload.append(key, data[key]);
      } else payload.append(key, data[key]);
    }
  }

  // Return the constructed payload
  return payload;
}
