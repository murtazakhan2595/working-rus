import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getInterviewsList, getInterviewTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { InProgressInterviewColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentApplicationSource,RecruitmentApplicantStatusOption } from "data/Data";

const InProgressInterviews = ({ reload, variant = 'all' }) => {
    const [ResumeBankList, setResumeBankList] = useState({});
    const [filterData, setFilterData] = useState({});
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [isLoading, setIsLoading] = useState(false);
    const [InterviewTypeList, setInterviewTypeList] = useState([]);
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
                    const job_type = await getInterviewTypeList();
                    if (isMounted) {
                        setInterviewTypeList(job_type.results);
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
            const filters = {
                ...filterData,
            }
            const response = await getInterviewsList({
                filterData: filters,
                options,
                ordering,
            });
            if (isMounted && response) {
                setResumeBankList(response);
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
                if (filterName === 'emiratization_flag')
                    updatedFilters[filterName] = filterValue === 'required' ? true : false;
                else updatedFilters[filterName] = filterValue;
            }
            return updatedFilters;
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle >In Progress Interviews</CardTitle>
                <CardDescription>
                    Here you can view details, update candidate status, schedule follow-up interviews, collect feedback from interview panellists, and manage the entire interview lifecycle efficiently all candidates whose interviews have been scheduled.
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
                                options: InterviewTypeList,
                                name: "interview_type",
                                placeholder: "Interview Type",
                            },
                            {
                                type: "select",
                                options: RecruitmentApplicantStatusOption,
                                name: "status",
                                placeholder: "Status",
                            },
                            {
                                type: "select-multiple",
                                options: 'employees',
                                name: "panel",
                                placeholder: "Panel Members",
                            },
                            {
                                type: "date-range",
                                name: "application_date",
                                placeholder: "Application Date",
                            },
                            {
                                type: "date-range",
                                name: "scheduled_datetime",
                                placeholder: "Scheduled Date",
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
                        columns={InProgressInterviewColumns(fetchData, variant)}
                        data={ResumeBankList.results || []}
                        tableOptions={tableOptions}
                        dataTotalSize={ResumeBankList?.count || 0}
                        pagination={true}
                    />
                )}
            </CardContent>
        </>
    );
};

export default InProgressInterviews;
