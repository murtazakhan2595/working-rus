import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getApplicantsList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { ApplicationColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentApplicationSource } from "data/Data";
import { useSearchParams } from "react-router-dom";

const AllApplicants = ({ reload, variant = "all" }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filterData with URL params BEFORE first render
  const initialFilters = React.useMemo(() => {
    const source = searchParams.get("source");
    const recruitmentRequisition = searchParams.get("recruitment_requisition");
    const filters = {};
    
    if (source) filters.application_source = source;
    if (recruitmentRequisition) filters.recruitment_requisition = recruitmentRequisition;
    
    return filters;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - calculate only once on mount

  const [RequisitionList, setRequisitionList] = useState({});
  const [filterData, setFilterData] = useState(initialFilters);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [isLoading, setIsLoading] = useState(false);

  // Clear URL parameters after applying (only once)
  useEffect(() => {
    const hasParams = searchParams.has("source") || searchParams.has("recruitment_requisition");
    
    if (hasParams) {
      if (searchParams.has("source")) searchParams.delete("source");
      if (searchParams.has("recruitment_requisition")) searchParams.delete("recruitment_requisition");
      setSearchParams(searchParams, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - run only once on mount

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
      const filters = {
        ...filterData,
        ...(variant === "all" ? { status: "new" } : {}),
        ...(variant === "rejected" ? { status: "rejected" } : {}),
        ...(variant === "shortlisted" ? { status: "shortlisted" } : {}),
        ...(variant === "blacklisted" ? { status: "blacklisted" } : {}),
        ...(variant === "screened" ? { status: "screened" } : {}),
        ...(variant === "in_progress" ? { status: "in_progress" } : {}),
        ...(variant === "hired" ? { status: "hired" } : {}),
        ...(variant === "hold" ? { status: "hold" } : {}),
      };
      const response = await getApplicantsList({
        filterData: filters,
        options,
        ordering,
      });
      if (isMounted && response) {
        setRequisitionList(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (variant) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, ordering, options, variant]);

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering("-id");
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        if (filterName === "emiratization_flag")
          updatedFilters[filterName] =
            filterValue === "required" ? true : false;
        else if (['application_date_range'].includes(filterName))
          updatedFilters[filterName] = filterValue?.split(',');
        else updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>{variant ?? ""} Applicants</CardTitle>
        <CardDescription>
          Here you can view applications of {variant ?? ""} applicants applied
          on pusblished vacancies through all portals.
        </CardDescription>
        <div className="flex justify-end">
          <FilterInput
            filters={[
              {
                type: "search",
                name: "job_title",
                placeholder: "Job Title",
                //  values: filterData.job_title,
              },
              {
                type: "search",
                name: "candidate",
                placeholder: "Candidate Name/Id",
                //  values: filterData.candidate,
              },
              {
                type: "select",
                options: "Departments",
                name: "department",
                placeholder: "Department",
                //  values: filterData.department,
              },
              {
                type: "select",
                options: RecruitmentApplicationSource,
                name: "application_source",
                placeholder: "Application Source",
                //  values: filterData.application_source,
              },
              {
                type: "select",
                options: [
                  { value: "required", label: "Required" },
                  { value: "not_required", label: "Not Reqiured" },
                ],
                name: "emiratization_flag",
                placeholder: "Emiratization Role",
                //  values: filterData.emiratization_flag,
              },
              {
                type: "date-range",
                name: "application_date_range",
                placeholder: "Application date",
              },
              ...(variant === "rejected"
                ? [
                  {
                    type: "date-range",
                    name: "rejection_date",
                    placeholder: "Rejection Date",
                    //  values: filterData.rejection_date,
                  },
                ]
                : []),
              ...(variant === "shortlisted"
                ? [
                  {
                    type: "date-range",
                    name: "expected_joining_date",
                    placeholder: "Joining Date",
                    //  values: filterData.expected_joining_date,
                  },
                ]
                : []),
              ...(variant === "blacklisted"
                ? [
                  {
                    type: "date-range",
                    name: "blacklisted_on",
                    placeholder: "Blacklisted Date",
                    //  values: filterData.blacklisted_on,
                  },
                  {
                    type: "select",
                    name: "blacklisted_by",
                    placeholder: "Blacklisted By",
                    option: "employees",
                    //  values: filterData.blacklisted_by,
                  },
                ]
                : []),
            ]}
            className="justify-end"
            onChange={handleFilterChange}
            filterValues={{
              ...filterData,
              ...(filterData.application_date_range ? { application_date_range: filterData.application_date_range.join(',') } : {})
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={ApplicationColumns(fetchData, variant)}
            data={RequisitionList.results || []}
            tableOptions={tableOptions}
            dataTotalSize={RequisitionList?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </>
  );
};

export default AllApplicants;
