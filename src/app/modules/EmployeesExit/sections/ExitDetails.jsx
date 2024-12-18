import moment from "moment";
import React from "react";
import ResignationLetter from "./ResignationLetter";
import { DetailBox } from "components/SheetCardExtension";
import { Card } from "components/ui/card";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { ReasonForLeaving } from "data/Data";


function ExitDetails({ exitData }) {
  const exitDetails = [
    { label: "Leaving Reason", 
      value:
      ReasonForLeaving.find((reason) => reason.value === exitData.exit_type)
        ?.label || "Unknown Reason",
    },
    {
      label: "Exit date",
      value: moment(exitData.exit_date).format("DD-MM-YYYY") || "Invalid Date",
    },
    { label: "Notice period", value: exitData.notice_period },
  ];
  return (
    <Card className="border shadow"> 
      <CardHeader>
          <CardTitle> Exit Details</CardTitle> 
        </CardHeader>
        <hr />
        <CardContent>
        <div className="flex flex-col justify-center self-start mt-5 text-base">
          {exitDetails.map((detail, index) => (
            <ExitInfoItem
              key={index}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
        {exitData.resignation_letter &&<ResignationLetter
          name={exitData.name}
          file={exitData.resignation_letter}
        />}
      </CardContent>
    </Card>
  );
}

function ExitInfoItem({ label, value }) {
  return (
    <DetailBox
     label={label}
     value={value}
    />
  );
}


export default ExitDetails;
