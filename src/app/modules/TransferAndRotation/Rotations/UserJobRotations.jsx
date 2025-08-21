import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { CircleCheckBig, CircleX, FolderInput, Loader, } from "lucide-react";
import { Header } from "components";
import { getJobRotationRequests, getRotationStats } from "app/hooks/transferAndRotation";
import TableCustom from "components/CustomTable";
import { UserJobRotationColumns } from "app/modules/TransferAndRotation/Sections";
import { EmployeeOverview } from "components";
import { useLocation } from "react-router-dom";

export default function UserJobRotations() {
    const location = useLocation();
    const { user_Id } = location.state || {};
    const [MyTransferData, setMyTransferData] = useState({ results: [], count: 0, });
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const [ordering, setOrdering] = useState("-id");
    const [filterData, setFilterData] = useState({ employee: user_Id });
    const [statsData, setStatsData] = useState({});

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
        let isMounted = true;
        const fetchStatData = async () => {
            try {
                const filter = { employee: user_Id };
                const response = await getRotationStats({
                    filterData: filter,
                });

                if (response) {
                    setStatsData(response);
                }
            } catch (e) {
                console.error(e);
            }
        };
        if (user_Id) fetchStatData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [user_Id]);

    const fetchData = async (isMounted) => {
        try {
            const data = await getJobRotationRequests({
                options,
                filterData,
                ordering,
            });
            if (isMounted) {
                setMyTransferData(data);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [options, filterData, ordering]);


    const RotationStatsData = React.useMemo(() => [
        { label: "Total Tranfers", value: statsData.Total, icon: FolderInput },
        { label: "Pending", value: statsData.Pending, icon: Loader },
        { label: "Approved", value: statsData.Approved, icon: CircleCheckBig },
        { label: "Rejected", value: statsData.Rejected, icon: CircleX },
    ], [statsData]);

    // if (!user_Id) return null;

    return (
        <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}>
            <Header showBackButton={true} navigationLink="/tranfer-rotations" />
            <Card>
                <CardContent className='pt-6'>
                    <EmployeeOverview
                        id={user_Id}
                        showId={true}
                        showPosition={true}
                        showDepartment={true}
                    />
                </CardContent>
            </Card>
            <div className='flex gap-4 justify-start flex-row flex-wrap'>
                {RotationStatsData.map((stat, index) =>
                    <Card
                        key={`${index}`}
                        className="flex flex-col justify-center"
                    >
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-900">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-medium text-plum-900">
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Card>
                <CardContent>
                    <TableCustom
                        data={MyTransferData.results}
                        columns={UserJobRotationColumns(fetchData)}
                        pagination={true}
                        dataTotalSize={MyTransferData.count || 0}
                        tableOptions={tableOptions}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
