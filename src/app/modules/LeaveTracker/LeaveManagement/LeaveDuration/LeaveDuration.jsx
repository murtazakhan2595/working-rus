import { TableCustom } from "components";
import { PageLoader } from "components";
import { LeaveDurationColumn } from "app/modules/LeaveTracker/Sections";
import {
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
export default function LeaveDuration({
  options,
  onPageChange,
  setOrdering,
  loading,
  data,
  reload,
}) {
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  return (
    <div className="flex flex-col">
      <CardHeader className="flex flex-row flex-wrap justify-between gap-2 items-center">
        <div>
          <CardTitle className="text-primary">Leave Durations</CardTitle>
          <CardDescription className="text-neutral-1100">
            Here you can create, view, and manage different leave durations
            eligible for specific nationalities, branches, and departments.
            These durations will be used by employees when applying for leaves.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* <FilterInput
          filters={[
            {
              type: "search",
              name: "name",
              placeholder: "Serach by name",
            },
            {
              type: "select",
              options: Branches,
              name: "branch",
              placeholder: "Branch",
            },
            {
              type: "select",
              options: countriesList,
              name: "country",
              placeholder: "Country",
            },
            {
              type: "select",
              options: [],
              name: "religion",
              placeholder: "Religion",
            },
            {
              type: "date-range",
              options: Branches,
              name: "date_range",
              placeholder: "Start Date",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        /> */}
        {loading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={LeaveDurationColumn(reload, data?.results || [])}
            data={data?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={data?.count || 0}
            pagination={true}
          />
        )}
      </CardContent>
    </div>
  );
}
