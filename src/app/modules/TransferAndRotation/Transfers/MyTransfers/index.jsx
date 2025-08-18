import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import {
  MyTransfersColumns,
  TransferForm,
  EmployeeTransferDetails,
} from "app/modules/TransferAndRotation/Transfers/Sections";
import { CircleCheckBig, CircleX, FolderInput, Loader, } from "lucide-react";
import { Header } from "components";
import { getEmployeeTransferList, getEmployeeTransferStats } from "app/hooks/transferAndRotation";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { TransferColumns } from "app/modules/TransferAndRotation/Sections";

export default function MyTransfers() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [MyTransferData, setMyTransferData] = useState({
    results: [],
    count: 0,
  });
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [OpenTransferDetailID, setOpenTransferDetailID] = useState(false);
  const Departments = useSelector((state) => state.common.departments);
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({ employee_id: userId });
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
    onRowClick: (row) => {
      setOpenTransferDetailID(row.id);
    },
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStatData = async () => {
      try {
        const filter = { employee_id: userId };
        const response = await getEmployeeTransferStats({
          filterData: filter,
        });

        if (response) {
          setStatsData(response);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (userId) fetchStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const fetchData = async (isMounted) => {
    try {
      const data = await getEmployeeTransferList({
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


  const TransferStatsData = React.useMemo(() => [
    { label: "Total Tranfers", value: statsData.Total, icon: FolderInput },
    { label: "Pending", value: statsData.Pending, icon: Loader },
    { label: "Approved", value: statsData.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: statsData.Rejected, icon: CircleX },
  ], [statsData]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenTransferForm(true);
            }}
          >
            Request Transfer
          </Button>
        }
      />
      <Stats stats={TransferStatsData} />
      <Card>
        <CardContent>
          <TableCustom
            data={MyTransferData.results}
            columns={TransferColumns(fetchData)}
            pagination={true}
            dataTotalSize={MyTransferData.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
      {OpenTransferDetailID && (
        <EmployeeTransferDetails
          transferID={OpenTransferDetailID}
          isOpen={!!OpenTransferDetailID}
          setIsOpen={() => {
            setOpenTransferDetailID(null);
          }}
          TransferList={MyTransferData.results}
          reloadData={fetchData}
          readOnlyMode={true}
        />
      )}
      {OpenTransferForm && (
        <TransferForm
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            fetchData(true);
          }}
          isEmployee={true}
        />
      )}
    </div>
  );
}
