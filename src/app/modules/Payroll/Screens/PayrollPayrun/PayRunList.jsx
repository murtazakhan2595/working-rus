import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
} from "components/ui/card";
import { useNavigate } from "react-router-dom";
import { getPayun } from "app/hooks/payroll.jsx";
import { PayrunPayrollColumns } from "app/modules/Payroll/Sections";
import { TableCustom } from "components";

function PayRunList() {
  const navigate = useNavigate();
  const [PayRunData, setPayRunData] = useState([]);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filterData, setFilterData] = useState({ is_payroll_run: false });

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
    const data = await getPayun({ ordering, options, filterData });
    if (data && isMounted) {
      setPayRunData(data);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [ordering, options]);

  return (
    <>
      <Card>
        <CardContent>
          <TableCustom
            data={PayRunData.results || []}
            columns={PayrunPayrollColumns(fetchData)}
            pagination={true}
            dataTotalSize={PayRunData?.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
    </>
  );
}

export default PayRunList;
