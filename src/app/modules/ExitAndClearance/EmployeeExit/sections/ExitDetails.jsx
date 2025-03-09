import React from "react";
import { DetailBox } from "components/SheetCardExtension";
import { StatusLabel } from "components";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { ReasonForLeaving } from "data/Data";
import ApplicationStatus from "./ApplicationStatus";
import { renderDate } from "utils/renderValues";
import { Button } from "components/ui/button";
import AttachmentUI from "components/ui/AttachmentUI";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { Status } from "app/modules/ExitAndClearance/Sections";

function ExitDetails({ exitData, reloadData = () => {} }) {
  const employeeApproval = Status(exitData.status_termination, 0);
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

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    try {
      // Create a new FormData object
      const formData = new FormData();
      // Append values to the FormData object
      formData.append("id", exitData.id);
      formData.append("status_termination", status);

      const response = await saveEmployeeExitDetail(formData, exitData.id);
      if (response) {
        reloadData();
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

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

        <div className="my-5 max-w-[450px]">
          <DetailBox
            orientation="horizontal"
            className=""
            label={"Attachment"}
            value={
              <>
                {exitData.resignation_letter && (
                  <AttachmentUI
                    name={`Resignation Letter-${exitData.serial_number}`}
                    attachment={exitData.resignation_letter}
                    viewOnly={true}
                  />
                )}
                {exitData.termination_letter && (
                  <AttachmentUI
                    name={`Termination Letter-${exitData.serial_number}`}
                    attachment={exitData.termination_letter}
                    viewOnly={true}
                  />
                )}
              </>
            }
          />
        </div>

        {exitData.exit_category === "termination" &&
          (exitData.status_termination === "viewed by manager" ? (
            <div className="flex flex-row gap-4">
              <Button
                variant="success"
                size="lg"
                onClick={(e) => {
                  handleSubmit(e, "accepted by employee");
                }}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={(e) => {
                  handleSubmit(e, "rejected by employee");
                }}
              >
                Reject
              </Button>
            </div>
          ) : (
            <StatusLabel
              status={exitData.status_termination}
              size="lg"
              className="rounded-sm"
            >
              {employeeApproval ? "Accepted" : "Rejected"}
            </StatusLabel>
          ))}
      </CardContent>
    </Card>
  );
}

export default ExitDetails;
