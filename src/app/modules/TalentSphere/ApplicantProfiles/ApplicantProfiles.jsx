import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader, Header } from "components";
import {
  getApplicantsList,
  getJobTypeList,
  getCareerLevelList,
} from "app/hooks/talentSphere";
import { ApplicantsColumns } from "app/modules/TalentSphere/Sections";
import { ExportProfile } from "app/modules/TalentSphere";
import { FilterInput } from "components/FormControl";
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";

const ApplicantProfiles = ({ reload, variant = "all" }) => {
  const [ResumeBankList, setResumeBankList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [JobTypeList, setJobTypeList] = useState([]);
  const [CareerLevelList, setCareerLevelList] = useState([]);
  const DefaultStatus = React.useMemo(() => ["in_progress", "shortlisted", "hired", "screened", 'rejected', 'blacklisted', 'hold'], []);
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
      const filters = { status: DefaultStatus, ...filterData };
      const response = await getApplicantsList({
        filterData: filters,
        options,
        ordering,
      });
      if (isMounted && response) {
        setResumeBankList(response);
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
        if (['application_date_range'].includes(filterName)) {
          updatedFilters[filterName] = filterValue?.split(',')
        }
        else updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div>
      <Header content={<ExportProfile filterData={filterData} />} />
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            Here you can view application of all applicants who followed the screened stage.
          </CardDescription>
          <div className="flex justify-end">
            <FilterInput
              filters={[
                {
                  type: "search",
                  name: "job_title",
                  placeholder: "Job Title",
                },
                {
                  type: "search",
                  name: "candidate",
                  placeholder: "Candidate Name/Id",
                },
                {
                  type: "search-id",
                  name: "requisition_id",
                  placeholder: "Requisition Id",
                },
                {
                  type: "select-multiple",
                  name: "status",
                  placeholder: "By Status",
                  options: [
                    { value: "screened", label: "Screened" },
                    { value: "in_progress", label: "Inprogress" },
                    { value: "hold", label: "On Hold" },
                    { value: "shortlisted", label: "Shortlisted" },
                    { value: "hired", label: "Hired" },
                    { value: "rejected", label: "Rejected" },
                    { value: "blacklisted", label: "Blacklisted" },
                  ],
                },
                {
                  type: "date-range",
                  name: "application_date_range",
                  placeholder: "Application Date",
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
              columns={ApplicantsColumns(fetchData, variant)}
              data={ResumeBankList.results || []}
              tableOptions={tableOptions}
              dataTotalSize={ResumeBankList?.count || 0}
              pagination={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantProfiles;
