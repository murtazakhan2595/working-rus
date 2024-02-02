import React, { useEffect, useState } from "react";
import LeaveHeader from "./LeaveHeader";
import axios from "axios";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

const defaultFormFields = {
  comments: "",
};

const LeaveRequest = ({ baseUrl, token, userProfile }) => {
  const { id } = useParams();
  const [application, setApplication] = useState();
  const [managers, setManagers] = useState([]);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { comments } = formFields;

  console.log(formFields);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  // fetch application by id
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchAplication = async () => {
    try {
      const response = await axios.get(`${baseUrl}/leave/${id}`, { headers });

      if (response.status === 200) {
        setApplication(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, {
        headers,
      });

      if (response.status === 200) {
        console.log("manangers", response.data);
        setManagers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAplication();
    fetchManagers();
  }, []);

  //   reporting manager logic
  const getReportingManger = (userId) => {
    const reportingManger = managers.find((user) => user.id === userId);
    return reportingManger ? reportingManger.department_manager : null;
  };

  // date formatting
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    // Replace slashes with hyphens
    const formattedDateWithHyphens = formattedDate.replace(/\//g, "-");
    return formattedDateWithHyphens;
  };

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Request" />
      <div className="px-3 lg:px-7 h-[76vh] md:h-[76vh] lg:h-[80vh] overflow-y-scroll scroll">
        <form>
          <div className="">
            <div className="flex justify-between items-center py-2 md:justify-normal gap-6 lg:gap-12">
              <label
                className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
              >
                Employee ID:
              </label>
              <input
                className="h-8 ml-[-5px] pl-2 md:mr-[66px] w-[60%] md:w-44 rounded-md lg:w-24"
                value={`TXB-00${application?.employee_id}`}
                disabled
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between md:justify-normal  gap-x-20">
              <div className="flex flex-col md:w-[41%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-[6.5rem]">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Name:
                  </label>
                  <input
                    className="rounded-md ml-[-8px] h-8 pl-2 w-[60%]"
                    value={application?.name}
                    disabled
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-[5.5rem]">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Position:
                  </label>
                  <input
                    className="rounded-md pl-2 ml-[-14px] w-[60%] h-8"
                    value={application?.position}
                    disabled
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-10">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Joining Date:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] h-8"
                    value={formatDate(application?.joining_date)}
                    disabled
                  />
                </div>
              </div>
              <div className="flex flex-col md:w-[41%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-32">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Date
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] lg:w-[58%] h-8"
                    value={formatDate(application?.date)}
                    disabled
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Department:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] lg:w-[58%] h-8"
                    value={application?.department}
                    disabled
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-[4.5rem]">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Nationality:
                  </label>
                  <input
                    placeholder="Enter Nationality Here"
                    className="rounded-md pl-2 w-[60%] lg:w-[58%] h-8"
                    type="text"
                    name="nationality"
                    value={application?.nationality}
                    disabled
                    //   onChange={(e) =>
                    //     handleChange(e.target.name, e.target.value)
                    //   }
                  />
                </div>
              </div>
            </div>
            <div className="py-2 flex justify-between md:justify-normal md:gap-x-7 lg:gap-x-12">
              <div
                className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
              >
                Leave Type:
              </div>
              <div className="rounded-md w-[60%] py-2 bg-[#F6F6F6] flex items-center gap-1 flex-wrap justify-end text-xs md:justify-start md:text-sm md:gap-x-2 md:w-[76.5%] lg:w-[74%] md:pl-5">
                <div className="flex items-center md:gap-2.5 gap-[4px]">
                  <input
                    type="checkbox"
                    checked={application?.leave_type === "EMERGENCY"}
                    disabled
                  />
                  <label>Emergency</label>

                  <input
                    type="checkbox"
                    checked={application?.leave_type === "ANNUAL"}
                    disabled
                  />
                  <label>Annual</label>
                  <input
                    type="checkbox"
                    checked={application?.leave_type === "SICK"}
                    disabled
                  />
                  <label>Sick</label>
                </div>
                <div className="flex items-center md:gap-2.5 gap-[4px]">
                  <input
                    type="checkbox"
                    checked={application?.leave_type === "MATERNITY"}
                    disabled
                  />
                  <label>Maternity</label>
                  <input
                    type="checkbox"
                    checked={application?.leave_type === "CASUAL"}
                    disabled
                  />
                  <label>Casual</label>

                  <input
                    type="checkbox"
                    checked={application?.leave_type === "UNPAID"}
                    disabled
                  />

                  <label>Unpaid</label>
                </div>
              </div>
            </div>

            <div className="py-2 flex justify-between md:justify-normal gap-x-14 lg:gap-x-[4.8rem]">
              <label
                className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
              >
                Reason:
              </label>

              <textarea
                className=" rounded-md pl-2 w-[60%] md:w-[77%] lg:w-[74%]"
                value={application?.reason}
                disabled
              />
            </div>

            <h1 className="text-baseBlue text-base tracking-wider font-semibold lg:my-6">
              Leave Details
            </h1>

            <div className="flex flex-col md:flex-row md:gap-x-20">
              <div className="flex flex-col md:w-[41%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-14">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Start Date:
                  </label>

                  <input
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-[56%]"
                    value={formatDate(application?.start_date)}
                    disabled
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-5">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Last Work Day:
                  </label>

                  <input
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-[56%]"
                    value={formatDate(application?.last_work_day)}
                    disabled
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-9">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Total Leaves:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-[56%]"
                    value={`${application?.total_leave} days`}
                    disabled
                  />
                </div>
              </div>

              <div className="flex flex-col md:w-[44%]">
                <div className="py-2 flex justify-between md:gap-x-20 md:justify-normal lg:gap-x-[5.5rem]">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    End Date:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] md:w-[53%] h-8 lg:w-[53.5%]"
                    value={formatDate(application?.end_date)}
                    disabled
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-12">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base"
                  >
                    Rejoining Date:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] md:w-[53%] h-8 lg:w-[53.5%]"
                    value={formatDate(application?.rejoining_date)}
                    disabled
                  />
                </div>

                <div className="py-2 flex md:gap-x-6 lg:justify-normal lg:gap-x-7">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                              text-input text-base md:w-28 lg:w-36"
                  >
                    Contact Number:
                  </label>
                  <input
                    className="rounded-md pl-2 w-[60%] md:w-[53%] h-8 lg:w-[53.5%]"
                    value={application?.contact_no}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="py-2 flex justify-between md:justify-normal lg:justify-normal md:gap-x-2 lg:gap-x-[16px]">
              <label
                className="font-sfpro tracking-wide font-semibold
                              text-input text-base md:w-28 lg:w-32"
              >
                Address During Leave:
              </label>
              <textarea
                className="rounded-md pl-2  md:w-[77.5%] lg:w-[75%] pointer-events-none"
                value={application?.address_during_leave}
                disabled
              />
            </div>
            <div className="py-2 flex justify-between md:justify-normal lg:gap-x-[18px]">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base md:w-[7.5rem] lg:w-32"
              >
                Reporting Manager:
              </label>
              <input
                className="rounded-md h-8 pl-2 lg:w-[22.5%]"
                value={getReportingManger(application?.report_to)}
                disabled
              />
            </div>
          </div>
        </form>

        {/* comments */}
        <div className="flex items-center justify-between md:justify-normal md:gap-x-11 lg:gap-x-14">
          <h1 className="text-baseBlue text-base tracking-wider font-semibold lg:my-6">
            Comments
          </h1>
          <textarea
            className="rounded-md pl-2  md:w-[77.5%] lg:w-[75%]"
            name="comments"
            onChange={handleChange}
            value={comments}
          />
        </div>

        <div className="flex items-center justify-between mt-3 md:mt-4 lg:mb-6 lg:w-[70%]">
          <button
            type="submit"
            className="bg-[#283B91] text-white block mx-auto px-6 py-1 rounded-md tracking-widest "
          >
            Accept
          </button>
          <button
            type="submit"
            className="bg-[#283B91] text-white block mx-auto px-6 py-1 rounded-md tracking-widest"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveRequest);
