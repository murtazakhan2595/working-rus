import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../src/@/components/ui/button";
import { Status, StatusIcon, getDecision } from "../Sections";

const RenderStatus = ({ row }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const status = Status(row.status_hr);
  const spanClassName = "text-[14px] flex justify-start items-center";
  const itemClassName = "custom-dropdown-item py-2";

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  return (
    <div>
      <DropdownMenu open={openDropdownRow === row.id} onOpenChange={() => toggleDropdown(row.id)}>
        <DropdownMenuTrigger asChild>
          <Button aria-haspopup="true" variant="outline" className="">View</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-3 ml-2">
          <DropdownMenuLabel>Your Application Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className={itemClassName}>
            <span className={spanClassName}>
              <StatusIcon status={"Approved"} /> Viewed
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem className={itemClassName}>
            <span className={spanClassName}>
              <StatusIcon status={row.status_manager} />
              {Status(row.status_manager) === "Approved"
                ? "Approved by Manager"
                : Status(row.status_manager) === "Rejected"
                ? "Rejected by Manager"
                : "Direct Manager Approval"}
            </span>
          </DropdownMenuItem>
          {/* Uncomment if needed
          {row.status_indirect_manager && (
            <DropdownMenuItem className={itemClassName}>
              <span className={spanClassName}>
                <StatusIcon status={row.status_indirect_manager} />
                In-Direct Manager Approval
              </span>
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem className={itemClassName}>
            <span className={spanClassName}>
              <StatusIcon status={row.status_hr} />
              {getDecision(status)}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RenderStatus;
