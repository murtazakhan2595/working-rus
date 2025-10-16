import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { getEvaluationTypeList } from "app/hooks/officeSetting";
import { CardContent } from "components/ui/card";
import PageLoader from "../../../../../components/PageLoader";
import { EvaluationTypeColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { useSelector } from "react-redux";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const EvaluationType = ({ reload }) => {
  const [EvaluationTypeList, setEvaluationTypeList] = useState({});
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
      const response = await getEvaluationTypeList({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setEvaluationTypeList(response);
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
    <OfficeSettingPermissionWrapper
      permissions={OFFICE_SETTING_PERMISSIONS.GRACE_TIME.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-primary">Evaluation Type</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage evaution type for view and manage performance of employee. Add, edit, or delete evaluation type as needed.
            </CardDescription>
            <div className="flex justify-end">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search by name",
                    name: "name",
                  },
                ]}
                className="justify-end"
                onChange={handleFilterChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={EvaluationTypeColumn(fetchData)}
                data={filteredData}
                tableOptions={tableOptions}
                dataTotalSize={EvaluationTypeList?.count || 0}
                pagination={true}
                className="organization-table"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </OfficeSettingPermissionWrapper>
  );
};

export default EvaluationType;
