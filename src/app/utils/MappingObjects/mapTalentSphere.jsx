import {
    ManpowerPlanning,
    Benefit,
    RemoteWorkChecklist,
    JobType,
    Education,
    CareerLevel,
    HeadcountRequest,
    Requisition,
    PublishVacancy,
    Applicants,
} from 'app/utils/Types/TalentSphere';
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";
import { calculateTotalCount } from "utils/renderValues";

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

export function getConsumedBudgetStatus(percentage) {
    if (percentage <= 50)
        return "Within Budget";
    else if (percentage > 50 && percentage <= 70)
        return "Approaching Limit";
    else if (percentage > 70 && percentage <= 90)
        return "Near Threshold";
    else if (percentage > 90)
        return "Over Budget";
    else return null;
}

export async function mapManpowerData(data) {
    const RecordDetails = {};
    for (const key of Object.keys(ManpowerPlanning)) {
        if (key === 'consumed_budget_status') {
            const consumed_budget = parseFloat(data['consumed_percentage']);
            RecordDetails[key] = getConsumedBudgetStatus(consumed_budget);
        } else if (Object.prototype.hasOwnProperty.call(data, key)) {
            RecordDetails[key] = data[key];
        }
    }

    return RecordDetails;
}

export async function mapManpowerList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];

    try {
        const DataList = await Promise.all(
            data.map(async (dataObj) => {
                return await mapManpowerData(dataObj, false);
            })
        );
        return DataList;
    } catch (error) {
        console.error("Error in mapLeaveListData:", error);
        return [];
    }
}


//-------------Benefits ---------------

export function mapBenefitData(data) {
    const RecordDetails = Object.keys(Benefit).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapBenefitList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapBenefitData(Record);
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
    const RecordDetails = Object.keys(RemoteWorkChecklist).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "item_name") acc[key] = data[key].trim()
            else if (key === "status") acc[key] = data[key] ? 'available' : 'unavailable';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapRemoteWorkChecklistList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapRemoteWorkChecklistData(Record);
        return {
            value: Details.id,
            label: Details.item_name,
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
    const RecordDetails = Object.keys(JobType).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapJobTypeList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapJobTypeData(Record);
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
    const RecordDetails = Object.keys(Education).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "level" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapEducationList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapEducationData(Record);
        return {
            value: Details.id,
            label: Details.level,
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
            if (key === "level" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

//-------------CareerLevels ---------------

export function mapCareerLevelData(data) {
    const RecordDetails = Object.keys(CareerLevel).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapCareerLevelList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapCareerLevelData(Record);
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


//-------------HeadcountRequests ---------------

export async function mapHeadcountRequestData(data, fetchApprovalDetails) {
    const RecordDetails = {};
    for (const key of Object.keys(HeadcountRequest)) {
        if (key === "approval_details" && fetchApprovalDetails) {
            RecordDetails[key] = await mapApproverDetails({ ...data, });
        } else {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                RecordDetails[key] = data[key];
            }
        }
    }
    return RecordDetails;
}
export async function mapHeadcountRequestList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];

    try {
        const DataList = await Promise.all(
            data.map(async (dataObj) => {
                return await mapHeadcountRequestData(dataObj, false);
            })
        );
        return DataList;
    } catch (error) {
        console.error("Error in mapLeaveListData:", error);
        return [];
    }
}

export function mapHeadcountRequestPayloadData(data, id) {
    // Initialize an empty payload object
    const formData = new FormData();
    // Iterate over the keys in the HeadcountRequest object
    for (const key in HeadcountRequest) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === 'attachment') {
                if (data[key] instanceof File) formData.append(key, data[key])
            } formData.append(key, data[key])
        }
    }

    // Return the constructed payload
    return formData;
}

//-------------RequisitionRequests ---------------

export async function mapRequisitionRequestData(data, fetchApprovalDetails) {
    const RecordDetails = {};
    for (const key of Object.keys(Requisition)) {
        if (key === "approval_details" && fetchApprovalDetails) {
            RecordDetails[key] = await mapApproverDetails({ ...data, });
        } else {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === 'id') RecordDetails['requisition_id'] = data[key];
                if (key === 'status') {
                    RecordDetails[key] = data[key].toLowerCase() === 'pending' && data['is_draft'] ? 'draft' : data[key].toLowerCase();
                } else RecordDetails[key] = data[key];
            }
        }
    }
    return RecordDetails;
}
export async function mapRequisitionRequestList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];

    try {
        const DataList = await Promise.all(
            data.map(async (dataObj) => {
                return await mapRequisitionRequestData(dataObj, false);
            })
        );
        return DataList;
    } catch (error) {
        console.error("Error in mapLeaveListData:", error);
        return [];
    }
}

export function mapRequisitionRequestPayloadData(data, id) {
    // Initialize an empty payload object
    const formData = new FormData();
    // Iterate over the keys in the RequisitionRequest object
    for (const key in Requisition) {
        // Check if the key exists in the data object
        if (!['education_name', 'approval_details', 'status'].includes(key)) {
            if (
                data.hasOwnProperty(key) &&
                data[key] !== null &&
                data[key] !== undefined
            ) {
                if (key === "job_title" || key === 'job_description' || key === 'justification') formData.append(key, data[key].trim());
                else if (key === 'attachment') {
                    if (data[key] instanceof File) formData.append(key, data[key])
                } else if (key === 'remote_work_checklist') {
                    if (Array.isArray(data[key]) && data[key].length > 0) {
                        for (const checklist of data[key]) {
                            formData.append(key, checklist)
                        }
                    }
                } else if (key === 'benefits') {
                    if (Array.isArray(data[key]) && data[key].length > 0) {
                        for (const benefit of data[key]) {
                            formData.append(key, benefit)
                        }
                    }
                }
                else formData.append(key, data[key])
            }
        }
    }

    // Return the constructed payload
    return formData;
}

export async function mapRequisitionStatsData(data) {
    if (!data || data.length === 0)
        return { Pending: 0, Approved: 0, Rejected: 0, Total: 0, Draft: 0 };
    const Pending = calculateTotalCount(data, "status", "pending");
    const Draft = calculateTotalCount(data, "status", "draft");
    const Total = data.length || 0;
    const Approved = calculateTotalCount(data, "status", "approved");
    const Rejected = calculateTotalCount(data, "status", "rejected");
    return { Pending, Approved, Rejected, Total, Draft };
}


//-------------Vacancy ---------------

export function mapVacancyData(data) {
    const RecordDetails = Object.keys(PublishVacancy).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'requisition_type') {
                const posted_portals = [];
                if (data['post_on_cohrus']) posted_portals.push('Cohrus')
                if (data['post_on_linkedin']) posted_portals.push('Linkedin')
                if (data['post_on_indeed']) posted_portals.push('Indeed')
                if (data['post_on_other']) posted_portals.push('Other Portals')
                acc['posted_portals'] = posted_portals;

            }
            acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapVacancyList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapVacancyData(Record);
        return {
            ...Details,
        };
    });

    return DataList;
}

export function mapVacancyPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Vacancy object
    for (const key in PublishVacancy) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}


//-------------Applicants ---------------

export function mapApplicantsData(data) {
    const RecordDetails = Object.keys(Applicants).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "candidate_id" || key === 'candidate_name') acc[key] = data[key].trim()
            else if (key === "status") {
                const status = data[key];
                if(status==='resume_bank')
                acc[key] = 'Resume Bank';
                else acc[key] = data[key] ;
            }
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapApplicantsList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapApplicantsData(Record);
        return { ...Details, };
    });

    return DataList;
}
export function mapApplicationPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Applicants object
    for (const key in Applicants) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}