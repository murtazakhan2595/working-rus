import React from 'react';
import EOSSettlementList from '../../../SelfService/Exit/EOSSettlementList';

const EOSSettlementSection = ({ employee }) => {
  if (employee?.status === "terminated" || 
      employee?.status === "resign" || 
      employee?.leaving_reason === "End of Contract") {
    console.log("Employee status:", employee?.status);
    console.log("Employee ID:", employee?.employeeId);
    return (
      <div className="mt-4">
        <div className="text-lg text-neutral-1100">End of Service Settlement</div>
        <hr className="my-2 border-neutral-200" />
        <EOSSettlementList employeeId={employee?.employeeId || employee?.id || employee?.employee_id} />
      </div>
    );
  }
  return null;
};

export default EOSSettlementSection; 