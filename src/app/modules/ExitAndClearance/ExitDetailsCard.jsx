import moment from "moment";
import React, { useState, useRef } from "react";
import { RenderResignationAction, RenderTerminationAction } from "./Sections";
// import {
//   ViewDetailHeader,
//   Labels,
//   ViewDetailBox,
//   ViewAttachmentDetail,
// } from "components";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  TerminationStatus,
  ResignationReason,
  ResignationStatus,
  ManagerName,
} from "utils/getValuesFromTables";
import { RxCross2 } from "react-icons/rx";
import pdfIcon from "assets/images/pdfIcon.svg";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { AiOutlineDownload } from "react-icons/ai";
import { filebase64Download, getFileSizeInKB } from "utils/fileUtils";
import { Formik } from "formik";
import { FileInput } from "components/form-control";
import { Col, Row, Form, Button } from "reactstrap";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { ExitStatusCurrentStep } from "./Sections";
import { TerminationReason } from "utils/getValuesFromTables";

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

  console.log("resig list", resignation.reason_of_termination);
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
              <RenderTerminationAction row={resignation} viewMode={true} />
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
                value: isResignation
                  ? ResignationStatus(resignation.status_resignation)
                  : TerminationStatus(resignation.status_termination),
              },
              {
                label: "Report to",
                value: <ManagerName value={resignation.report_to} />,
              },
              {
                label: "Reason for leaving",
                value: isResignation ? (
                  ResignationReason(resignation.exit_type)
                ) : (
                  <TerminationReason
                    value={resignation.reason_of_termination}
                  />
                ),
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
        ) >= 3 && (
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
                    if (!values.clearance_report) {
                      errors.clearance_report =
                        "Please upload clearance report to proceed";
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

const ViewDetailBox = ({ labelList }) => {
  return (
    <div className="mt-3">
      <div class="grid grid-cols-3 gap-x-8 gap-y-4 mb-4 border border-gray-400 rounded-lg pr-3 pl-4 py-4">
        {labelList &&
          labelList.map((data, index) => {
            return (
              <div className="text-left" key={index}>
                <p class="text-[14px] font-normal">{data?.label}</p>
                <p class="text-[14px] font-semibold">{data?.value ?? "N/A"}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ViewAttachmentDetail = ({ title, attachments }) => {
  return (
    <div className="mt-3">
      <h3 className="font-bold text-base text-[#323333] text-left">{title}</h3>
      {attachments &&
        attachments.map((attachment, index) => {
          if (!attachment.file || !attachment?.file?.file) return "";
          return (
            <div
              key={index}
              className="bg-[#F0F1F2] rounded-lg p-2 flex justify-between items-center my-3"
            >
              <div className="flex gap-x-3">
                <img src={pdfIcon} alt="" />
                <p class="text-[14px] text-[#323333]">
                  <span>{attachment?.name}</span>
                  <span>
                    <p className="self-start mt-1 text-xs leading-none text-zinc-600 text-left">
                      {getFileSizeInKB(attachment?.file?.file)} KB
                    </p>
                  </span>
                </p>
              </div>
              <div
                className="flex gap-x-2 cursor-pointer"
                onClick={() =>
                  filebase64Download(attachment?.file, attachment?.name)
                }
              >
                <p class="text-[14px] text-[#323333]">Download</p>
                <AiOutlineDownload />
              </div>
            </div>
          );
        })}
    </div>
  );
};

const ViewDetailHeader = ({
  onNextClick,
  onPreviousClick,
  closeModel,
  title,
}) => {
  return (
    <div className="flex justify-between gap-x-3 items-center border-b border-[#D7E4FF] b-2">
      <div className="flex flex-wrap">
        <div className="flex">
          <span className="text-xl m-auto">{title}</span>
        </div>
        <div className="flex justify-center ">
          <button
            className="flex items-center px-2 py-2"
            onClick={() => {
              onPreviousClick();
            }}
          >
            <IoChevronBack className="" /> Previous
          </button>
          <button
            className="flex items-center px-2 py-2"
            onClick={() => onNextClick()}
          >
            Next <IoChevronForward className="" />
          </button>
        </div>
      </div>
      <RxCross2
        className="cursor-pointer"
        onClick={() => {
          closeModel();
        }}
      />
    </div>
  );
};

export default ExitDetailsCard;
