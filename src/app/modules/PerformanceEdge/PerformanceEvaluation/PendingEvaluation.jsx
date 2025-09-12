import React, { useState, useEffect } from "react";
import { getPendingEvaluation } from "app/hooks/performanceEdge";
import { CreateUpdateCycleForm } from "app/modules/PerformanceEdge";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Card,
} from "components/ui/card";
import { TableCustom, PageLoader, Header } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { FilterInput } from "components/FormControl";
import { PendingEvaluationColumns } from "app/modules/PerformanceEdge/Sections";
import { Button } from "components/ui/button";

const PendingEvaluation = ({ reload }) => {
    const Designations = GetDispatchStateList("designations", "common") || [];
    const Departments = GetDispatchStateList("departments", "common") || [];
    const [isLoading, setIsLoading] = useState(true);
    const [OpenCreateCycleForm, setOpenCreateCycleForm] = useState(false);
    const [PendingEvaluations, setPendingEvaluations] = useState(null);
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
            };
            const response = await getPendingEvaluation({
                filterData: filter,
                options,
                ordering,
            });
            setPendingEvaluations(response);
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


    const safeDepartments = (Departments || []).filter(
        (d) => d && typeof d.label === "string"
    );
    const safeDesignations = (Designations || []).filter(
        (d) => d && typeof d.label === "string"
    );
    const handleRequestClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenCreateCycleForm(false);

        const triggeredResquest = event.target.title;
        if (triggeredResquest === 'create-cycle')
            setOpenCreateCycleForm(true);
    }
    return (
        <>
            <CardHeader>
                <CardTitle>Pending Evaluations</CardTitle>
                <CardDescription>
                    Here you view the pending evaluation of your team members
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FilterInput
                    filters={[]}
                    onChange={handleFilterChange}
                    className="justify-end mb-4"
                />
                {isLoading ? (
                    <PageLoader />
                ) : (
                    <TableCustom
                        data={PendingEvaluations?.results || []}
                        columns={PendingEvaluationColumns(fetchData)}
                        pagination={true}
                        dataTotalSize={PendingEvaluations?.count || 0}
                        tableOptions={tableOptions}
                    />
                )}
            </CardContent>
        </>
    );
};

export default PendingEvaluation;
