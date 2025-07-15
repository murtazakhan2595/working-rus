import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { OnboardingChecklistColumn } from "../../sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { useState, useEffect } from "react";
import { getOnboardingDocument } from "app/hooks/officeSetting";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";
import { PageLoader } from "components";

const OnboardingChecklist = ({ reload }) => {
  const [OnboardingCheckList, setOnboardingCheckList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const response = await getOnboardingDocument({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setOnboardingCheckList(response);
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
    if (isMounted) {
      onPageChange("page", 1);
      setOrdering("-id");
      setFilterData({});
      fetchData(true);
    }
  }, [reload]);

  return (
    <OfficeSettingPermissionWrapper
      permissions={OFFICE_SETTING_PERMISSIONS.ONBOARDING.VIEW}
      showError={true}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Onboarding Document Checklist
          </CardTitle>
          <CardDescription className="text-neutral-1100">
            Here you can manage your onboarding document checklist. Add, edit,
            or delete onboarding document checklist as needed.
          </CardDescription>
          <div className="flex justify-end">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search Document Name",
                  name: "document_name",
                },
              ]}
              onChange={handleFilterChange}
              className="justify-end"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={OnboardingChecklistColumn(fetchData)}
              data={OnboardingCheckList.results || []}
              pagination={true}
              tableOptions={tableOptions}
              dataTotalSize={OnboardingCheckList?.count || 0}
              className="organization-table"
            />
          )}
        </CardContent>
      </Card>
    </OfficeSettingPermissionWrapper>
  );
};

export default OnboardingChecklist;
