import { GlobalStatusOptions } from "data/Data";

const RequisitionStatusOptions = (viewMode) => viewMode === "Records"
    ? [...GlobalStatusOptions(false), { label: "Published", value: "Published" }]
    : viewMode === "Requests" ? [{ label: "Draft", value: "Draft" }, { label: "Pending", value: "Pending" }]
        : [{ label: "Approved", value: "Approved" }, { label: "Published", value: "Published" }, { label: "Draft", value: "Draft" }]

export const RequisitionFilters = (isTeamView, viewMode, JobTypeList, CareerLevelList, StatusFilter) => [
    {
        type: "search",
        name: "job_title",
        placeholder: "Job Title",
    },
    {
        type: "select",
        options: "Departments",
        name: "department",
        placeholder: "Department",
    },
    {
        type: "select",
        options: "Branches",
        name: "branch",
        placeholder: "Branch",
    },
    {
        type: "select",
        options: JobTypeList,
        name: "job_type",
        placeholder: "Job Type",
    },
    {
        type: "select",
        options: CareerLevelList,
        name: "career_level",
        placeholder: "Career Level",
    },
    {
        type: "select",
        options: 'Currencies',
        name: "currency",
        placeholder: "Currency",
    },
    {
        type: "select",
        options: [{ label: 'Monthly', value: 'monthly' }, { label: 'Bi-Weekly', value: 'bi-weekly' }, { label: 'Weekly', value: 'weekly' }, { label: 'Annually', value: 'annually' },],
        name: "payment_frequency",
        placeholder: "Payment Frequency",
    },
    {
        type: "select",
        options: [
            { value: 'onsite', label: 'Onsite' },
            { value: 'hybrid', label: "Hybrid" },
            { value: 'remote', label: "Remote" },
        ],
        name: "work_mode",
        placeholder: "Work Mode",
    },
    {
        type: "select",
        options: [
            { value: true, label: 'Required' },
            { value: false, label: "Not Reqiured" },
        ],
        name: "is_emiratization_role",
        placeholder: "Emiratization Role",
    },
    {
        type: "numeric-range",
        name: "salary_range",
        placeholder: "Salary Range",
    },
    ...(!isTeamView ? [{
        type: "select",
        name: "requested_by",
        options: 'Employees',
        placeholder: "Requested By",
    },
    {
        type: "date-range",
        placeholder: "Request Date",
        name: "created_at",
    },] : []),
    {
        type: "select",
        options: RequisitionStatusOptions(viewMode),
        name: "status",
        placeholder: "Status",
        ...(StatusFilter ? { value: StatusFilter } : {}),
    }
]

export const handleRequisitionFilterChange = (prevFilters, filterName, filterValue, activeView) => {
    const updatedFilters = { ...prevFilters };
    // Handle other filters normally
    if (filterValue === "" || filterValue === null) {
        if (filterName === "status" && activeView) {
            if (activeView === "Requests") {
                updatedFilters[filterName] = "pending";
            } else if (activeView === "Records") {
                updatedFilters[filterName] =
                    ["approved", "rejected"];
            }
            delete updatedFilters['is_publish'];
            delete updatedFilters['is_draft'];
        } else delete updatedFilters[filterName];
    } else {
        if (filterName === "status") {
            if (filterValue === 'Published') {
                updatedFilters['is_publish'] = true;
                delete updatedFilters[filterName];
                delete updatedFilters['is_draft'];
            } else if (filterValue === 'Draft') {
                updatedFilters['is_draft'] = true;
                updatedFilters[filterName] = 'pending';
                delete updatedFilters['is_publish'];
            } else if (filterValue.toLowerCase() === 'approved') {
                updatedFilters['is_publish'] = false;
                delete updatedFilters['is_draft'];
                updatedFilters[filterName] = filterValue.toLowerCase();
            } else if (filterValue.toLowerCase() === 'rejected') {
                delete updatedFilters['is_publish'];
                updatedFilters[filterName] = filterValue.toLowerCase();
                delete updatedFilters['is_draft'];
            } else if (filterValue.toLowerCase() === 'pending') {
                delete updatedFilters['is_publish'];
                updatedFilters[filterName] = filterValue.toLowerCase();
                updatedFilters['is_draft'] = false;
            }
        }
        else if (['created_at', 'salary_range'].includes(filterName))
            updatedFilters[filterName] = filterValue?.split(',');
        else updatedFilters[filterName] = filterValue;
    }

    return updatedFilters;
};
