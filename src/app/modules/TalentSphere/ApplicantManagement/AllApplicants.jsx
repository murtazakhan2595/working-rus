import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getApplicantsList, getJobTypeList, getCareerLevelList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { ApplicationColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentApplicationSource } from "data/Data";

const AllApplicants = ({ reload, variant = 'all' }) => {
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
    // useEffect(() => {
    //     let isMounted = true;
    //     if (isMounted) {
    //         setFilterData((prevFilters) => {
    //             const updatedFilters = { ...prevFilters };
    //             if (variant === "all") {
    //                 delete updatedFilters['status'];
    //             } else if (variant === 'rejected') {
    //                 updatedFilters['status'] = 'rejected';
    //             } else if (variant === 'resume') {
    //                 updatedFilters['status'] = 'resume_bank';
    //             } else if (variant === 'screened') {
    //                 updatedFilters['status'] = 'screened';
    //             }
    //             return updatedFilters;
    //         });
    //     }
    //     return () => {
    //         isMounted = false;
    //     };
    // }, [variant]);
    const fetchData = async (isMounted) => {
        setIsLoading(true);
        try {
            const filters = {
                ...filterData,
                ...(variant === 'rejected' ? { status: 'rejected' } : {}),
            }
            const response = await getApplicantsList({
                filterData: filters,
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
        if (variant) fetchData(isMounted);
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
                <CardTitle >All Applicants</CardTitle>
                <CardDescription>
                    Here you can view application of all applicants applied on pusblished vacancies through all portals.
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
                                name: "department",
                                placeholder: "Department",
                            },
                            {
                                type: "select",
                                options: "nationalities",
                                name: "location",
                                placeholder: "Location",
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
                                    { value: 'new', label: 'New' },
                                    { value: 'rejected', label: "Rejected" },
                                    { value: 'resume_bank', label: "Resume Bank" },
                                    { value: 'screened', label: "Screened" },
                                ],
                                name: "status",
                                placeholder: "Status",
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
                            (variant === 'rejected' ? [{
                                type: "date-range",
                                name: "rejection_date",
                                placeholder: "Rejection Date",
                            },] : [])

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
                        columns={ApplicationColumns(fetchData, variant)}
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

export default AllApplicants;
