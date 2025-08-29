
import { EvaluationForm } from "app/utils/Types/PerformanceEdge";

export function mapEvaluationPayloadData(data) {
    debugger
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in EvaluationForm) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            payload[key] = data[key];
        }
    }
    return payload;
}