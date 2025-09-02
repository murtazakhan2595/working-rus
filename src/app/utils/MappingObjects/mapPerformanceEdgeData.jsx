
import { EvaluationForm, PerformanceCycle } from "app/utils/Types/PerformanceEdge";

export function mapEvaluationPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in EvaluationForm) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            if (key === 'form_name') payload[key] = data[key].trim();
            else payload[key] = data[key];
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
    for (const key of Object.keys(EvaluationForm)) {
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