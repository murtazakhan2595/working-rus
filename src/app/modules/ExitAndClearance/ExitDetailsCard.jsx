import moment from "moment";
import React, { useState, useRef } from "react";
import { RenderResignationAction } from "./Sections";
import {
  ViewDetailHeader,
  Labels,
  ViewDetailBox,
  ViewAttachmentDetail,
} from "components";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  ResignationStatus,
  ResignationReason,
  ManagerName,
} from "utils/getValuesFromTables";
import { Formik } from "formik";
import { FileInput } from "components/form-control";
import { Col, Row, Form, Button } from "reactstrap";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { ExitStatusCurrentStep } from "./Sections";

const ExitDetailsCard = ({
  onClose,
  resignationId,
  isResignation = true,
  resignationsList,
  reload,
}) => {
  const [resignation, setResignation] = useState(
    resignationsList.find((item) => item.id === resignationId)
  );
  const [currentResignationId, setCurrentResignationId] =
    useState(resignationId);
  const formRef = useRef();
  const handleNext = () => {
    const currentIndex = resignationsList.findIndex(
      (item) => item.id === currentResignationId
    );
    if (currentIndex < resignationsList.length - 1) {
      const currentResignation = resignationsList[currentIndex + 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    } else {
      const currentResignation = resignationsList[0];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = resignationsList.findIndex(
      (item) => item.id === currentResignationId
    );
    if (currentIndex > 0) {
      const currentResignation = resignationsList[currentIndex - 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    } else {
      const currentResignation = resignationsList[resignationsList.length - 1];
      setResignation(currentResignation);
      setCurrentResignationId(currentResignation.id);
    }
  };
  const handleSubmit = async (data) => {
    try {
      if (data) {
        const payload = {
          ...data,
          ...(isResignation
            ? { status_resignation: "exit interview" }
            : { status_termination: "exit interview" }),
        };
        const response = await saveEmployeeExitDetail(payload);
        if (response && reload) {
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  return (
    <div className="bg-white view-modal-card hideScroll">
      <ViewDetailHeader
        onNextClick={handleNext}
        onPreviousClick={handlePrevious}
        closeModel={onClose}
      />
      <div className="mt-9">
        <section className="flex flex-col mt-10 w-full max-md:max-w-full justify-start items-start gap-2">
          <Labels
            label={`${isResignation ? "Resignation" : "Termination"}`}
            backgroungColor={`bg-[#f4e4eb]`}
          />
          <div className="flex flex-wrap items-center justify-between w-full">
            <div className="flex flex-col gap-2 justify-start max-w-[70%]">
              <h1 className="text-2xl font-bold text-zinc-800 mb-0">
                {resignation.emp_name}
              </h1>
              <p className=" text-base text-zinc-600">
                ID: <EmployeeID value={resignation?.employee_id} /> |{" "}
                <DesignationName value={resignation.position} /> |
                <DepartmentName value={resignation.department_name} />
              </p>
            </div>
            {isResignation ? (
              <RenderResignationAction row={resignation} viewMode={true} />
            ) : (
              <></>
            )}
          </div>
        </section>
        <section>
          <ViewDetailBox
            labelList={[
              {
                label: "Joining date",
                value: moment(resignation?.joining_date).format("DD-MM-YYYY"),
              },
              {
                label: "Status",
                value: ResignationStatus(resignation.status_resignation),
              },
              {
                label: "Report to",
                value: <ManagerName value={resignation.report_to[0]} />,
              },
              {
                label: "Reason for leaving",
                value: ResignationReason(resignation.exit_type),
              },

              {
                label: "Exit date",
                value: moment(resignation?.exit_date).format("DD-MM-YYYY"),
              },

              {
                label: "Notice Period",
                value: resignation.notice_period || "N/A",
              },
              {
                label: "Phone no.",
                value: `${resignation?.country_code || ""}${
                  resignation?.mobile_no || ""
                }`,
              },
            ]}
          />
          <ViewAttachmentDetail
            title={"Attachments"}
            attachments={[
              {
                name: `${resignation.emp_name} - ${
                  isResignation ? "Resignation" : "Termination"
                } letter`,
                file: isResignation
                  ? resignation?.resignation_letter
                  : resignation?.termination_letter,
              },
            ]}
          />
        </section>
        {ExitStatusCurrentStep(
          isResignation
            ? resignation?.status_resignation
            : resignation?.status_termination
        ) === 3 && (
          <section className="my-3">
            <Row>
              <Col lg={12}>
                <Formik
                  initialValues={resignation}
                  innerRef={formRef}
                  enableReinitialize={true}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                  }}
                  validate={(values) => {
                    const errors = {};
                    if(!values.clearance_report){
                      errors.clearance_report ="Please upload clearance report to proceed"
                    }
                    return errors;
                  }}
                >
                  {(props) => (
                    <Form onSubmit={props.handleSubmit}>
                      <Row>
                        <Col md="12">
                          <FileInput
                            name="clearance_report"
                            label=" Clearance Report or drag it here"
                            acceptType=".pdf"
                            error={props.errors?.clearance_report}
                            touch={props.touched?.clearance_report}
                            value={props.values?.clearance_report}
                            required={true}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <Col md="4">
                          <Button type="submit" className="btn btn-dark w-100">
                            {isResignation ? "Resigned" : "Terminated"}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExitDetailsCard;
