import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader, Header } from "components";
import { getApplicantsList } from "app/hooks/talentSphere";
import { CardContent } from "components/ui/card";
import { ApplicationColumns } from "app/modules/TalentSphere/Sections";
import { FilterInput } from "components/FormControl";
import { CardHeader, CardTitle, CardDescription, Card } from "components/ui/card";
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
        ...(variant === "resume_bank" ? { status: "resume_bank" } : {}),
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
        if (['application_date_range','blacklisted_on','added_on','rejected_on'].includes(filterName))
          updatedFilters[filterName] = filterValue?.split(',');
        else updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const TabTitle = React.useMemo(() => {
    return {
      by_requisition: { title: 'Requisition', description: ', that have applied for specific requisition.', navigationLink: '/talent-sphere/dashboard' },
      emiratization_all: { title: 'Emiratization', description: ', that have applied for requisition with emiratization role.', navigationLink: '/talent-sphere/dashboard' },
      ai_picks: { title: 'AI Pick', description: '. The system automatically analyzes job descriptions and applicants’ resumes using AI, helping you quickly identify the most suitable candidates without the need for manual review.' },
      in_progress: { title: 'In Progress', description: ' whose interviews have been scheduled.' },
      resume_bank: { title: 'Resume Bank', description: ' who were moved to resume bank.' },
    };
  }, [variant]);

  return (
    <div className="">
      {TabTitle[variant]?.navigationLink &&
        <Header
          showBackButton={true}
          navigationLink={TabTitle[variant]?.navigationLink}
        />
      }
      <Card>
        <CardHeader>
          <CardTitle>{TabTitle[variant]?.title ?? variant ?? ""} Applicants</CardTitle>
          <CardDescription>
            Here, you can view applications for all candidates{TabTitle[variant]?.description ?? `, that are ${variant}`}
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
                  type: "search",
                  name: "location",
                  placeholder: "Search by location",
                },
                {
                  type: "select",
                  options: "Departments",
                  name: "department",
                  placeholder: "Department",
                },
                {
                  type: "select",
                  options: RecruitmentApplicationSource,
                  name: "application_source",
                  placeholder: "Application Source",
                },
                {
                  type: "select",
                  options: [
                    { value: true, label: "Required" },
                    { value: false, label: "Not Reqiured" },
                  ],
                  name: "emiratization_flag",
                  placeholder: "Emiratization Role",
                },
                ...(variant !== "ai_picks" && variant !== "resume_bank" ? [{
                  type: "select",
                  options: [
                    { value: true, label: "Suggested" },
                    { value: false, label: "Not Suggested" },
                  ],
                  name: "ai_suggested",
                  placeholder: "AI Suggested",
                }] : []),
                {
                  type: "date-range",
                  name: "application_date_range",
                  placeholder: "Application date",
                },
                ...(variant === "rejected" ? [{
                  type: "date-range",
                  name: "rejected_on",
                  placeholder: "Rejection Date",
                },] : []),
                ...(variant === "shortlisted"
                  ? [
                    {
                      type: "date-range",
                      name: "expected_joining_date",
                      placeholder: "Joining Date",
                    },
                  ]
                  : []),
                ...(variant === "resume_bank"
                  ? [
                    {
                      type: "select",
                      name: "recommended_department",
                      options: 'Departments',
                      placeholder: "Recommended Department",
                    },
                    {
                      type: "select",
                      name: "recommended_designation",
                      options: 'Designations',
                      placeholder: "Recommended Designation",
                    },
                    {
                      type: "date-range",
                      name: "added_on",
                      placeholder: "Added On",
                    },
                  ]
                  : []),
                ...(variant === "blacklisted"
                  ? [
                    {
                      type: "date-range",
                      name: "blacklisted_on",
                      placeholder: "Blacklisted Date",
                    },
                    {
                      type: "select",
                      name: "blacklisted_by",
                      placeholder: "Blacklisted By",
                      option: "employees",
                    },
                  ]
                  : []),
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
              columns={ApplicationColumns(fetchData, variant)}
              data={RequisitionList.results || []}
              tableOptions={tableOptions}
              dataTotalSize={RequisitionList?.count || 0}
              pagination={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllApplicants;
