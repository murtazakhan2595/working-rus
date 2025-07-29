import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import {
  MyTransfersColumns,
  TransferForm,
  EmployeeTransferDetails,
} from "app/modules/TransferAndRotation/Transfers/Sections";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import { getEmployeeTransferList } from "app/hooks/employeeTransfer";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";

export default function MyTransfers() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [MyTransferData, setMyTransferData] = useState({
    results: [],
    count: 0,
  });
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [activeExternalTab, setActiveExternalTab] = useState("Internal");
  const [activeInternalTab, setActiveInternalTab] = useState("Requests");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [OpenTransferDetailID, setOpenTransferDetailID] = useState(false);
  const Departments = useSelector((state) => state.common.departments);
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({ employee_id: userId });

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

  const statsData = [
    { label: "Total", value: 0, icon: UsersRound },
    { label: "Approved", value: 0, icon: Contact },
    { label: "Rejected", value: 0, icon: UserRoundCheck },
  ];

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
      <Stats stats={statsData} />
      <Card>
        <CardContent>
          <TableCustom
            data={MyTransferData.results}
            columns={MyTransfersColumns}
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
