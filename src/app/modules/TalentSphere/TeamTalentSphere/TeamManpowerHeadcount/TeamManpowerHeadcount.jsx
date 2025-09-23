import React, { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getManpowerPlanningList } from "app/hooks/talentSphere";
import { FilterInput } from "components/FormControl";
import { ManpowerPlanningColumns } from "app/modules/TalentSphere/Sections";
import { yearsDropdownList } from 'utils/Lists';

export default function ManpowerHeadcount() {
    const [ManpowerPlanningList, setManpowerPlanningList] = useState({
        results: [],
        count: 0,
    });
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");
    const [filterData, setFilterData] = useState({ });
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
            const data = await getManpowerPlanningList({
                options,
                filterData,
                ordering,
            });
            if (isMounted) {
                setManpowerPlanningList(data);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [options, filterData, ordering]);


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
    const YearsDropdown = React.useMemo(() => yearsDropdownList(2020, 2030), []);

    return (
        <>
            <CardHeader>
                <CardTitle>Manpower Planning</CardTitle>
                <CardDescription>Here you can add, and view planned headcount, budgets, and justifications for manpower allocation</CardDescription>
            </CardHeader>
            <CardContent>
                <FilterInput
                    filters={[
                        {
                            type: "select-multiple",
                            options: YearsDropdown,
                            name: "fiscal_year",
                            placeholder: "Fascal Year",
                        },
                        {
                            type: "select",
                            options: "departments",
                            name: "department",
                            placeholder: "Department",
                        },
                        {
                            type: "select",
                            options: "branches",
                            name: "new_branch",
                            placeholder: "Branch",
                        },
                    ]}
                    onChange={handleFilterChange}
                    className="justify-end mb-4"
                />
                {isLoading ? <PageLoader />
                    : (
                        <TableCustom
                            data={ManpowerPlanningList.results}
                            columns={ManpowerPlanningColumns(fetchData)}
                            pagination={true}
                            dataTotalSize={ManpowerPlanningList.count || 0}
                            tableOptions={tableOptions}
                        />
                    )
                }
            </CardContent>
        </>
    );
}
