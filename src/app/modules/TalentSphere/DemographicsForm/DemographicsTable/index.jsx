import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
  CardContent,
} from "components/ui/card";
import { getDemographicFormsList } from "app/hooks/talentSphere";
import { PageLoader, TableCustom } from "components";
import { DemographicsFormColumns } from "app/modules/TalentSphere/Sections";

const DemographicsTable = forwardRef(({ onDataChange }, ref) => {
  const [demographicFormsList, setDemographicFormsList] = useState({
    results: [],
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

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

  const fetchData = async () => {
    try {
      const data = await getDemographicFormsList({ options, ordering });
      setDemographicFormsList({
        results: data.results || [],
        count: data.count || 0,
      });

      if (onDataChange) {
        onDataChange(data);
      }
    } catch (error) {
      console.error("Error fetching demographic forms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    reload: fetchData,
  }));

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [options, ordering]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographic Form Setup</CardTitle>
        <CardDescription>
          Create and manage a single demographic form with customizable sections and fields.
          Candidates will use this form to provide their demographic information through a secure link.
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={demographicFormsList.results || []}
            columns={DemographicsFormColumns(fetchData)}
            pagination={true}
            dataTotalSize={demographicFormsList.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </Card>
  );
});

export default DemographicsTable;
