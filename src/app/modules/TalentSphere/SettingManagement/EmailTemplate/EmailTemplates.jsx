import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getEmailTemplateList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { EmailTemplatesColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentEmailTemplateType } from "data/Data";

const EmailTemplates = ({ reload }) => {
    const [EmailTemplateList, setEmailTemplateList] = useState({});
    const [filterData, setFilterData] = useState({});
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            const response = await getEmailTemplateList({
                filterData,
                options,
                ordering,
            });
            if (isMounted && response) {
                setEmailTemplateList(response);
                setFilteredData(response.results || []);
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
                updatedFilters[filterName] = filterValue;
            }
            return updatedFilters;
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle >Email Templates</CardTitle>
                <CardDescription>
                    Here you can add, update, and delete predefined email templates So that emails are automatically sent to applicants during different recruitment stages without writing emails manually each time.
                </CardDescription>
                <div className="flex justify-end">
                    <FilterInput
                        filters={[
                            {
                                type: "search",
                                placeholder: "Search by name",
                                name: "name",
                            },
                            {
                                type: "select",
                                placeholder: "Template Type",
                                name: "template_type",
                                options: RecruitmentEmailTemplateType,
                            },
                            {
                                type: "select",
                                placeholder: "Created By",
                                name: "created_by",
                                options: 'employees',
                            },
                            {
                                type: "select",
                                placeholder: "Status",
                                name: "status",
                                options: [{ value: true, label: 'Active' }, { value: false, label: 'Inactive' },]
                            },
                            {
                                type: "date-range",
                                placeholder: "Creation Date",
                                name: "created_on",
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
                        columns={EmailTemplatesColumns(fetchData)}
                        data={filteredData}
                        tableOptions={tableOptions}
                        dataTotalSize={EmailTemplateList?.count || 0}
                        pagination={true}
                        className="organization-table"
                    />
                )}
            </CardContent>
        </>
    );
};

export default EmailTemplates;
