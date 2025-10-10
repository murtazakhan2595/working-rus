import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getRequisitionRequestList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { RequisitionRequestColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { GlobalStatusOptions } from "data/Data";
import { ViewRequisitionRequest } from "app/modules/TalentSphere";

const EmiratizationRequisitions = () => {
    const [RequisitionList, setRequisitionList] = useState({});
    
    // Initialize filterData with emiratization role filter
    const [filterData, setFilterData] = useState({ is_emiratization_role: 'required' });
    
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
    
    // State for auto-opening detail sheet
    const [viewSheetOpen, setViewSheetOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null);

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
            const filters = { ...filterData };
            
            // Convert is_emiratization_role from "required"/"not_required" string to boolean for API
            if (filters.is_emiratization_role) {
                filters.is_emiratization_role = filters.is_emiratization_role === 'required' ? true : false;
            }
            
            const response = await getRequisitionRequestList({
                filterData: filters,
                options,
                ordering,
            });
            
            console.log("EmiratizationRequisitions - API Response:", response);
            console.log("EmiratizationRequisitions - Response Results:", response?.results);
            console.log("EmiratizationRequisitions - Response Count:", response?.count);
            
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
    }, [filterData, options, ordering]);

    const handleViewRequisition = (row) => {
        setSelectedRequisitionId(row.id);
        setViewSheetOpen(true);
    };

    const handleCloseSheet = () => {
        setViewSheetOpen(false);
        setSelectedRequisitionId(null);
    };

    console.log("EmiratizationRequisitions - Component State:", {
        isLoading,
        requisitionList: RequisitionList,
        hasResults: RequisitionList?.results?.length,
        count: RequisitionList?.count,
        filterData
    });

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="space-y-6">
            <div>
                <CardHeader>
                    <CardTitle>Emiratization Requisitions</CardTitle>
                    <CardDescription>
                        Here you can view all emiratization requisitions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <div className="flex flex-wrap gap-4 mb-6">
                        <FilterInput
                            filterData={filterData}
                            setFilterData={setFilterData}
                            filterFields={[
                                { name: "job_title", label: "Job Title", type: "text" },
                                { name: "department", label: "Search Department", type: "select", options: [] },
                                { name: "branch", label: "Search Branch", type: "select", options: [] },
                                { name: "job_type", label: "Search Job Type", type: "select", options: JobTypeList },
                                { name: "career_level", label: "Search Career Level", type: "select", options: CareerLevelList },
                                { name: "work_mode", label: "Search Work Mode", type: "select", options: [] },
                                { name: "salary_range", label: "Salary Range", type: "text" },
                                { name: "is_emiratization_role", label: "Emiratization Role", type: "select", options: [
                                    { value: "required", label: "Required" },
                                    { value: "not_required", label: "Not Required" }
                                ]},
                                { name: "status", label: "Search Status", type: "select", options: GlobalStatusOptions },
                            ]}
                            onRefresh={() => fetchData(true)}
                        />
                    </div> */}
                    {console.log("TableCustom props:", {
                        data: RequisitionList.results || [],
                        dataLength: (RequisitionList.results || []).length,
                        columns: RequisitionRequestColumns(fetchData),
                        totalCount: RequisitionList.count || 0,
                        isLoading
                    })}
                    <TableCustom
                        data={RequisitionList.results || []}
                        columns={RequisitionRequestColumns(fetchData)}
                        tableOptions={tableOptions}
                        onRowClick={handleViewRequisition}
                        totalCount={RequisitionList.count || 0}
                        isLoading={isLoading}
                    />
                </CardContent>
            </div>

            {viewSheetOpen && selectedRequisitionId && (
                <ViewRequisitionRequest
                    open={viewSheetOpen}
                    onClose={handleCloseSheet}
                    requisitionId={selectedRequisitionId}
                    onSuccess={() => {
                        fetchData(true);
                        handleCloseSheet();
                    }}
                />
            )}
        </div>
    );
};

export default EmiratizationRequisitions;