import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { getApplicantsList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { ApplicationColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { RecruitmentApplicationSource } from "data/Data";
import { useSearchParams } from "react-router-dom";

const AllApplicants = ({ reload, variant = "all", deepLinkFilterData }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filterData with URL params BEFORE first render
  const initialFilters = React.useMemo(() => {
    const source = searchParams.get("source");
    const recruitmentRequisition = searchParams.get("recruitment_requisition");
    const emiratizationFlag = searchParams.get("emiratization_flag");
    const filters = {};

    if (source) filters.application_source = source;
    if (recruitmentRequisition) filters.recruitment_requisition = recruitmentRequisition;
    // Convert emiratization_flag from "required"/"not_required" string to boolean
    if (emiratizationFlag) {
      filters.emiratization_flag = emiratizationFlag === "required" ? true : false;
    }

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
    const hasParams = searchParams.has("source") || searchParams.has("recruitment_requisition") || searchParams.has("emiratization_flag");

    if (hasParams) {
      if (searchParams.has("source")) searchParams.delete("source");
      if (searchParams.has("recruitment_requisition")) searchParams.delete("recruitment_requisition");
      if (searchParams.has("emiratization_flag")) searchParams.delete("emiratization_flag");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency - run only once on mount

  // Handle deep link filter data when navigating from dashboard
  useEffect(() => {
    if (deepLinkFilterData) {
      const convertedFilters = { ...deepLinkFilterData };

      // Convert emiratization_flag: true/false to "required"/"not_required" for dropdown
      if (typeof convertedFilters.emiratization_flag === 'boolean') {
        convertedFilters.emiratization_flag = convertedFilters.emiratization_flag ? 'required' : 'not_required';
      }

      setFilterData(convertedFilters);
      // Reset page to 1 when applying deep link filters
      onPageChange("page", 1);
    }
  }, [deepLinkFilterData]);

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
      // Start with current filters
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
        ...(variant === "ai_picks" ? { status: "new", ai_suggested: true } : {}),
      };

      // Apply emiratization variants (explicit status + flag)
      if (variant === "emiratization_all") {
        filters.emiratization_flag = true;
      } else if (variant === "emiratization_screened") {
        filters.status = "screened";
        filters.emiratization_flag = true;
      } else if (variant === "emiratization_shortlisted") {
        filters.status = "shortlisted";
        filters.emiratization_flag = true;
      } else if (variant === "emiratization_hired") {
        filters.status = "hired";
        filters.emiratization_flag = true;
      }

      // Convert emiratization_flag string to boolean only if it's a string
      if (typeof filters.emiratization_flag === 'string') {
        filters.emiratization_flag = filters.emiratization_flag === 'required' ? true : false;
      }

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
      if (filterValue === "" || filterValue === "All") {
        delete updatedFilters[filterName];
      } else {
        // Store UI values as-is (strings for dropdowns)
        // Conversion to API format happens in fetchData
        updatedFilters[filterName] = filterValue;
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
              ...(filterData.application_date_range ? { application_date_range: filterData.application_date_range.join(',') } : {}),
              // Convert boolean emiratization_flag back to string for FilterInput UI
              ...(filterData.emiratization_flag !== undefined ? {
                emiratization_flag: filterData.emiratization_flag === true ? 'required' : 'not_required'
              } : {})
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
