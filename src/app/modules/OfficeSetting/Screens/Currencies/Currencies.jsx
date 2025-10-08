import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getCurrencyList } from "app/hooks/officeSetting";
import { CardContent } from "components/ui/card";
import { CurrencysColumns } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription ,Card} from "components/ui/card";

const Currencys = ({ reload }) => {
    const [CurrencyList, setCurrencyList] = useState({});
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
            const response = await getCurrencyList({
                filterData,
                options,
                ordering,
            });
            if (isMounted && response) {
                setCurrencyList(response);
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
        <Card>
            <CardHeader>
                <CardTitle >Currencies</CardTitle>
                <CardDescription>
                    Here you can add, update, and delete organization currencies
                </CardDescription>
                {/* <div className="flex justify-end">
                    <FilterInput
                        filters={[
                            {
                                type: "search",
                                placeholder: "Search by name",
                                name: "name",
                            },
                            {
                                type: "select",
                                placeholder: "Status",
                                name: "status",
                                options:[{value:'Active',label:'Active'},{value:'Inactive',label:'Inactive'},]
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
                </div> */}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        columns={CurrencysColumns(fetchData)}
                        data={filteredData}
                        tableOptions={tableOptions}
                        dataTotalSize={CurrencyList?.count || 0}
                        pagination={true}
                        className="organization-table"
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default Currencys;
