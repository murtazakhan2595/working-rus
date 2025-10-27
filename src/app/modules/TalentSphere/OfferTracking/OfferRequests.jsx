import React, { useEffect, useState, useMemo } from "react";
import {
    CardContent,
    CardDescription,
    CardTitle,
    CardHeader,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { getOfferLetterList } from "app/hooks/talentSphere";
import { OfferLetterRequestColumns } from "app/modules/TalentSphere/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { GlobalStatusOptions } from "data/Data";

const OfferRequests = ({ activeView = "Requests", deepLinkFilterData, deepLinkSubTab }) => {
    const [activeTab, setActiveTab] = useState(activeView);
    const [filterData, setFilterData] = useState({ status: ["pending_approval", "draft"] });
    const [isLoading, setIsLoading] = useState(true);
    const [OfferLetterList, setOfferLetterList] = useState();
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");

    const OuterTabList = useMemo(() => {
        return ["Requests", "Records"];
    }, []);

    // Handle deep link filter data and sub-tab when navigating from dashboard
    useEffect(() => {
        if (deepLinkFilterData) {
            const convertedFilters = { ...deepLinkFilterData };

            setFilterData(convertedFilters);
            // Reset page to 1 when applying deep link filters
            onPageChange("page", 1);
        }

        // Set the active sub-tab if provided
        if (deepLinkSubTab && OuterTabList.includes(deepLinkSubTab)) {
            setActiveTab(deepLinkSubTab);
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
            const OfferLetterList = await getOfferLetterList({ filterData, options, ordering, });
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
                if (filterName === "status") {
                    if (activeTab === "Requests") {
                        updatedFilters[filterName] = ["pending_approval", "draft"];
                    } else if (activeTab === "Records") {
                        updatedFilters[filterName] = ["approved", "rejected"];
                    }
                } else delete updatedFilters[filterName];
            } else {
                if (filterName === "status") {
                    const status = filterValue.toLowerCase();
                    if (status === 'sent') {
                        updatedFilters['is_offer_sent'] = true;
                        updatedFilters[filterName] = 'approved';
                    } else {
                        delete updatedFilters['is_offer_sent'];
                        updatedFilters[filterName] = status;
                        if (status === 'approved')
                            updatedFilters['is_offer_sent'] = false;
                    };
                } else updatedFilters[filterName] = filterValue;
            }

            return updatedFilters;
        });
    };

    const handleTabChange = (tab) => {
        if (tab === "Requests") {
            setFilterData((prev) => ({
                ...prev,
                status: ["pending_approval", "draft"],
            }));
        } else if (tab === "Records") {
            setFilterData((prev) => ({
                ...prev,
                status: ["approved", "rejected"],
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
                    <CardTitle className="text-primary">Offer Letter {activeTab}</CardTitle>
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
                        {
                            type: "select",
                            name: "ai_confidence_score",
                            placeholder: "AI Confidence Score Range",
                            options: [
                                { label: 'Low Confidence <50%', value: [0, 49.99] },
                                { label: 'Medium Confidence 50% - 80%', value: [50, 79.999] },
                                { label: 'High Confidence >=80%', value: [80, 100] },
                            ]
                        },
                        ...(activeTab === "Records"
                            ? [
                                {
                                    type: "select",
                                    options: [...GlobalStatusOptions(false), { label: 'Sent', value: 'sent' }],
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
                                {
                                    type: "select",
                                    options: [{ label: "Draft", value: 'draft' }, { label: 'Pending', value: 'pending_approval' }],
                                    name: "status",
                                    placeholder: "Status",
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
                        columns={OfferLetterRequestColumns(fetchData, activeTab === 'Records')}
                        pagination={true}
                        dataTotalSize={OfferLetterList?.count || 0}
                        tableOptions={tableOptions}
                    />
                )}
            </CardContent>
        </Tabs>
    );
};

export default OfferRequests;
