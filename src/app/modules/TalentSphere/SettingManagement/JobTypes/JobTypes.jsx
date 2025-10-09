import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getJobTypeList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { JobTypesColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";

const JobTypes = ({ reload }) => {
    const [JobTypeList, setJobTypeList] = useState({});
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
            const response = await getJobTypeList({
                filterData,
                options,
                ordering,
            });
            if (isMounted && response) {
                setJobTypeList(response);
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
               if (['created_at'].includes(filterName))
                    updatedFilters[filterName] = filterValue?.split(',');
                else updatedFilters[filterName] = filterValue;
            }
            return updatedFilters;
        });
    };

    return (
        <>
            <CardHeader>
                <CardTitle >Job Types</CardTitle>
                <CardDescription>
                    Here you can add, update, and delete different types of job contracts in the organization.
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
                                type: "date-range",
                                placeholder: "Creation Date",
                                name: "created_at",
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
                        columns={JobTypesColumns(fetchData)}
                        data={filteredData}
                        tableOptions={tableOptions}
                        dataTotalSize={JobTypeList?.count || 0}
                        pagination={true}
                        className="organization-table"
                    />
                )}
            </CardContent>
        </>
    );
};

export default JobTypes;
