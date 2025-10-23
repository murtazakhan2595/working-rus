import {
    ManpowerPlanning,
    Benefit,
    Skill,
    BlacklistReason,
    OfferLetterTemplate,
    OfferTracking,
    RemoteWorkChecklist,
    JobType,
    Education,
    CareerLevel,
    HeadcountRequest,
    Requisition,
    PublishVacancy,
    Applicants,
    RejectedApplication,
    ShortlistedApplicant,
    BlacklistApplicant,
    ResumeBankApplication,
    InterviewType,
    FeedBackForm,
    EmailTemplate,
    Interview,
    InterviewFeedback,
    OfferLetter,
} from 'app/utils/Types/TalentSphere';
import { mapApproverDetails } from "app/utils/MappingObjects/mapGeneralData";
import { calculateTotalCount } from "utils/renderValues";
import { FormatID } from "utils/getValuesFromTables";

export function mapManpowerPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Task object
    for (const key in ManpowerPlanning) {
        // Check if the key exists in the data object
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== undefined) {
            // Add the key and its value to the payload
            if (key === 'justification') payload[key] = data[key]?.trim();
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
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
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
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
//-------------Skills ---------------

export function mapSkillData(data) {
    const RecordDetails = Object.keys(Skill).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapSkillList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapSkillData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapSkillPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Skill object
    for (const key in Skill) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
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
            if (key === "item_name") acc[key] = data[key]?.trim()
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
            if (key === "item_name") payload[key] = data[key]?.trim();
            if (key === "status") payload[key] = Boolean(data[key] === 'available');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

//-------------InterviewTypes ---------------

export function mapInterviewTypeData(data) {
    const RecordDetails = Object.keys(InterviewType).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapInterviewTypeList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapInterviewTypeData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapInterviewTypePayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the InterviewType object
    for (const key in InterviewType) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
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
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
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
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
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
            if (key === "level" || key === 'description') acc[key] = data[key]?.trim()
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
            if (key === "level" || key === 'description') payload[key] = data[key]?.trim();
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
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
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
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}


//-------------HeadcountRequests ---------------

export async function mapHeadcountRequestData(data, fetchApprovalDetails = true) {
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
    if (['approved', 'rejected'].includes(data['status']?.toLowerCase())) {
        const logs = data['approval_logs']?.[0];
        if (logs?.action_type?.toUpperCase() === 'APPROVED') {
            RecordDetails['approved_by'] = logs.changed_by;
            RecordDetails['approved_on'] = logs.timestamp;
        } else if (logs?.action_type?.toUpperCase() === 'REJECTED') {
            RecordDetails['rejected_by'] = logs.changed_by;
            RecordDetails['rejected_on'] = logs.timestamp;
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

export async function mapRequisitionRequestData(data, fetchApprovalDetails = true) {
    const RecordDetails = {};
    for (const key of Object.keys(Requisition)) {
        if (key === "approval_details" && fetchApprovalDetails) {
            RecordDetails[key] = await mapApproverDetails({ ...data, });
        } else if (key === 'enable_benefits') {
            RecordDetails[key] = data['benefits'] && Array.isArray(data['benefits']) && data['benefits'].length > 0;
        } else {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === 'id') RecordDetails['requisition_id'] = data[key];
                if (key === 'status') {
                    if (data['is_publish'] === true)
                        RecordDetails[key] = 'Published';
                    else RecordDetails[key] = data[key]?.toLowerCase() === 'pending' && data['is_draft'] ? 'draft' : data[key]?.toLowerCase();
                } else RecordDetails[key] = data[key];
            }
        }
    }
    // Preserve aggregate counts if provided by the API
    if (Object.prototype.hasOwnProperty.call(data, 'total_applicants')) {
        RecordDetails['total_applicants'] = data['total_applicants'] ?? 0;
    }
    if (Object.prototype.hasOwnProperty.call(data, 'total_applications')) {
        RecordDetails['total_applications'] = data['total_applications'] ?? 0;
    }
    if (['approved', 'rejected'].includes(data['status']?.toLowerCase())) {
        const logs = data['approval_logs']?.[0];
        if (logs) {
            if (logs?.action_type?.toUpperCase() === 'APPROVED') {
                RecordDetails['approved_by'] = logs.changed_by;
                RecordDetails['approved_on'] = logs.timestamp;
            } else if (logs?.action_type?.toUpperCase() === 'REJECTED') {
                RecordDetails['rejected_by'] = logs.changed_by;
                RecordDetails['rejected_on'] = logs.timestamp;
            }
        } else {
            RecordDetails['approved_by'] = data.requested_by;
            RecordDetails['approved_on'] = data.created_at;
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
                if (key === "job_title" || key === 'job_description' || key === 'justification') formData.append(key, data[key]?.trim());
                else if (key === 'attachment') {
                    if (data[key] instanceof File) formData.append(key, data[key])
                } else if (['remote_work_checklist', 'benefits', 'required_skillset'].includes(key)) {
                    if (Array.isArray(data[key]) && data[key]?.length > 0) {
                        for (const value of data[key]) {
                            formData.append(key, value)
                        }
                    }
                } else formData.append(key, data[key])
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

export async function mapApplicantsData(data) {
    if (!data) return {};

    const RecordDetails = {};

    for (const key of Object.keys(Applicants)) {
        if (!data.hasOwnProperty(key)) continue;
        const value = data[key];
        switch (key) {
            case "id":
                RecordDetails.applicant_id = value;
                RecordDetails.serial_id = FormatID({ value, prefix: "APP" });
                RecordDetails.id = value;
                break;
            case "candidate_id":
            case "candidate_name":
                RecordDetails[key] = value?.trim?.() || "";
                break;
            case "ai_match_score":
                RecordDetails[key] = `${parseFloat(value || 0) * 100}`;
                break;
            case "ai_feedback_confidence":
                RecordDetails[key] = `${parseInt(value || 0)}%`;
                break;
            case "status":
                RecordDetails.status = value === "resume_bank" ? "Resume Bank" : value === "in_progress" ? "In Progress" : value;
                break;

            case "blacklist":
                RecordDetails.blacklist = value ? mapBlacklistApplicantData(value) : null;
                break;
            case "interviews":
                const interviews = value && value.length > 0 ? await mapInterviewList(value) : null;
                const sortedData = interviews ? (interviews || []).sort((a, b) => a.id - b.id) : null;
                RecordDetails.interviews = sortedData;
                RecordDetails.latest_interview = sortedData?.[sortedData.length - 1];
                break;

            case "recruitment_shortlist":
                RecordDetails.recruitment_shortlist = value ? mapShortlistedApplicantData(value) : null;
                break;

            case "offers_tracking":
                RecordDetails.offers_tracking = value?.[0] ? mapOfferTrackingData(value[0]) : null;
                RecordDetails['hired_at'] = RecordDetails.offers_tracking?.hired_at;
                RecordDetails['hired_by'] = RecordDetails.offers_tracking?.hired_by;
                break;
            case "resume_bank":
                RecordDetails.resume_bank = value ? mapResumeBankApplicantsData(value) : null;
                break;
            case "offer_letters":
                const offer_letters = value && value.length > 0 ? await mapOfferLetterList(value, Boolean(data.offers_tracking?.[0])) : null;
                const sorted_offer_letters = offer_letters ? (offer_letters || []).sort((a, b) => a.id - b.id) : null;
                RecordDetails.offer_letters = sorted_offer_letters;
                break;

            case "publish_vacancy":
                RecordDetails.publish_vacancy = value ? await mapRequisitionRequestData(value) : null;
                break;
            default:
                RecordDetails[key] = value;
                break;
        }
    }
    return RecordDetails;
}

export async function mapApplicantsList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];
    try {
        const DataList = await Promise.all(
            data.map(async (dataObj) => {
                return await mapApplicantsData(dataObj, false);
            })
        );
        return DataList;
    } catch (error) {
        console.error("Error in mapLeaveListData:", error);
        return [];
    }
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
//--------------- Rejected Application--------------------
export function mapRejectedApplicationPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Applicants object
    for (const key in RejectedApplication) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "rejection_reason") payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
//--------------- Shortlisted Application--------------------
export function mapShortlistedApplicantPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Applicants object
    for (const key in ShortlistedApplicant) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "rejection_reason") payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

export function mapShortlistedApplicantData(data) {
    const RecordDetails = Object.keys(ShortlistedApplicant).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'remarks') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}

//--------------- Blacklist Application--------------------
export function mapBlacklistApplicantPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Applicants object
    for (const key in BlacklistApplicant) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "remarks") payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
export function mapBlacklistApplicantData(data) {
    const RecordDetails = Object.keys(BlacklistApplicant).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'remarks') acc[key] = data[key]?.trim()
            else if (key === "reasons") {
                acc[key] = ((data[key] || []).map(reason => reason.name) || [])
            }
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
//--------------- Resume Bank Application--------------------
export function mapResumeBankApplicationPayloadData(data) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Applicants object
    for (const key in ResumeBankApplication) {
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

export function mapResumeBankApplicantsData(data) {
    const RecordDetails = Object.keys(ResumeBankApplication).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "applicant") acc['applicant_id'] = data[key];
            acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapResumeBankApplicantsList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapResumeBankApplicantsData(Record);
        return { ...Details, };
    });

    return DataList;
}


//-------------FeedBackForms ---------------

export function mapFeedBackFormData(data) {
    const RecordDetails = Object.keys(FeedBackForm).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name") acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});
    const total_sections = (data.sections || 0).length || 0;
    const total_fields = (data.sections || []).reduce((count, section) => {
        return count + ((section?.fields || [])?.length || 0);
    }, 0);

    return { ...RecordDetails, total_sections, total_fields };
}
export async function mapFeedBackFormList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapFeedBackFormData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapFeedBackFormPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the FeedBackForm object
    for (const key in FeedBackForm) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name") payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

//-------------EmailTemplates ---------------

export function mapEmailTemplateData(data) {
    const RecordDetails = Object.keys(EmailTemplate).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapEmailTemplateList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapEmailTemplateData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapEmailTemplatePayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the EmailTemplate object
    for (const key in EmailTemplate) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
//-------------OfferLetterTemplates ---------------

export function mapOfferLetterTemplateData(data) {
    const RecordDetails = Object.keys(OfferLetterTemplate).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapOfferLetterTemplateList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapOfferLetterTemplateData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapOfferLetterTemplatePayloadData(data, id) {
    // Initialize an empty payload object
    const formData = new FormData();
    // Iterate over the keys in the HeadcountRequest object
    for (const key in OfferLetterTemplate) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') formData.append(key, data[key]?.trim());
            else if (key === 'letterhead') {
                if (data[key] instanceof File) formData.append(key, data[key])
            }
            else formData.append(key, data[key])
        }
    }

    // Return the constructed payload
    return formData;
}

//-------------OfferTrackings ---------------

export function mapOfferTrackingData(data) {
    const RecordDetails = Object.keys(OfferTracking).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'audit_logs') {
                const sorted = data[key]?.sort(
                    (a, b) => new Date(b.changed_on) - new Date(a.changed_on)
                );
                // Step 2: Keep only the latest record for each new_status
                const uniqueLatest = Object.values(
                    sorted.reduce((acc, log) => {
                        if (log.new_status === 'pending') {
                            log.new_status = 'sent'
                            if (!log.changed_by)
                                log.changed_by = data.sent_by;
                        }
                        if (log.new_status === 'accepted' || log.new_status === 'rejected')
                            log.changed_by = data.applicant_name;
                        if (!acc[log.new_status]) {
                            acc[log.new_status] = log;
                        }
                        return acc;
                    }, {})
                );
                const sorted_desendant = uniqueLatest?.sort(
                    (a, b) => new Date(a.changed_on) - new Date(b.changed_on)
                );
                acc[key] = sorted_desendant;
            } else acc[key] = data[key];
        }
        return acc;
    }, {});
    if (data.audit_logs) {
        const accepted_log = data.audit_logs.find(obj => obj.new_status === 'accepted');
        const rejected_log = data.audit_logs.find(obj => obj.new_status === 'rejected');
        const hired_log = data.audit_logs.find(obj => obj.new_status === 'hired');
        if (accepted_log) {
            RecordDetails['accepted_at'] = accepted_log?.changed_on;
        }
        if (rejected_log) {
            RecordDetails['rejected_at'] = rejected_log?.changed_on;
        }
        if (hired_log) {
            RecordDetails['hired_at'] = hired_log?.changed_on;
            RecordDetails['hired_by'] = hired_log?.changed_by;
        }
    }
    console.log(RecordDetails, "RecordDetails")

    return RecordDetails;
}
export async function mapOfferTrackingList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapOfferTrackingData(Record);
        return {
            ...Details,
        };
    });

    return DataList;
}

export function mapOfferTrackingPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the OfferTracking object
    for (const key in OfferTracking) {
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

//-------------OfferLetter ---------------

export async function mapOfferLetterData(data, fetchApprovalDetails = true) {
    const RecordDetails = {};
    for (const key of Object.keys(OfferLetter)) {
        if (key === "approval_details" && fetchApprovalDetails) {
            RecordDetails[key] = await mapApproverDetails({ ...data, });
        } else {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key === 'status' && data[key] === 'pending_approval')
                    RecordDetails[key] = 'pending';
                else if (['requisitation_branch', 'requisitation_currency', 'requisitation_department',].includes(key))
                    RecordDetails[key] = 'pending';
                else if (key === 'status' && data[key]?.toLowerCase() === 'approved' && data["is_offer_sent"])
                    RecordDetails[key] = parseInt(data[key]);
                else if (key === 'ai_budget_status') {
                    const status = data[key] ?? "";
                    switch (status) {
                        case "within_budget":
                            RecordDetails[key] = "Within Budget";
                            break;
                        default:
                            RecordDetails[key] = status;
                            break;
                    }
                }
                else if (key === 'ai_salary_match_status') {
                    const status = data[key] ?? "";
                    switch (status) {
                        case "out_of_range":
                            RecordDetails[key] = "Out of Range";
                            break;
                        case "matched":
                            RecordDetails[key] = "Matched";
                            break;
                        default:
                            RecordDetails[key] = status;
                            break;
                    }

                } else if (key === 'ai_confidence_score') {
                    const confidence = parseFloat(data[key] || 0);
                    if (confidence >= 80)
                        RecordDetails[key] = <div className='text-emerald-700'>{parseFloat(data[key] || 0)}% - Good to approve</div>;
                    else if (confidence < 50)
                        RecordDetails[key] = <div className='text-red-800'>{parseFloat(data[key] || 0)}% - Review required before proceeding</div>;
                    else if (confidence >= 50 && confidence < 80)
                        RecordDetails[key] = <div className='text-amber-500'>{parseFloat(data[key] || 0)}% - Needs HR attention</div>;
                } else if (key === 'ai_missing_fields') {
                    RecordDetails[key] = data[key] && data[key].length > 0 ? data[key] : "All Required Fields Present";
                }
                else RecordDetails[key] = data[key];
            }
        }
    }
    if (['approved', 'rejected', 'sent'].includes(data['status']?.toLowerCase())) {
        const logs = data['approval_logs']?.[0];
        if (logs?.action_type?.toUpperCase() === 'APPROVED') {
            RecordDetails['approved_by'] = logs.changed_by;
            RecordDetails['approved_on'] = logs.timestamp;
        } else if (logs?.action_type?.toUpperCase() === 'REJECTED') {
            RecordDetails['rejected_by'] = logs.changed_by;
            RecordDetails['rejected_on'] = logs.timestamp;
        }
    }
    return RecordDetails;
}
export async function mapOfferLetterList(data, is_offer_sent = null) {
    if (!Array.isArray(data) || data.length === 0) return [];
    try {
        const DataList = await Promise.all(
            data.map(async (dataObj, index) => {
                if (index === data.length - 1 && is_offer_sent !== null && is_offer_sent !== undefined) {
                    dataObj['is_offer_sent'] = is_offer_sent;//Update the status if tracking exist from a applicant
                }
                return await mapOfferLetterData(dataObj, false);
            })
        );
        return DataList;
    } catch (error) {
        console.error("Error in mapLeaveListData:", error);
        return [];
    }
}

export function mapOfferLetterPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the OfferLetter object
    for (const key in OfferLetter) {
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


//-------------Interview ---------------

export function mapInterviewData(data) {
    const RecordDetails = Object.keys(Interview).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "applicant") acc['applicant_id'] = data[key];
            acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapInterviewList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapInterviewData(Record);
        return {
            ...Details,
        };
    });

    return DataList;
}

export function mapInterviewPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the Interview object
    for (const key in Interview) {
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


//-------------InterviewFeedbacks ---------------

export function mapInterviewFeedbackData(data) {
    const RecordDetails = Object.keys(InterviewFeedback).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "comments") acc[key] = data[key]?.trim();
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}

export async function mapInterviewFeedbackList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];

    // Step 1: Map feedback details
    const DataList = data.map((record) => {
        const details = mapInterviewFeedbackData(record);
        return {
            ...details,
        };
    });
    // Step 2: Get unique interview IDs sorted ascending
    const uniqueInterviews = [...new Set(DataList.map(fb => fb.interview))].sort((a, b) => a - b);

    // Step 3: Map interview IDs to names (Interview 01, 02, ...)
    const interviewNames = uniqueInterviews.reduce((acc, interviewId, index) => {
        acc[interviewId] = `Interview ${String(index + 1).padStart(2, "0")}`;
        return acc;
    }, {});

    // Step 4: Add interview_name field to each feedback
    const indexedFeedbacks = DataList.map(fb => ({
        ...fb,
        interview_name: interviewNames[fb.interview] || null,
    }));

    return indexedFeedbacks;
}


export function mapInterviewFeedbackPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the InterviewFeedback object
    for (const key in InterviewFeedback) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === 'comments') payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}


//-------------BlacklistReasons ---------------

export function mapBlacklistReasonData(data) {
    const RecordDetails = Object.keys(BlacklistReason).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key]?.trim()
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapBlacklistReasonList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapBlacklistReasonData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
}

export function mapBlacklistReasonPayloadData(data, id) {
    // Initialize an empty payload object
    const payload = {};
    // Iterate over the keys in the BlacklistReason object
    for (const key in BlacklistReason) {
        // Check if the key exists in the data object
        if (
            data.hasOwnProperty(key) &&
            data[key] !== null &&
            data[key] !== undefined
        ) {
            if (key === "name" || key === 'description') payload[key] = data[key]?.trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
