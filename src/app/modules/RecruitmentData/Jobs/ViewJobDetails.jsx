import { RxCross2 } from "react-icons/rx";
import { useEffect } from "react";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { PiBriefcaseThin } from "react-icons/pi";
import { IoArrowForward } from "react-icons/io5";
import { Labels } from "../Sections";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import {
  getCountryFullName,
  getEmployeeType,
  getWorkType,
  getJobType,
} from "utils/getValuesFromTables";
import { useState } from "react";
import EditJobDetails from "./EditJobDetails";
import { getJobById } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { formatNumber } from "data/Data";
import moment from "moment";
import { Col,Row } from "reactstrap";

const ViewJobDetails = ({ jobId, onClose }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [job, setJob] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setShowEdit(true);
  };

  const handleEditClose = () => {
    getPosts();
    setShowEdit(false);
  };

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const data = await getJobById(jobId);
      setJob(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [jobId]);
  console.log(job)

  return (
    <div className="fixed top-0 right-0 w-[650px] h-full z-10 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-auto shadow-lg p-10">
        <div
          className="absolute right-6 top-6 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 className="text-baseGray" />
        </div>
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <div className="flex justify-between items-center mb-1">
              <Labels
                label={job?.status === "live" ? "Open" : "Close"}
                iconDot={true}
                iconColor={`${
                  job?.status === "live" ? "bg-green-500" : "bg-red-500"
                }`}
                backgroungColor={`${
                  job?.status === "live" ? "bg-green-100" : "bg-red-100"
                }`}
              />
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-capitalize text-base text-baseGray mb-3">
                  {job?.id}
                </p>
                <h2 className="text-2xl text-capitalize font-bold text-[#323333]">
                  {job?.Job_Title}
                </h2>
              </div>
              <div className="text-base text-baseGray flex items-center gap-x-4">
                <button
                  onClick={handleEditClick}
                  className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
                >
                  <CiEdit className="text-xl" />
                  Edit Job
                </button>
                <Link to={`/job-description/${job?.id}`}>
                  <LuExternalLink />
                </Link>
                <PiDotsThreeOutlineFill />
              </div>
            </div>
            <Row className="mb-4 border border-gray-400 rounded-lg px-3 py-4">
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Education</p>
                <p className="text-base font-semibold text-baseGray">
                  {job?.Education}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Job type</p>
                <p className="text-base font-semibold text-baseGray">
                  {getJobType(job?.Job_Type)}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Start date</p>
                <p className="text-base font-semibold text-baseGray">
                  {job?.created_at
                    ? moment(job?.created_at).format("DD-MM-YYYY")
                    : ""}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Work type</p>
                <p className="text-base font-semibold text-baseGray">
                  {getWorkType(job?.Work_type)}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Location</p>
                <p className="text-base font-semibold text-baseGray">
                  {getCountryFullName(job?.location)}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">Deadline</p>
                <p className="text-base font-semibold text-baseGray">
                  {job?.Deadline
                    ? moment(job?.Deadline).format("DD-MM-YYYY")
                    : ""}
                </p>
              </Col>
              <Col lg={4} className="pb-4">
                <p className="text-[14px] font-normal text-baseGray">
                  Employee type
                </p>
                <p className="text-base font-semibold text-baseGray">
                  {getEmployeeType(job?.Employee_Type)}
                </p>
              </Col>
              <Col lg={8}>
                <p className="text-[14px] font-normal text-baseGray">Salary</p>
                <p className="text-base font-semibold text-baseGray">
                  {job?.currency} {formatNumber(job?.min_salary)} -{" "}
                 {formatNumber(job?.max_salary)}
                </p>
              </Col>
            </Row>

            <div className="flex justify-between items-center">
              <button className="flex items-center gap-x-2 rounded-full bg-[#E6E9F0] px-3 py-1 text-baseGray text-base font-normal">
                <PiBriefcaseThin className="text-xl" />{" "}
                {job?.total_applications} Applications
              </button>
              <Link
                to="/applicants"
                state={{ jobId: job.id }}
                className="border px-3 py-2 rounded-md border-black flex items-center gap-x-2"
              >
                Applications
                <IoArrowForward className="text-xl" />
              </Link>
            </div>
            <div className="mt-3">
              <h3 className="font-bold text-base text-[#323333]">
                Job Description
              </h3>
              <p className="text-base font-normal text-baseGray">
                {job?.Job_Description}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-[#323333]">
                Job Requirements
              </h3>
              <p className="text-base font-normal text-baseGray">
                {job?.Job_Requirement}
              </p>
            </div>
          </>
        )}
      </div>

      {showEdit && <EditJobDetails job={job} onClose={handleEditClose} />}
    </div>
  );
};

export default ViewJobDetails;
