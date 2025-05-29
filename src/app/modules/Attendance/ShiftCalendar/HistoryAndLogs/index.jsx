import { getEmployeeCustomList } from "app/hooks/general";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "components/ui/card";
import { TableCustom } from "components";
import { HistoryColumns } from "./HistoryColumns";
import { useNavigate } from "react-router-dom";


export default function HistoryAndLogs() {
  const [employees, setEmployees] = useState({ results: [], count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const navigate = useNavigate();

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

  const fetchEmployees = async () => {
      try {
        const response = await getEmployeeCustomList(
          options,
          filterData,
          ordering
        );
        if (response) {
          setEmployees(response);
        }
      } catch (err) {
        console.error(err);
      }
    };
  useEffect(()=>{
    fetchEmployees();
  },[])
  console.log("Employees in HistoryAndLogs:", employees);
  return (
    <Card>
      <CardContent>
        <TableCustom
          data={employees.results}
          columns={HistoryColumns(navigate)}
          pagination={true}
          dataTotalSize={employees.count || 0}
          tableOptions={tableOptions}
        />
      </CardContent>
    </Card>
  );
}