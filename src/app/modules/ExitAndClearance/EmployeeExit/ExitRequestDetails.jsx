import React from "react";
import { DetailContent } from "components";
import { ExitDetails } from "app/modules/ExitAndClearance/ExitDetailsCard";
import { Card, CardContent } from "components/ui/card";

const ExitRequestDetails = ({ exitData, reloadData = () => {} }) => {
  const isResignation = Boolean(exitData.exit_category === "RESIGNATION");
  // Define the fields to display
  const fields = React.useMemo(
    () => ExitDetails(isResignation) || [],
    [isResignation]
  );
  return (
    <Card>
      <CardContent className="pt-6">
        <DetailContent currentItem={exitData} fields={fields} />
      </CardContent>
    </Card>
  );
};

export default ExitRequestDetails;
