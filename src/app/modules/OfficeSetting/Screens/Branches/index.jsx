import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { getBranchList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import PageLoader from "../../../../../components/PageLoader";
import { BranchColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";

const Branches = ({
  options,
  setOptions,
  loading,
  getDepartments,
  department,
}) => {
  const [Branches, setBranches] = useState({});

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  useEffect(() => {
    getDepartments();
  }, [options]);

  const fetchData = async (isMounted) => {
    try {
      const response = await getBranchList();
      if (isMounted && response) {
        setBranches(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              columns={BranchColumn}
              data={Branches?.results || []}
              tableOptions={tableOptions}
              dataTotalSize={Branches?.count || 0}
              pagination={true}
              className="organization-table"
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Branches;
