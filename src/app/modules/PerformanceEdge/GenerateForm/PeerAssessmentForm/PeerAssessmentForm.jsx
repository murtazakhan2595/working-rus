import React, { useState, useEffect } from "react";
import { getEvaluationFormsList, } from "app/hooks/performanceEdge";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { FilterInput } from "components/FormControl";
import { SelfAssessmentFormColumns } from "app/modules/PerformanceEdge/GenerateForm/Sections";

const PeerAssessmentForm = ({ reload }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [PeerAssessmentList, setPeerAssessmentList] = useState(null);
    const [filterData, setFilterData] = useState({});

    const [ordering, setOrdering] = useState("-id");

    const [options, setOptions] = useState({
        page: 1,
        sizePerPage: 10,
    });

    const onPageChange = (name, value) => {
        const pageOptions = options;
        if (pageOptions[name] !== value) {
            pageOptions[name] = value;
            setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
        }
    };

    const tableOptions = {
        page: options.page,
        sizePerPage: options.sizePerPage,
        onPageChange: onPageChange,
        onSortChange: (sortName) => {
            setOrdering(sortName);
        },
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const filter = {
                ...filterData,
                form_type: "PeerAssessmentForm",
            };
            const response = await getEvaluationFormsList({
                filterData: filter,
                options,
                ordering,
            });
            setPeerAssessmentList(response);
        } catch (e) {
            console.error(e);
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

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            onPageChange("page", 1);
            setOrdering("-id");
            fetchData(true);
        }
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
                <CardTitle>Peer Assessment Forms</CardTitle>
                <CardDescription>

                </CardDescription>
            </CardHeader>
            <CardContent>
                <FilterInput
                    filters={[
                        {
                            type: "search",
                            name: "employee",
                            placeholder: "Form Name",
                        },
                    ]}
                    onChange={handleFilterChange}
                    className="justify-end mb-4"
                />
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        data={PeerAssessmentList?.results || []}
                        columns={SelfAssessmentFormColumns(fetchData)}
                        pagination={true}
                        dataTotalSize={PeerAssessmentList?.count || 0}
                        tableOptions={tableOptions}
                    />
                )}
            </CardContent>

        </>
    );
};

export default PeerAssessmentForm;
