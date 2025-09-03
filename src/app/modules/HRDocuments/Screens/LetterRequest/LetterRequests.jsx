import React, { useEffect, useState, useCallback } from "react";
import { CardHeader, CardContent } from "components/ui/card";
import { getLetterRequestList } from "app/hooks/hrDocuments";
import { LetterRequestColumns } from "app/modules/HRDocuments/Screens/LetterRequest/LetterRequestColumn";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import TableCustom from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { PageLoader } from "components";

export default function LetterRequests({ reload }) {
  const [isLoading, setIsLoading] = useState(true);
  const [letterRequestsData, setLetterRequestsData] = useState({
    results: [],
    count: 0,
  });
  const [activeTab, setActiveTab] = useState("requests");

  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});

  const LetterRequestTabs = [
    {
      title: "Requests",
      label: "Requests",
      value: "requests",
      description:
        "Here you can view all pending letter requests from employees.",
    },
    {
      title: "Records",
      label: "Records",
      value: "records",
      description:
        "Here you can view all processed letter requests (accepted/rejected).",
    },
  ];

  const [activeTabDetails, setActiveTabDetails] = useState(
    LetterRequestTabs[0]
  );

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

  const fetchData = useCallback(
    async (isMounted) => {
      setIsLoading(true);
      try {
        const data = await getLetterRequestList({
          options,
          filterData,
          ordering,
        });
        if (isMounted) {
          setLetterRequestsData(data);
        }
      } catch (error) {
        console.error("Error fetching letter requests:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    },
    [ordering, filterData, options]
  );

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      onPageChange("page", 1);
      setOrdering("-id");
      fetchData(true);
    }
    return () => {
      isMounted = false;
    };
  }, [reload]);

  useEffect(() => {
    setFilterData((prevFilter) => {
      const updatedFilter = { ...prevFilter };
      if (activeTab === "requests") {
        updatedFilter.status = "PENDING";
      } else {
        // Records tab - show accepted and rejected
        delete updatedFilter.status;
        updatedFilter.status__in = "ACCEPTED,REJECTED";
      }
      return updatedFilter;
    });
  }, [activeTab]);

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
    <>
      <Tabs
        defaultValue="requests"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
          setActiveTabDetails(
            LetterRequestTabs.find((obj) => obj.value === tab)
          );
        }}
        value={activeTab}
      >
        <TabsList>
          {LetterRequestTabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} variant="inner-tab">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <CardHeader>
        <CardTitle>{activeTabDetails.title}</CardTitle>
        <CardDescription>{activeTabDetails.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by employee or request name",
              name: "search",
            },
            ...(activeTab === "records"
              ? [
                  {
                    type: "select",
                    options: [
                      { value: "ACCEPTED", label: "Accepted" },
                      { value: "REJECTED", label: "Rejected" },
                    ],
                    name: "status",
                    placeholder: "Status",
                  },
                ]
              : []),
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={letterRequestsData.results}
            columns={LetterRequestColumns(activeTab === "requests", fetchData)}
            pagination={true}
            dataTotalSize={letterRequestsData.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </>
  );
}
