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
//-------------Skills ---------------

export function mapSkillData(data) {
    const RecordDetails = Object.keys(Skill).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
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
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
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

//-------------InterviewTypes ---------------

export function mapInterviewTypeData(data) {
    const RecordDetails = Object.keys(InterviewType).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "is_active") {
                acc['status'] = data[key] ? 'active' : 'inactive';
            }
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
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
        if (key === "is_active") payload[key] = Boolean(data['status'] === 'active')
        else if (
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
                } else if (['remote_work_checklist', 'benefits',].includes(key)) {
                    if (Array.isArray(data[key]) && data[key].length > 0) {
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

export function mapApplicantsData(data) {
    const RecordDetails = Object.keys(Applicants).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'id') {
                acc['applicant_id'] = data[key];
                acc['serial_id'] = FormatID({ value: data[key], prefix: 'APP' });
            }
            if (key === "candidate_id" || key === 'candidate_name') acc[key] = data[key].trim()
            else if (key === "status") {
                const status = data[key];
                if (status === 'resume_bank')
                    acc[key] = 'Resume Bank';
                else if (status === 'in_progress')
                    acc[key] = 'In Progress';
                else acc[key] = data[key];
            }
            else if (key === 'blacklist') {
                acc[key] = data[key] ? mapBlacklistApplicantData(data[key]) : null;
            }
            else if (key === 'recruitment_shortlist') {
                acc[key] = data[key] ? mapShortlistedApplicantData(data[key]) : null;
            }
            // else if (key === 'interviews') {
            //     acc[key] = data[key] ? mapShortlistedApplicantData(data[key]) : null;
            // }
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
            if (key === "rejection_reason") payload[key] = data[key].trim();
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
            if (key === "rejection_reason") payload[key] = data[key].trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}

export function mapShortlistedApplicantData(data) {
    const RecordDetails = Object.keys(ShortlistedApplicant).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'remarks') acc[key] = data[key].trim()
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
            if (key === "remarks") payload[key] = data[key].trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
export function mapBlacklistApplicantData(data) {
    const RecordDetails = Object.keys(BlacklistApplicant).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === 'remarks') acc[key] = data[key].trim()
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
            if (key === "name") acc[key] = data[key].trim()
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
            if (key === "name") payload[key] = data[key].trim();
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
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
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
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else if (key === "status") payload[key] = Boolean(data[key] === 'active');
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
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
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
    const payload = {};
    // Iterate over the keys in the OfferLetterTemplate object
    for (const key in OfferLetterTemplate) {
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

//-------------OfferTrackings ---------------

export function mapOfferTrackingData(data) {
    const RecordDetails = Object.keys(OfferTracking).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            acc[key] = data[key];
        }
        return acc;
    }, {});

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
                RecordDetails[key] = data[key];
            }
        }
    }
    return RecordDetails;
}
export async function mapOfferLetterList(data) {
    if (!Array.isArray(data) || data.length === 0) return [];
    try {
        const DataList = await Promise.all(
            data.map(async (dataObj) => {
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
    // Iterate over the keys in the EmailTemplate object
    for (const key in Interview) {
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


//-------------InterviewFeedbacks ---------------

export function mapInterviewFeedbackData(data) {
    const RecordDetails = Object.keys(InterviewFeedback).reduce((acc, key) => {
        if (data.hasOwnProperty(key)) {
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
            if (key === "status") acc[key] = data[key] ? 'active' : 'inactive';
            else acc[key] = data[key];
        }
        return acc;
    }, {});

    return RecordDetails;
}
export async function mapInterviewFeedbackList(data) {
    const DataList = await data?.map((Record) => {
        const Details = mapInterviewFeedbackData(Record);
        return {
            value: Details.id,
            label: Details.name,
            ...Details,
        };
    });

    return DataList;
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
            if (key === 'comments') payload[key] = data[key].trim();
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
            if (key === "name" || key === 'description') acc[key] = data[key].trim()
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
            if (key === "name" || key === 'description') payload[key] = data[key].trim();
            else payload[key] = data[key];
        }
    }

    // Return the constructed payload
    return payload;
}
