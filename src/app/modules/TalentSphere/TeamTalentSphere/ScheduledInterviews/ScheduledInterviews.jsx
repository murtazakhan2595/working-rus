import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
    Card
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { getInterviewsList } from "app/hooks/talentSphere";
import { InProgressInterviewColumns } from "app/modules/TalentSphere/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { GlobalStatusOptions } from "data/Data";
import { GetDispatchStateList } from "utils/Lists";
import moment from "moment";

const ScheduledInterviews = ({ reload, activeView = 'Upcoming Interviews' }) => {
    const { id: user_id, } = GetDispatchStateList("user_details", "emp") || {};
    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ panel_member: user_id });
    const [isLoading, setIsLoading] = useState(true);
    const [InterviewsList, setInterviewsList] = useState({});
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");

    const OuterTabList = useMemo(() => {
        return ["Upcoming Interviews", "Conducted", "Completed"];
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

    const fetchData = useCallback(async (isMounted) => {
        try {
            setIsLoading(true);
            const filters = {
                ...filterData,
                ...(activeTab === "Upcoming Interviews" ? { status: 'scheduled', scheduled_date_range: [moment().startOf('week').format('YYYY-MM-DD'), moment().endOf('week').format('YYYY-MM-DD')] } : {}),
            };
            const InterviewsList = await getInterviewsList({
                filterData: filters,
                options,
                ordering,
            });
            if (InterviewsList && isMounted) {
                setInterviewsList(InterviewsList);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [filterData, options, ordering, activeTab]);

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [fetchData]);

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
                else if (filterName === 'requested_on')
                    updatedFilters[filterName] = filterValue?.split(',');
                else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };
    return (
        <Card>
            <Tabs
                defaultValue="Upcoming Interviews"
                className="w-full"
                onValueChange={(tab) => {
                    setActiveTab(tab);
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
                        <CardTitle className="text-primary">Headcount {activeTab}</CardTitle>
                        <CardDescription className="text-neutral-1100">
                            Here you can {activeTab === 'Requests' ? 'view' : 'approve, or reject'} manpower headcount requests submitted.
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
                                type: "search",
                                name: "requested_by_name",
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
                            data={InterviewsList?.results || []}
                            columns={InProgressInterviewColumns(fetchData, activeTab === 'Records', true)}
                            pagination={true}
                            dataTotalSize={InterviewsList?.count || 0}
                            tableOptions={tableOptions}
                        />
                    )}
                </CardContent>
            </Tabs>
        </Card>
    );
};

export default ScheduledInterviews;
