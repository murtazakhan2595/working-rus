import {
  DocumentCategory,
  Document,
  DocumentAssignment,
} from "app/utils/Types/HRDocuments";
import { LetterRequest } from "../Types/HRDocuments";

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
export function mapDocumentData(data) {
  const employeeTransferDetails = Object.keys(Document).reduce(
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
export function mapLetterRequestPayloadData(data) {
  console.log("mapLetterRequestPayloadData input:", data);

  // Check if we have file uploads
  const hasFiles =
    data.attachments &&
    (data.attachments instanceof File ||
      (Array.isArray(data.attachments) &&
        data.attachments.some((item) => item instanceof File)));

  if (hasFiles) {
    // Create FormData for file uploads
    const formData = new FormData();

    // Iterate over the keys in the LetterRequest object
    for (const key in LetterRequest) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];

        // Skip null or undefined values
        if (value !== null && value !== undefined) {
          // Handle files
          if (value instanceof File) {
            formData.append(key, value);
            console.log(`Added file to FormData: ${key}`, value.name);
          }
          // Handle file arrays
          else if (Array.isArray(value) && value.length > 0) {
            value.forEach((item, index) => {
              if (item instanceof File) {
                formData.append(`${key}[${index}]`, item);
                console.log(
                  `Added file array item: ${key}[${index}]`,
                  item.name
                );
              } else {
                formData.append(`${key}[${index}]`, item);
              }
            });
          }
          // Handle boolean values (including false)
          else if (typeof value === "boolean") {
            formData.append(key, value);
          }
          // Handle other values
          else if (value !== "") {
            formData.append(key, value);
          }
        }
      }
    }

    console.log("Created FormData with files");
    // Debug FormData contents
    for (let pair of formData.entries()) {
      console.log(`FormData: ${pair[0]}`, pair[1]);
    }

    return formData;
  } else {
    // Create regular object for non-file requests
    const payload = {};

    for (const key in LetterRequest) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];

        // Include the value if it's not null/undefined
        if (value !== null && value !== undefined) {
          // Handle boolean values (including false)
          if (typeof value === "boolean") {
            payload[key] = value;
          }
          // Handle non-empty strings and numbers
          else if (value !== "") {
            payload[key] = value;
          }
        }
      }
    }

    console.log("Created JSON payload:", payload);
    return payload;
  }
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
