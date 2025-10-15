import React, { useEffect, useState, useMemo } from "react";
import {
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
    Card,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { getRequisitionRequestList, getRequisitionStats, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { RequisitionRequestColumns } from "app/modules/TalentSphere/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { GlobalStatusOptions } from "data/Data";
import { ViewRequisitionRequest } from "app/modules/TalentSphere";
import { GetDispatchStateList } from "utils/Lists";

const RequisitionRequests = ({ reload, isTeamView = false, activeView = "Requests", deepLinkRequisition, deepLinkAction }) => {
    const Employees = GetDispatchStateList("employees", "emp");
    const { id: user_id, } = GetDispatchStateList("user_details", "emp") || {};
    const Currencies = GetDispatchStateList("currencies", "common");
    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ status: 'pending' });
    const [isLoading, setIsLoading] = useState(true);
    const [RequisitionList, setRequisitionList] = useState({});
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");
    const [statsData, setStatsData] = useState({});
    const [JobTypeList, setJobTypeList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);

    // State for auto-opening detail sheet
    const [viewSheetOpen, setViewSheetOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState(null);
    const [hasAutoOpened, setHasAutoOpened] = useState(false);

    // Handle deep link filtering
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

    const OuterTabList = useMemo(() => {
        return ["Requests", "Records"];
    }, []);

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
                const job_type = await getJobTypeList();
                const careere_level = await getCareerLevelList();
                if (isMounted) {
                    setJobTypeList(job_type.results);
                    setCareerLevelList(careere_level.results);
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
        try {
            setIsLoading(true);
            const filters = {
                ...filterData,
                ...(isTeamView ? { requested_by: user_id } : {}),
                approval_required: true
            }
            const RequisitionList = await getRequisitionRequestList({ filterData: filters, options, ordering, });
            if (RequisitionList && isMounted) {
                setRequisitionList(RequisitionList);
            }
        } catch (error) {
            console.log(error);
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

    const fetchStatData = async () => {
        try {
            const response = await getRequisitionStats({
                filterData: {
                    approval_required: true,
                    ...(isTeamView ? { requested_by: user_id } : {}),
                }
            });
            if (response) {
                setStatsData(response);
            }
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        let isMounted = true;
        fetchStatData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [reload]);

    useEffect(() => {
        let isMounted = true;
        onPageChange("page", 1);
        setOrdering("-id");
        fetchData(isMounted);
        fetchStatData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [reload]);

    const handleFilterChange = (filterName, filterValue) => {
        onPageChange("page", 1);
        setFilterData((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            // Handle other filters normally
            if (filterValue === "" || filterValue === null) {
                if (filterName === "status") {
                    if (activeTab === "Requests") {
                        updatedFilters[filterName] = "pending";
                    } else if (activeTab === "Records") {
                        updatedFilters[filterName] =
                            ["approved", "rejected"];
                    }
                } else delete updatedFilters[filterName];
            } else {
                if (filterName === "status")
                    updatedFilters[filterName] = filterValue.toLowerCase();
                else if (['created_at'].includes(filterName))
                    updatedFilters[filterName] = filterValue?.split(',');
                else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const handleTabChange = (tab) => {
        if (tab === "Requests") {
            setFilterData((prev) => ({
                ...prev,
                status: "pending",
            }));
        } else if (tab === "Records") {
            setFilterData((prev) => ({
                ...prev,
                status: ["approved", "rejected"],
            }));
        }
    };

    const RotationStatsData = React.useMemo(() => [
        { label: "Total", value: statsData.Total },
        { label: "Pending", value: statsData.Pending },
        { label: "Draft", value: statsData.Draft },
        { label: "Approved", value: statsData.Approved },
        { label: "Rejected", value: statsData.Rejected },
    ], [statsData]);

    return (
        <>
            <div className='flex gap-4 justify-start flex-row flex-wrap mb-4'>
                {RotationStatsData.map((stat, index) =>
                    <Card
                        key={`${index}`}
                        className="flex flex-col justify-center w-[18%] min-w-[100px]"
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-900">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-medium text-plum-900">
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Card>
                <Tabs
                    defaultValue="Requests"
                    className="w-full"
                    onValueChange={(tab) => {
                        setActiveTab(tab);
                        handleTabChange(tab);
                    }}
                    value={activeTab}
                >
                    <TabsList>
                        {OuterTabList.map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                variant="inner-tab"
                            >
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <CardHeader className="flex flex-row justify-between items-center gap-4">
                        <div>
                            <CardTitle className="text-primary">Requisition {activeTab}</CardTitle>
                            <CardDescription className="text-neutral-1100">
                                Here you can {activeTab === 'Records' ? 'view' : 'view, approve, or reject'} requisition requests submitted.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
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
                                    options: Currencies,
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
                                ...(!isTeamView ? [{
                                    type: "select",
                                    name: "requested_by",
                                    options: Employees,
                                    placeholder: "Requested By",
                                },
                                {
                                    type: "date-range",
                                    placeholder: "Request Date",
                                    name: "created_at",
                                },] : []),
                                ...(activeTab === "Records"
                                    ? [
                                        {
                                            type: "select",
                                            options: [...GlobalStatusOptions(false),],
                                            name: "status",
                                            placeholder: "Status",
                                        },
                                    ]
                                    : []),
                            ]}
                            onChange={handleFilterChange}
                            className="justify-end mb-4"
                        />
                        {isLoading ? (
                            <PageLoader />
                        ) : (
                            <TableCustom
                                data={RequisitionList?.results || []}
                                columns={RequisitionRequestColumns(fetchData, activeTab === 'Records', isTeamView)}
                                pagination={true}
                                dataTotalSize={RequisitionList?.count || 0}
                                tableOptions={tableOptions}
                            />
                        )}
                    </CardContent>
                </Tabs>
            </Card>

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
                    isTeamView={isTeamView}
                />
            )}
        </>
    );
};

export default RequisitionRequests;
