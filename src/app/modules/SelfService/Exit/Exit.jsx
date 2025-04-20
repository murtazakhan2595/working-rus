import React from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import EOSSettlementList from "./EOSSettlementList";

const Exit = () => {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-primary-1100">Exit Information</h2>
          <p className="text-sm text-gray-500">
            Review your exit details and related information
          </p>
        </CardHeader>
        <CardContent>
          {/* This section would contain existing exit information like termination/resignation details */}
          <div className="text-sm text-gray-600">
            <p>
              This section displays information about your exit process with the company.
              It includes details about your resignation or termination, notice period,
              and relevant dates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* EOS Settlement List Component */}
      <EOSSettlementList />
    </div>
  );
};

export default Exit; 