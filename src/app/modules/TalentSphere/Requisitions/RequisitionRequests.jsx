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
import { getRequisitionRequestList, getRequisitionStats } from "app/hooks/talentSphere";
import { RequisitionRequestColumns } from "app/modules/TalentSphere/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { GetDispatchStateList } from "utils/Lists";
import { GlobalStatusOptions } from "data/Data";

const RequisitionRequests = ({ isTeamView = false, activeView = "Requests" }) => {
    const {
        id: user_id,
        branch_id: user_branch,
        department_name: user_department,
    } = GetDispatchStateList("user_details", "emp") || {};

    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [HeadCountRequestList, setHeadCountRequestList] = useState({});
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");
    const [statsData, setStatsData] = useState({});

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

    const fetchData = async (isMounted) => {
        try {
            setIsLoading(true);
            const HeadCountRequestList = await getRequisitionRequestList({ filterData, options, ordering, });
            if (HeadCountRequestList && isMounted) {
                setHeadCountRequestList(HeadCountRequestList);
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

    useEffect(() => {
        let isMounted = true;
        const fetchStatData = async () => {
            setIsLoading(true);
            try {
                const response = await getRequisitionStats({ filterData: { approval_required: true } });
                if (response) {
                    setStatsData(response);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

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
                            "approved,rejected";
                    }
                } else delete updatedFilters[filterName];
            } else {
                if (filterName === "status")
                    updatedFilters[filterName] = filterValue.toLowerCase();
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
                status: "approved,rejected",
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
                        className="flex flex-col justify-center w-[18%] min-w-[150px]"
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
                                    type: "select-multiple",
                                    options: "Departments",
                                    name: "department",
                                    placeholder: "Department",
                                },
                                {
                                    type: "select-multiple",
                                    options: 'Branches',
                                    name: "branch",
                                    placeholder: "Branch",
                                },
                                {
                                    type: "select",
                                    options: 'Employees',
                                    name: "requested_by",
                                    placeholder: "Requested By",
                                },
                                {
                                    type: "date-range",
                                    name: "requested_on",
                                    placeholder: "Requested Date",
                                },
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
                                data={HeadCountRequestList?.results || []}
                                columns={RequisitionRequestColumns(fetchData, activeTab === 'Records', isTeamView)}
                                pagination={true}
                                dataTotalSize={HeadCountRequestList?.count || 0}
                                tableOptions={tableOptions}
                            />
                        )}
                    </CardContent>
                </Tabs>
            </Card>
        </>
    );
};

export default RequisitionRequests;
