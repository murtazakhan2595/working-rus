import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getVacancyList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { PublishedVacancyColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { GlobalStatusOptions } from "data/Data";

const PublishedVacancies = ({ reload }) => {
    const [RequisitionList, setRequisitionList] = useState({});
    const [filterData, setFilterData] = useState({});
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [JobTypeList, setJobTypeList] = useState([]);
    const [CareerLevelList, setCareerLevelList] = useState([]);
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
            const response = await getVacancyList({
                filterData,
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
                if (filterName === 'requisition') {
                    const value = filterValue.replace(/\D/g, '');
                    if (value) updatedFilters[filterName] = parseInt(value);
                } else if (['due_date_range','publish_date_range'].includes(filterName)) {
                    updatedFilters[filterName] = filterValue?.split(',');
                } else updatedFilters[filterName] = filterValue;
            }
            return updatedFilters;
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle >Publish Vacancy for Approved Requisitions</CardTitle>
                <CardDescription>
                    Here you can view all the published vacancy for approved recruitment requisitions
                </CardDescription>
                <div className="flex justify-end">
                    <FilterInput
                        filters={[
                            {
                                type: "search",
                                name: "requisition",
                                placeholder: "Requisition",
                            },
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
                                    { value: 'internal', label: 'Internal' },
                                    { value: 'external', label: "External" },
                                    { value: 'both', label: "Both" },
                                ],
                                name: "requisition_type",
                                placeholder: "Requisition Type",
                            },
                            {
                                type: "date-range",
                                name: "publish_date_range",
                                placeholder: "Pulish date",
                            },
                            {
                                type: "date-range",
                                name: "due_date_range",
                                placeholder: "Due date",
                            },
                            {
                                type: "select",
                                options: [
                                    { value: 'published', label: 'Published' },
                                    { value: 'closed', label: "Closed" },
                                ],
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
                        columns={PublishedVacancyColumns(fetchData)}
                        data={RequisitionList.results || []}
                        tableOptions={tableOptions}
                        dataTotalSize={RequisitionList?.count || 0}
                        pagination={true}
                    />
                )}
            </CardContent>
        </>
    );
};

export default PublishedVacancies;
