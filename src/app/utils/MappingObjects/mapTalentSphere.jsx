import {
    ManpowerPlanning,
    Benefit,
    RemoteWorkChecklist,
    JobType,
    Education,
    CareerLevel,
} from 'app/utils/Types/TalentSphere';

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


//-------------Benefits ---------------

export function mapBenefitData(data) {
    const graceTimeDetails = Object.keys(Benefit).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return graceTimeDetails;
}
export async function mapBenefitList(data) {
    const DataList = await data?.map((graceTime) => {
        const Details = mapBenefitData(graceTime);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapBenefitPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Benefit object
    for (const key in Benefit) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

//-------------RemoteWorkChecklists ---------------

export function mapRemoteWorkChecklistData(data) {
    const graceTimeDetails = Object.keys(RemoteWorkChecklist).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "item_name") acc[key] = data[key].trim()
            else if (key === "status") acc[key] = data[key] ? 'available' : 'unavailable';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return graceTimeDetails;
}
export async function mapRemoteWorkChecklistList(data) {
    const DataList = await data?.map((graceTime) => {
        const Details = mapRemoteWorkChecklistData(graceTime);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapRemoteWorkChecklistPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in RemoteWorkChecklist) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "item_name") payload[key] = data[key].trim();
            if (key === "status") payload[key] = Boolean(data[key] === 'available');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}



//-------------JobTypes ---------------

export function mapJobTypeData(data) {
    const graceTimeDetails = Object.keys(JobType).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return graceTimeDetails;
}
export async function mapJobTypeList(data) {
    const DataList = await data?.map((graceTime) => {
        const Details = mapJobTypeData(graceTime);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapJobTypePayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the JobType object
    for (const key in JobType) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}


//-------------Educations ---------------

export function mapEducationData(data) {
    const graceTimeDetails = Object.keys(Education).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return graceTimeDetails;
}
export async function mapEducationList(data) {
    const DataList = await data?.map((graceTime) => {
        const Details = mapEducationData(graceTime);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapEducationPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Education object
    for (const key in Education) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

//-------------CareerLevels ---------------

export function mapCareerLevelData(data) {
    const graceTimeDetails = Object.keys(CareerLevel).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return graceTimeDetails;
}
export async function mapCareerLevelList(data) {
    const DataList = await data?.map((graceTime) => {
        const Details = mapCareerLevelData(graceTime);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapCareerLevelPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the CareerLevel object
    for (const key in CareerLevel) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}