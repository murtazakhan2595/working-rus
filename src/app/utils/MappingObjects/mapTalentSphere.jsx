import { ManpowerPlanning } from 'app/utils/Types/TalentSphere';

export function mapManpowerPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in ManpowerPlanning) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key]) {
            // Add the key and its value to the payload
            if (key === 'justification') payload[key] = data[key].trim();
            else payload[key] = data[key];
        }
    }
    return payload;
}

export async function mapManpowerData(data) {
    const RecordDetails = {};
    for (const key of Object.keys(ManpowerPlanning)) {
        if (key === 'consumed_budget_status') {
            const consumed_budget = parseFloat(data['consumed_percentage']);
            if (consumed_budget <= 50)
                RecordDetails[key] = "Within Budget";
            else if (consumed_budget > 50 && consumed_budget <= 70)
                RecordDetails[key] = "Approaching Limit";
            else if (consumed_budget > 70 && consumed_budget <= 90)
                RecordDetails[key] = "Near Threshold";
            else if (consumed_budget > 90)
                RecordDetails[key] = "Over Budget";
        } else if (Object.prototype.hasOwnProperty.call(data, key)) {
            RecordDetails[key] = data[key];
        }
    }

    return RecordDetails;
}