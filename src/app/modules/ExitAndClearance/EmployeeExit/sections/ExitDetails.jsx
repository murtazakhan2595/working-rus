import moment from "moment";
import React from "react";
import ResignationLetter from "./ResignationLetter";
import { DetailBox } from "components/SheetCardExtension";
import { Card } from "components/ui/card";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { ReasonForLeaving } from "data/Data";
import ApplicationStatus from "./ApplicationStatus";
import { renderDate } from "utils/renderValues";

function ExitDetails({ exitData }) {
  const exitDetails = [
    {
      label: "Leaving Reason",
      value:
        ReasonForLeaving.find((reason) => reason.value === exitData.exit_type)
          ?.label || "Unknown Reason",
    },
    {
      label: "Exit date",
      value: renderDate(exitData.exit_date),
    },
    { label: "Notice period", value: exitData.notice_period },
  ];
  return (
    <Card className="border shadow">
      <CardHeader className="py-2">
        <CardTitle>
          <div className="justify-between items-center inline-flex w-full">
            <div className="text-lg text-neutral-1100">
              {`${
                exitDetails.exit_category === "resignation"
                  ? "Resignation"
                  : "Termination"
              }`}{" "}
              Details
            </div>
            <ApplicationStatus row={exitData} />
          </div>
        </CardTitle>
      </CardHeader>
      <hr />
      <CardContent>
        <div className="grid grid-cols-3 justify-center self-start mt-5 text-base">
          {exitDetails.map((detail, index) => (
            <DetailBox
              orientation="horizontal"
              key={index}
              className=""
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
        {exitData.resignation_letter && (
          <ResignationLetter
            name={exitData.name}
            file={exitData.resignation_letter}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ExitDetails;
