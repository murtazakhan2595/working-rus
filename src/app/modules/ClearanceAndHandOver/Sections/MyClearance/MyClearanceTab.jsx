import React, { useState, useEffect, useCallback } from "react";
import { TableCustom, PageLoader } from "components";
import { FilterInput } from "components/FormControl";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
  Card,
} from "components/ui/card";
import { useSelector } from "react-redux";
import { getClearanceRequestsList } from "app/hooks/clearanceAndHandover";
import { getClearanceTypeList } from "app/hooks/officeSetting";
import { MyClearanceColumns } from "./MyClearanceColumns";

const MyClearanceTab = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], count: 0 });
  const [clearanceTypes, setClearanceTypes] = useState([]);

  // Get current logged-in user
  const userProfile = useSelector((state) => state.user.userProfile);
  const currentUserId = userProfile?.id;

  // Load clearance types on component mount
  useEffect(() => {
    fetchClearanceTypes();
  }, []);

  const fetchClearanceTypes = async () => {
    try {
      const response = await getClearanceTypeList();
      if (response) {
        setClearanceTypes(response?.results || []);
      }
    } catch (error) {
      console.error("Error fetching clearance types:", error);
      setClearanceTypes([]);
    }
  };

  const fetchData = useCallback(async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const payload = {
        options,
        ordering,
        filterData: {
          ...filterData,
          employee: currentUserId, // Filter by current employee
        },
      };

      const response = await getClearanceRequestsList(payload);
      if (response && response.results) {
        setData(response);
      } else {
        setData({ results: [], count: 0 });
      }
    } catch (error) {
      console.error("Error fetching my clearance requests:", error);
      setData({ results: [], count: 0 });
    } finally {
      setLoading(false);
    }
  }, [options, ordering, filterData, currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPageChange = (name, value) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROCESS", label: "In Process" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const clearanceTypeOptions = clearanceTypes.map((type) => ({
    value: type.id,
    label: type.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">My Clearance</CardTitle>
        <CardDescription className="text-neutral-1100">
          Track your clearance status, view certificate, and see all related
          details for transparency. Submit e-signatures where required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "select",
              options: clearanceTypeOptions,
              name: "clearance_type",
              placeholder: "Clearance Type",
            },
            {
              type: "select",
              options: statusOptions,
              name: "status",
              placeholder: "Status",
            },
            {
              type: "date-range",
              name: "start_date_range",
              placeholder: "Start Date Range",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />

        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={MyClearanceColumns(
              fetchData,
              data?.results || [],
              clearanceTypes
            )}
            data={data?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={data?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MyClearanceTab;
