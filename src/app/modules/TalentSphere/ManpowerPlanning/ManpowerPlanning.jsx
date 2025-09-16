import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { AddUpdateManpower } from "app/modules/TalentSphere";
import { CircleCheckBig, CircleX, FolderInput, Loader, } from "lucide-react";
import { Header } from "components";
import { getJobRotationRequests, getRotationStats } from "app/hooks/transferAndRotation";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { JobRotationColumns } from "app/modules/TransferAndRotation/Sections";

export default function ManpowerPlanning() {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [MyTransferData, setMyTransferData] = useState({
    results: [],
    count: 0,
  });
  const [OpenRotationForm, setOpenRotationForm] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [OpenManpowerForm, setOpenManpowerForm] = useState(false);
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
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStatData = async () => {
      try {
        const filter = { employee_id: userId };
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
    if (userId) fetchStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [userId]);

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


  const TransferStatsData = React.useMemo(() => [
    { label: "Total Tranfers", value: statsData.Total, icon: FolderInput },
    { label: "Pending", value: statsData.Pending, icon: Loader },
    { label: "Approved", value: statsData.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: statsData.Rejected, icon: CircleX },
  ], [statsData]);

  const HeaderButton = () => {
    const handleRequestClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenManpowerForm(false);
      const triggeredResquest = event.target.title;
      if (triggeredResquest === 'manpower')
        setOpenManpowerForm(true);
    }
    return (
      <Button title="manpower" onClick={handleRequestClick}>
        Add Manpower
      </Button>
    )
  }

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={<HeaderButton />}
      />
      <Stats stats={TransferStatsData} />
      <Card>
        <CardHeader>
          <CardTitle>Manpower Planning</CardTitle>
          <CardDescription>Here you can add, and view planned headcount, budgets, and justifications for manpower allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <TableCustom
            data={MyTransferData.results}
            columns={JobRotationColumns(fetchData)}
            pagination={true}
            dataTotalSize={MyTransferData.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
      {OpenManpowerForm && (
        <AddUpdateManpower
          isOpen={OpenManpowerForm}
          setIsOpen={() => {
            setOpenManpowerForm(false);
            fetchData(true);
          }}
          isAdminView={true}
          isEmployee={true}
        />
      )}
    </div>
  );
}
