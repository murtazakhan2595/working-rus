import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getRequisitionRequestList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { RequisitionRequestColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { GlobalStatusOptions } from "data/Data";
import { ViewRequisitionRequest } from "app/modules/TalentSphere";

const GenerateRequisition = ({ reload, deepLinkRequisition, deepLinkAction }) => {
    const [RequisitionList, setRequisitionList] = useState({});
    const [filterData, setFilterData] = useState({});
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
    
    // State for auto-opening detail sheet
    const [viewSheetOpen, setViewSheetOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null);

    // Handle deep link filtering and actions
    useEffect(() => {
        if (deepLinkRequisition) {
            setFilterData(prev => ({
                ...prev,
                id: deepLinkRequisition
            }));
        }
    }, [deepLinkRequisition]);
    
    // Auto-open sheet when data is loaded with deep link
    useEffect(() => {
        if (deepLinkRequisition && RequisitionList?.results?.length > 0 && !isLoading) {
            // Find the requisition in the loaded data
            const requisition = RequisitionList.results.find(
                req => req.id === parseInt(deepLinkRequisition)
            );
            if (requisition) {
                setSelectedRequisitionId(parseInt(deepLinkRequisition));
                setViewSheetOpen(true);
            }
        }
    }, [deepLinkRequisition, RequisitionList, isLoading]);

    // Handle deep link actions (like publish)
    useEffect(() => {
        if (deepLinkAction === 'publish' && deepLinkRequisition) {
            // This would trigger the publish action for the specific requisition
            // The action would be handled by the table's action buttons
            console.log('Publish action requested for requisition:', deepLinkRequisition);
        }
    }, [deepLinkAction, deepLinkRequisition]);
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
            const filters={...filterData,approval_required:false}
            const response = await getRequisitionRequestList({
                filterData:filters,
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
            if (filterValue === "") {
                delete updatedFilters[filterName];
            } else {
                updatedFilters[filterName] = filterValue;
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
                                options: [...GlobalStatusOptions(false),],
                                name: "status",
                                placeholder: "Status",
                            },

                        ]}
                        className="justify-end"
                        onChange={handleFilterChange}
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
