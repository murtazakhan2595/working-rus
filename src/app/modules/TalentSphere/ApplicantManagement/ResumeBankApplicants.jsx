import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getResumeBankApplicantList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { ResumeBankColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentApplicationSource } from "data/Data";

const ResumeBankApplicants = ({ reload, variant = 'all' }) => {
    const [ResumeBankList, setResumeBankList] = useState({});
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

    const fetchData = async (isMounted) => {
        setIsLoading(true);
        try {
            const filters = {
                ...filterData,
            }
            const response = await getResumeBankApplicantList({
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
                <CardTitle >Resume Bank Applicants</CardTitle>
                <CardDescription>
                    Here you can view application of all applicants that are added in resume bank.
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
                                type: "search",
                                name: "candidate_name_or_id",
                                placeholder: "Candidate Name/Id",
                            },
                            {
                                type: "select",
                                options: "Departments",
                                name: "recommended_department",
                                placeholder: "Recommended Department",
                            },
                            {
                                type: "select",
                                options: "designations",
                                name: "recommended_designation",
                                placeholder: "Recommended Designation",
                            },
                            {
                                type: "select",
                                options: RecruitmentApplicationSource,
                                name: "application_source",
                                placeholder: "Application Source",
                            },
                            {
                                type: "select",
                                options: [
                                    { value: 'required', label: 'Required' },
                                    { value: 'not_required', label: "Not Reqiured" },
                                    { value: 'remote', label: "Remote" },
                                ],
                                name: "emiratization_flag",
                                placeholder: "Emiratization Role",
                            },
                            {
                                type: "date-range",
                                name: "application_date",
                                placeholder: "Application Date",
                            },
                            {
                                type: "date-range",
                                name: "added_on",
                                placeholder: "Added On Date",
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
                        columns={ResumeBankColumns(fetchData, variant)}
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

export default ResumeBankApplicants;
