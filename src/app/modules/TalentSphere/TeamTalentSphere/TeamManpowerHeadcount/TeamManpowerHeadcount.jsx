import React, { useEffect, useState } from "react";
import { CardContent, CardHeader, CardTitle, CardDescription ,Card} from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { getManpowerPlanningList } from "app/hooks/talentSphere";
import { FilterInput } from "components/FormControl";
import { ManpowerHeadcountOverviewColumns } from "app/modules/TalentSphere/Sections";
import { yearsDropdownList, GetDispatchStateList } from 'utils/Lists';

export default function TeamManpowerHeadcount() {
    const {
        id: user_id,
        branch_id: user_branch,
        department_name: user_department,
    } = GetDispatchStateList("user_details", "emp") || {};
    const [ManpowerPlanningList, setManpowerPlanningList] = useState({
        results: [],
        count: 0,
    });
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");
    const [filterData, setFilterData] = useState({});
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
                filterData: { ...filterData, branch: user_branch, fiscal_year:(new Date()).getFullYear() },
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
        <Card>
            <CardHeader>
                <CardTitle>Manpower Headcount Overview</CardTitle>
                <CardDescription>Here you can view overview of manpower headcount for all the departments</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <PageLoader />
                    : (
                        <TableCustom
                            data={ManpowerPlanningList.results}
                            columns={ManpowerHeadcountOverviewColumns}
                            pagination={true}
                            dataTotalSize={ManpowerPlanningList.count || 0}
                            tableOptions={tableOptions}
                        />
                    )
                }
            </CardContent>
        </Card>
    );
}
