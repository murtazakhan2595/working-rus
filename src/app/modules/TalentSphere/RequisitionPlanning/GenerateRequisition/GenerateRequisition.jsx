import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getRequisitionRequestList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { RequisitionRequestColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { GlobalStatusOptions } from "data/Data";
import { ViewRequisitionRequest } from "app/modules/TalentSphere";
import { GetDispatchStateList } from "utils/Lists";

const GenerateRequisition = ({ reload, deepLinkRequisition, deepLinkAction, deepLinkFilterData }) => {
    const Employees = GetDispatchStateList("employees", "emp");
    const [RequisitionList, setRequisitionList] = useState({});

    // Initialize filterData with deep link data if it exists (lazy initializer)
    const [filterData, setFilterData] = useState(() => {
        if (deepLinkFilterData) {
            const convertedFilters = { ...deepLinkFilterData };

            // Convert is_emiratization_role: true/false to "required"/"not_required" for dropdown
            if (typeof convertedFilters.is_emiratization_role === 'boolean') {
                convertedFilters.is_emiratization_role = convertedFilters.is_emiratization_role ? 'required' : 'not_required';
            }

            return convertedFilters;
        }
        return {};
    });

    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);

    // State for auto-opening detail sheet
    const [viewSheetOpen, setViewSheetOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);

    // Handle deep link filter data when navigating from dashboard
    useEffect(() => {
        if (deepLinkFilterData) {
            const convertedFilters = { ...deepLinkFilterData };

            // Convert is_emiratization_role: true/false to "required"/"not_required" for dropdown
            if (typeof convertedFilters.is_emiratization_role === 'boolean') {
                convertedFilters.is_emiratization_role = convertedFilters.is_emiratization_role ? 'required' : 'not_required';
            }

            setFilterData(convertedFilters);
            // Reset page to 1 when applying deep link filters
            onPageChange("page", 1);
        }
    }, [deepLinkFilterData]);

    // Handle deep link filtering by requisition ID
    useEffect(() => {
        if (deepLinkRequisition) {
            setFilterData(prev => ({
                ...prev,
                id: deepLinkRequisition
            }));
        }
    }, [deepLinkRequisition]);

    // Auto-open sheet when data is loaded with deep link (only once)
    useEffect(() => {
        if (deepLinkRequisition && RequisitionList?.results?.length > 0 && !isLoading && !hasAutoOpened) {
            const requisition = RequisitionList.results.find(
                req => req.id === parseInt(deepLinkRequisition)
            );
            if (requisition) {
                setSelectedRequisitionId(parseInt(deepLinkRequisition));
                setViewSheetOpen(true);
                setHasAutoOpened(true); // Mark as opened to prevent re-opening
            }
        }
    }, [deepLinkRequisition, RequisitionList, isLoading, hasAutoOpened]);

    const onPageChange = (name, value) => {
        setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
    };

    const tableOptions = {
        page: options.page,
        sizePerPage: options.sizePerPage,
        onPageChange: onPageChange,
        onSortChange: (sortName) => {
            setOrdering(sortName);
        },
    };
    useEffect(() => {
        const fetchBenefitData = async (isMounted) => {
            try {
                setIsLoading(true);
                // Add organizationId to filter if available
                const career_level = await getCareerLevelList();
                const job_type = await getJobTypeList();
                if (isMounted) {
                    setJobTypeList(job_type.results);
                    setCareerLevelList(career_level.results);
                }
            } catch (error) {
                console.error("Error fetching roles:", error);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        fetchBenefitData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);
    const fetchData = async (isMounted) => {
        setIsLoading(true);
        try {
            // Convert UI filter values to API format
            const filters = { ...filterData, approval_required: false };

            // Convert is_emiratization_role from "required"/"not_required" string to boolean for API
            if (filters.is_emiratization_role) {
                filters.is_emiratization_role = filters.is_emiratization_role === 'required' ? true : false;
            }

            const response = await getRequisitionRequestList({
                filterData: filters,
                options,
                ordering,
            });
            if (isMounted && response) {
                setRequisitionList(response);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [filterData, ordering, options]);

    useEffect(() => {
        let isMounted = true;
        onPageChange("page", 1);
        setOrdering("-id");
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [reload]);

    const handleFilterChange = (filterName, filterValue) => {
        onPageChange("page", 1);
        setFilterData((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (filterValue === "" || filterValue === "All") {
                delete updatedFilters[filterName];
            } else {
                // Store UI values as-is (strings for dropdowns)
                // Conversion to API format happens in fetchData
                if (['created_at', 'salary_range'].includes(filterName))
                    updatedFilters[filterName] = filterValue?.split(',');
                else updatedFilters[filterName] = filterValue;
            }
            return updatedFilters;
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle >Generate Requisition</CardTitle>
                <CardDescription>
                    Here you can view generated requisitions directly.
                </CardDescription>
                <div className="flex justify-end">
                    <FilterInput
                        filters={[
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
                                options: [
                                    { value: 'onsite', label: 'Onsite' },
                                    { value: 'hybrid', label: "Hybrid" },
                                    { value: 'remote', label: "Remote" },
                                ],
                                name: "work_mode",
                                placeholder: "Work Mode",
                            },
                            {
                                type: "numeric-range",
                                name: "salary_range",
                                placeholder: "Salary Range",
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
                                type: "select",
                                name: "requested_by",
                                options: Employees,
                                placeholder: "Requested By",
                            },
                            {
                                type: "date-range",
                                placeholder: "Request Date",
                                name: "created_at",
                            },
                            // {
                            //     type: "select",
                            //     options: [...GlobalStatusOptions(false),],
                            //     name: "status",
                            //     placeholder: "Status",
                            //     values: filterData.status,
                            // },

                        ]}
                        className="justify-end"
                        onChange={handleFilterChange}
                    // filterValues={filterData}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        columns={RequisitionRequestColumns(fetchData)}
                        data={RequisitionList.results || []}
                        tableOptions={tableOptions}
                        dataTotalSize={RequisitionList?.count || 0}
                        pagination={true}
                    />
                )}
            </CardContent>

            {/* Auto-opened detail sheet when navigating from dashboard */}
            {viewSheetOpen && selectedRequisitionId && (
                <ViewRequisitionRequest
                    isOpen={viewSheetOpen}
                    reloadData={() => {
                        fetchData(true);
                        setViewSheetOpen(false);
                    }}
                    setIsOpen={() => {
                        setViewSheetOpen(false);
                        setSelectedRequisitionId(null);
                    }}
                    currentId={selectedRequisitionId}
                    DataList={RequisitionList?.results || []}
                    isTeamView={false}
                />
            )}
        </>
    );
};

export default GenerateRequisition;
