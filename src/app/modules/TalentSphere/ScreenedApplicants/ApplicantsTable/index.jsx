import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  Card,
  CardContent,
} from "components/ui/card";
import { PageLoader, TableCustom } from "components";
import { ApplicationColumns } from "app/modules/TalentSphere/Sections";
import { getApplicantsList } from "app/hooks/talentSphere";
import { FilterInput } from "components/FormControl";

const ApplicantsTable = forwardRef((props, ref) => {
  const [applicantsList, setApplicantsList] = useState({
    results: [],
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({ status: "screened" });

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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getApplicantsList({ options, ordering, filterData });

      setApplicantsList({
        results: data.results || [],
        count: data.count || 0,
      });
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setIsLoading(false);
    }
  }, [options, ordering, filterData]);


  // Expose reload to parent
  useImperativeHandle(ref, () => ({
    reload: fetchData,
  }));

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [options, ordering, filterData]);
const handleFilterChange = (filterName, filterValue) => {
  console.log(filterName, filterValue)
  
  onPageChange("page", 1);
  setFilterData((prevFilters) => {
    const updatedFilters = { ...prevFilters };
    if (filterValue === "" || filterValue === null || filterValue === undefined) {
      delete updatedFilters[filterName];
    } else {
      if (filterName === "emiratization_flag") {
        updatedFilters[filterName] = filterValue === "true";
      } else {
        updatedFilters[filterName] = filterValue;
      }
    }
    return updatedFilters;
  });
};

  const optionsSource = [
    { label: "Cohrus", value: "cohrus" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Indeed", value: "indeed" },
    { label: "Other", value: "other" }
  ];

const EmirationOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
]


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

      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Candidate Name/ID ",
            name: "candidate",
          },
          {
            type: "select",
            placeholder: "Filter By Application Source",
            name: "application_source",
            options: optionsSource
          },
          {
            type: "select",
            placeholder: "Filter By Emiratization Flag",
            name: "emiratization_flag",
            options: EmirationOptions
          }, {
            type: "search",
            placeholder: "Search By Job Title",
            name: "job_title",
          }


        ]}
        className="justify-end mx-2"
        onChange={handleFilterChange}
      />

      <CardContent className="mt-4">
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={applicantsList.results || []}
            columns={ApplicationColumns(fetchData)}
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
