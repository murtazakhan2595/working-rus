
import {
    EvaluationForm,
    PerformanceCycle,
    EvaluationSubmission,
    MyGoals,
    EmployeeFeedback,
    EvaluationSection,
    EvaluationSectionField
} from "app/utils/Types/PerformanceEdge";

export function mapEvaluationPayloadData(data) {
    const payload = {};

    // Loop over expected keys defined in EvaluationForm
    for (const key in EvaluationForm) {
        if (!Object.prototype.hasOwnProperty.call(data, key) || !data[key]) continue;

        switch (key) {
            // Trim string for form_name
            case "form_name":
                payload[key] = data[key].trim();
                break;

            // Arrays: filter out falsy values (null, undefined, "")
            case "nationalities":
            case "branches":
            case "departments":
            case "designation":
                if (Array.isArray(data[key])) {
                    payload[key] = data[key].filter(Boolean);
                }
                break;

            // Handle sections → each section can contain fields
            case "sections":
                if (Array.isArray(data.sections)) {
                    payload.sections = data.sections.map((section) => {
                        const formattedSection = {};

                        // Map allowed section keys
                        for (const sectionKey in EvaluationSection) {
                            if (!Object.prototype.hasOwnProperty.call(section, sectionKey)) continue;

                            if (sectionKey === "fields" && Array.isArray(section.fields)) {
                                // Process fields inside the section
                                formattedSection.fields = section.fields.map((field) => {
                                    const formattedField = {};

                                    for (const fieldKey in EvaluationSectionField) {
                                        if (Object.prototype.hasOwnProperty.call(field, fieldKey)) {
                                            if (field[fieldKey] !== null && field[fieldKey] !== undefined)
                                                formattedField[fieldKey] = field[fieldKey];
                                        }
                                    }

                                    return formattedField;
                                });
                            } else {
                                // Copy other section-level keys
                                if (section[sectionKey] !== null && section[sectionKey] !== undefined)
                                    formattedSection[sectionKey] = section[sectionKey];
                            }
                        }

                        return formattedSection;
                    });
                }
                break;

            // Default: copy as is
            default:
                payload[key] = data[key];
        }
    }

    return payload;
}



export async function mapEvaluatoionData(data, fetchApprovalDetails = true) {
    const RecordDetails = {};
    for (const key of Object.keys(EvaluationForm)) {
        if (Object.prototype.hasOwnProperty.call(data, key))
            RecordDetails[key] = data[key];
    }

    return RecordDetails;
}

export async function mapPerformanceCycleData(data, fetchApprovalDetails = true) {
    const RecordDetails = {};
    for (const key of Object.keys(PerformanceCycle)) {
        if (key === 'review_period') {
            RecordDetails[key] = `${data['review_start'] || undefined},${data['review_end'] || undefined}`;
        }
        if (Object.prototype.hasOwnProperty.call(data, key))
            RecordDetails[key] = data[key];
    }

    return RecordDetails;
}


export function mapPerformanceCyclePayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in PerformanceCycle) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            if (key === 'name') payload[key] = data[key].trim();
            if (key === 'review_period') {
                const [review_start, review_end] = data[key].split(',') || [];
                payload[`review_start`] = review_start || null;
                payload[`review_end`] = review_end || null;
            }
            else payload[key] = data[key];
        }
    }
    return payload;
}
export function mapEvaluationSubmissionPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in EvaluationSubmission) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            payload[key] = data[key];
        }
    }
    return payload;
}

export async function mapAssesmentForm(data, fetchApprovalDetails = true) {
    const RecordDetails = { ...data, sections: [] };
    const forms = data.forms
    for (const form of forms) {
        RecordDetails.sections = [...RecordDetails.sections, ...form.sections];
    }
    return RecordDetails;
}

export async function mapEvaltaionResults(submissions, submissionanswers) {
    // debugger
    const RecordList = [];
    for (const submission of submissions) {
        const RecordDetails = { ...submission };
        const answers = submissionanswers.filter(obj => obj.submission === submission.id);
        RecordDetails.evaluationsAnswer = answers;
        RecordList.push(RecordDetails);
    }
    return RecordList;

}

export function mapEmployeeGoalsPayload(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in MyGoals) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            if (key === 'title' || key === 'description') payload[key] = data[key].trim();
            // else if (["nationalities", "branches", "departments", "designation"].includes(key)) {
            //     if (Array.isArray(data[key]))
            //         payload[key] = data[key].filter(Boolean);
            // }
            else payload[key] = data[key];
        }
    }
    return payload;
}


export async function mapEmployeeGoalsData(data, fetchApprovalDetails = true) {
    const RecordDetails = {};
    for (const key of Object.keys(MyGoals)) {
        if (Object.prototype.hasOwnProperty.call(data, key))
            RecordDetails[key] = data[key];
    }

    return RecordDetails;
}

export function mapEmployeeFeedbackPayload(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in EmployeeFeedback) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            if (key === 'comments') payload[key] = data[key].trim();
            else payload[key] = data[key];
        }
    }
    return payload;
}