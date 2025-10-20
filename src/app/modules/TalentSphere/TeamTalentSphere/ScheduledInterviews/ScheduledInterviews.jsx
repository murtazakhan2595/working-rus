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

const ScheduledInterviews = ({ activeView = 'Upcoming Interviews' }) => {
    const { id: user_id, } = GetDispatchStateList("user_details", "emp") || {};
    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ panel_member: user_id });
    const [isLoading, setIsLoading] = useState(true);
    const [InterviewsList, setInterviewsList] = useState({});
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("scheduled_datetime");

    const OuterTabList = useMemo(() => {
        return ["All", "Upcoming Interviews"];
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
                ...(activeTab === "Upcoming Interviews" ? { status: 'scheduled', scheduled_date_range: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')] } : {}),
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

    const handleFilterChange = (filterName, filterValue) => {
        onPageChange("page", 1);
        setFilterData((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            // Handle other filters normally
            if (filterValue === "" || filterValue === null) {
                delete updatedFilters[filterName];
            } else {
                if (['scheduled_date_range'].includes(filterName))
                    updatedFilters[filterName] = filterValue?.split(',');
                else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const TabTitle = React.useMemo(() => {
        return {
            "Upcoming Interviews": { title: 'Upcoming Interviews', description: 'Here you view the list of the upcoming interviews scheduled today', },
            "All": { title: 'Upcoming Interviews', description: 'Here you view the list of all interviews scheduled', },
        };
    }, []);
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
                        <CardTitle className="text-primary">{TabTitle[activeTab].title}</CardTitle>
                        <CardDescription className="text-neutral-1100">
                            {TabTitle[activeTab].description}
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
                            ...(activeTab === "All"
                                ? [
                                    {
                                        type: "date-range",
                                        name: "scheduled_date_range",
                                        placeholder: "Interview Date",
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
