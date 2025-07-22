import React, { useState, useEffect } from "react";
import { FilterInput } from "components/FormControl";
import { ExitRequestColumns } from "app/modules/ExitAndClearance/Sections";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "src/@/components/ui/tabs";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";

const ExitRequests = ({ reload, permittedViewFilterData,Filters }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Terminations");
  const [ExitRequestList, setExitRequestList] = useState(null);
  const [filterData, setFilterData] = useState({
    request_status: "PENDING",
    exit_category: "TERMINATION",
  });

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
      setLoading(true);
      const filter = { ...filterData, ...permittedViewFilterData, request_status: "PENDING" };
      const response = await getEmployeesResignations({
        filterData: filter,
        options,
        ordering,
      });
      setExitRequestList(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options, ordering, permittedViewFilterData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      onPageChange("page", 1);
      setOrdering("-id");
      fetchData(true);
    }
  }, [reload]);

  const handleTabChange = (tab) => {
    setFilterData((prevFilters) => {
      return {
        ...prevFilters,
        exit_category:
          tab === "Resignations"
            ? "RESIGNATION"
            : tab === "Terminations"
              ? "TERMINATION"
              : null,
      };
    });
  };

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
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        handleTabChange(tab);
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList>
          {["Terminations", "Resignations"].map((tab) => (
            <TabsTrigger key={tab} value={tab} variant={"inner-tab"}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <CardHeader>
        <CardTitle>{activeTab} Requests</CardTitle>
        <CardDescription>
          Here you can manage and {activeTab.toLowerCase()} requests of
          employees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={Filters}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={ExitRequestList?.results || []}
            columns={ExitRequestColumns(fetchData)}
            pagination={true}
            dataTotalSize={ExitRequestList?.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </Tabs>
  );
};

export default ExitRequests;
