import React, { useEffect, useState, useMemo } from "react";
import {
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { getOfferTrackingList } from "app/hooks/talentSphere";
import { OfferTrackingColumns } from "app/modules/TalentSphere/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { GetDispatchStateList } from "utils/Lists";
import { GlobalStatusOptions } from "data/Data";

const OffersSend = ({ isTeamView = false, activeView = "Pending", deepLinkFilterData, deepLinkSubTab }) => {
    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ status: 'pending' });
    const [isLoading, setIsLoading] = useState(true);
    const [OfferLetterList, setOfferLetterList] = useState();
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");

    const OuterTabList = useMemo(() => {
        return ["Pending", "Accepted", "Rejected", "Withdrawn", "Not Joined"];
    }, []);

    // Handle deep link filter data and sub-tab when navigating from dashboard
    useEffect(() => {
        if (deepLinkFilterData) {
            const convertedFilters = { ...deepLinkFilterData };

            setFilterData(convertedFilters);
            // Reset page to 1 when applying deep link filters
            onPageChange("page", 1);
        }

        // Set the active sub-tab if provided and update filterData accordingly
        if (deepLinkSubTab && OuterTabList.includes(deepLinkSubTab)) {
            setActiveTab(deepLinkSubTab);
            // Update filterData based on the sub-tab
            const statusValue = deepLinkSubTab === "Not Joined" ? "not_joined" : deepLinkSubTab.toLowerCase();
            setFilterData((prev) => ({
                ...prev,
                status: statusValue,
            }));
        }
    }, [deepLinkFilterData, deepLinkSubTab, OuterTabList]);

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
            const OfferLetterList = await getOfferTrackingList({ filterData, options, ordering, });
            if (OfferLetterList && isMounted) {
                setOfferLetterList(OfferLetterList);
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

    const handleFilterChange = (filterName, filterValue) => {
        onPageChange("page", 1);
        setFilterData((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            // Handle other filters normally
            if (filterValue === "" || filterValue === null) {
                delete updatedFilters[filterName];
            } else {
                if (filterName === "status")
                    updatedFilters[filterName] = filterValue.toLowerCase();
                else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const handleTabChange = (tab) => {
        if (tab === "Not Joined") {
            setFilterData((prev) => ({
                ...prev,
                status: "not_joined",
            }));
        } else {
            setFilterData((prev) => ({
                ...prev,
                status: tab.toLowerCase(),
            }));
        }
    };

    return (
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
                    <CardTitle className="text-primary">{activeTab} Offers</CardTitle>
                    <CardDescription className="text-neutral-1100">
                        Here you can {activeTab === 'Requests' ? 'view' : 'approve, or reject'} the offer letters
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                <FilterInput
                    filters={[
                        {
                            type: "search",
                            name: "candidate_name",
                            placeholder: "Applicant Name",
                        },
                        {
                            type: "search",
                            name: "candidate_name",
                            placeholder: "Job Title",
                        },
                        ...(activeTab === "Records"
                            ? [
                                {
                                    type: "select",
                                    options: [...GlobalStatusOptions(false),],
                                    name: "status",
                                    placeholder: "Status",
                                },
                                {
                                    type: "select",
                                    options: 'Employees',
                                    name: "approved_by",
                                    placeholder: "Approved By",
                                },
                                {
                                    type: "select",
                                    options: 'Employees',
                                    name: "rejected_by",
                                    placeholder: "Rejected By",
                                },
                                {
                                    type: "date-range",
                                    name: "approved_on",
                                    placeholder: "Approved On",
                                },
                                {
                                    type: "date-range",
                                    name: "rejected_on",
                                    placeholder: "Rejected On",
                                },
                            ]
                            : [
                                {
                                    type: "select",
                                    options: 'Employees',
                                    name: "generated_by",
                                    placeholder: "Generated By",
                                },
                                {
                                    type: "date-range",
                                    name: "generated_on",
                                    placeholder: "Generated On",
                                },
                            ]),
                    ]}
                    onChange={handleFilterChange}
                    className="justify-end mb-4"
                />
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        data={OfferLetterList?.results || []}
                        columns={OfferTrackingColumns(fetchData, activeTab)}
                        pagination={true}
                        dataTotalSize={OfferLetterList?.count || 0}
                        tableOptions={tableOptions}
                    />
                )}
            </CardContent>
        </Tabs>
    );
};

export default OffersSend;
