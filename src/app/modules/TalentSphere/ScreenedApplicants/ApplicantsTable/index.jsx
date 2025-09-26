import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
  CardContent,
} from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { ApplicantsColumns } from "app/modules/TalentSphere/ScreenedApplicants";
import { getApplicantsList } from "app/hooks/talentSphere"; 

const ApplicantsTable = forwardRef((props, ref) => {
  const [applicantsList, setApplicantsList] = useState({
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

  // Fetch applicants
  const fetchData = async () => {
    try {
      const data = await getApplicantsList({ options, ordering });
      setApplicantsList({
        results: data.results || [],
        count: data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Expose reload to parent
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
        <CardTitle>Screened Applicants</CardTitle>
        <CardDescription>
          Here you can view all screened applicants, access candidate details,
          and schedule interviews to proceed with the hiring process
          efficiently.
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={applicantsList.results || []}
            columns={ApplicantsColumns(fetchData)}
            pagination={true}
            dataTotalSize={applicantsList.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>
    </Card>
  );
});

export default ApplicantsTable;
