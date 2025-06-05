import { TableCustom } from "components";
import { PageLoader } from "components";
import { LeaveDurationColumn } from "./LeaveSetupColumns";
import { useState } from "react";

export default function LeaveDuration({
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
          columns={LeaveDurationColumn(reload, data?.results || [])}
          data={data?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={data?.count || 0}
          pagination={true}
        />
      )}
    </div>
  );
}