import React, { useState, useEffect } from "react";
import { TableCustom, PageLoader } from "components";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { Switch } from "src/@/components/ui/switch";
import { Badge } from "components/ui/badge";
import { toast } from "react-toastify";
import {
  getClearanceTypeList,
  updateClearanceType,
} from "app/hooks/officeSetting";

const AccessConfiguration = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], count: 0 });
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getClearanceTypeList();
      if (response?.results) {
        setData({
          results: response.results,
          count: response.results.length,
        });
      }
    } catch (error) {
      console.error("Error fetching clearance types:", error);
      toast.error("Failed to load clearance types");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (clearanceTypeId, currentStatus) => {
    setUpdating((prev) => ({ ...prev, [clearanceTypeId]: true }));

    try {
      const newStatus = !currentStatus;
      const response = await updateClearanceType(clearanceTypeId, {
        clearance_revoke: newStatus,
      });

      if (response) {
        setData((prev) => ({
          ...prev,
          results: prev.results.map((type) =>
            type.id === clearanceTypeId
              ? { ...type, clearance_revoke: newStatus }
              : type
          ),
        }));

        const typeName = data.results.find(
          (t) => t.id === clearanceTypeId
        )?.name;
        toast.success(
          `Auto-deactivation ${
            newStatus ? "enabled" : "disabled"
          } for ${typeName}`
        );
      }
    } catch (error) {
      console.error("Error updating clearance type:", error);
      toast.error("Failed to update access configuration");
    } finally {
      setUpdating((prev) => ({ ...prev, [clearanceTypeId]: false }));
    }
  };

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

  const columns = [
    {
      dataField: "name",
      text: "Clearance Type",
      sort: true,
    },
    {
      dataField: "clearance_revoke",
      text: "Auto-Deactivation",
      sort: true,
      formatter: (cell, row) => (
        <Switch
          checked={cell || false}
          onCheckedChange={() => handleToggleChange(row.id, cell)}
          disabled={updating[row.id]}
        />
      ),
      style: { textAlign: "center" },
    },
    {
      dataField: "clearance_revoke",
      text: "Status",
      sort: true,
      formatter: (cell, row) => (
        <Badge variant={cell ? "success" : "secondary"}>
          {updating[row.id] ? "Updating..." : cell ? "Active" : "Inactive"}
        </Badge>
      ),
      style: { textAlign: "center" },
    },
  ];

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-primary">Access Configuration</CardTitle>
        <CardDescription className="text-neutral-1100">
          Configure automatic access deactivation rules for different clearance
          types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={columns}
            data={data?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={data?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </div>
  );
};

export default AccessConfiguration;
