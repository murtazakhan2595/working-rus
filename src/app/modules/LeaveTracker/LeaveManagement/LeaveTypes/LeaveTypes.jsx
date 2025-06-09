import { TableCustom } from "components";
import { PageLoader } from "components";
import { LeaveTypesColumns } from "app/modules/LeaveTracker/Sections";
import { useState } from "react";

export default function LeaveTypes({
  options,
  onPageChange,
  setOrdering,
  loading,
  data,
  reload,
}) {
  console.log("data", data);
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };
  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={LeaveTypesColumns(reload, data?.results || [])}
          data={data?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={data?.count || 0}
          pagination={true}
        />
      )}
    </div>
  );
}