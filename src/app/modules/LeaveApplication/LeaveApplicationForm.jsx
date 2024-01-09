import React, { useEffect, useState } from "react";
import LeaveHeader from "./LeaveHeader";
import Select from "react-select";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";

const EmployeeForm = ({ baseUrl, token, userProfile }) => {
  const initialData = {
    employee_id: userProfile.id,
    name: "",
    date: null,
    position: "",
    department: "",
    joining_date: null,
    nationality: "",
    leave_type: "",
    reason: "",
    start_date: null,
    end_date: null,
    last_work_day: null,
    rejoining_date: null,
    total_leave: "",
    contact_no: "",
    address_during_leave: "",
    report_to: null,
  };

  const [formData, setFormData] = useState(initialData);
  const [managers, setManagers] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // fetch managers

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/emp/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setManagers(response.data);
        }
      } catch (error) {
        toast.error("Error fetching managers. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    };

    fetchManagers();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      if (name === "report_to") {
        return {
          ...prevData,
          [name]: value,
        };
      }

      if (name.includes("leave_type.")) {
        // Checkbox handling
        const leaveType = name.split(".")[1];
        return {
          ...prevData,
          leave_type: {
            ...prevData.leave_type,
            [leaveType]: !prevData.leave_type[leaveType],
          },
        };
      }

      // Regular input fields
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // Disable the button

    const data = {
      employee_id: formData.employee_id,
      name: formData.name,
      date: formData.date,
      position: formData.position,
      department: formData.department,
      joining_date: formData.joining_date,
      nationality: formData.nationality,
      leave_type: formData.leave_type,
      reason: formData.reason,
      start_date: formData.start_date,
      end_date: formData.end_date,
      last_work_day: formData.last_work_day,
      rejoining_date: formData.rejoining_date,
      total_leave: formData.total_leave,
      contact_no: formData.contact_no,
      address_during_leave: formData.address_during_leave,
      report_to: formData.report_to,
    };

    console.log(data);

    try {
      const response = await axios.post(`${baseUrl}/leave/`, data, {
        headers,
      });

      if (response.status === 201) {
        toast.success("Leave application posted successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });

        // Reset the form
        setFormData(initialData);
      }
    } catch (error) {
      toast.error("Error submitting the form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsButtonDisabled(false); // Re-enable the button
    }
  };

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Application Form" />
      <div className="px-3 lg:px-7 h-[74vh] lg:h-[80vh] overflow-y-scroll">
        <h1 className="font-sfpro tracking-wide text-[#25A8E0] text-center md:text-left text-xs py-5">
          Note: Annual Leave Application Should be Submitted to HR Two Months
          Prior to Annual Leave Date.
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="flex justify-between items-center py-2 lg:justify-normal gap-6">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
              >
                Employee ID:
              </label>
              <input
                className="h-8 ml-[-5px] pl-2 md:mr-[66px] w-[60%] md:w-44 rounded-md lg:w-24"
                type="text"
                name="employee_id"
                value={`TXB-00${formData.employee_id}`}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-between md:justify-normal  gap-x-20">
              <div className="flex flex-col md:w-[41%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-20">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Name:
                  </label>
                  <input
                    placeholder="Enter Name Here"
                    required
                    className="rounded-md ml-[-8px] h-8 pl-2 w-[60%] lg:w-full"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Position:
                  </label>
                  <input
                    placeholder="Enter Position Here"
                    required
                    className="rounded-md pl-2 ml-[-14px] w-[60%] h-8 lg:w-full"
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-8">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Joining Date:
                  </label>
                  <div className="ml-[-14px]">
                    <Datepicker
                      className="z-50"
                      name="joining_date"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("joining_date", formattedDate);
                      }}
                    />
                  </div>
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
                  <div className="ml-[-8px]">
                    <Datepicker
                      className="z-50"
                      name="date"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("date", formattedDate);
                      }}
                    />
                  </div>
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Department:
                  </label>
                  <input
                    placeholder="Enter Department Here"
                    required
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-full ml-[-7px]"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Nationality:
                  </label>
                  <input
                    placeholder="Enter Nationality Here"
                    required
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-full"
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div className="py-2 flex justify-between md:justify-normal md:gap-x-10">
              <div
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
              >
                Leave Type:
              </div>
              <div className="rounded-md ml-[-14px] w-[60%] py-2 bg-white flex items-center gap-1 flex-wrap justify-end text-xs md:justify-start md:text-sm md:gap-x-2 md:w-[75%] md:pl-5">
                <div className="flex items-center gap-2.5">
                  <input
                    required
                    type="checkbox"
                    name="EMERGENCY"
                    checked={formData.leave_type === "EMERGENCY"}
                    onChange={() => handleChange("leave_type", "EMERGENCY")}
                  />
                  <label>Emergency</label>

                  <input
                    required
                    type="checkbox"
                    name="ANNUAL"
                    checked={formData.leave_type === "ANNUAL"}
                    onChange={() => handleChange("leave_type", "ANNUAL")}
                  />
                  <label>Annual</label>
                  <input
                    required
                    type="checkbox"
                    name="SICK"
                    checked={formData.leave_type === "SICK"}
                    onChange={() => handleChange("leave_type", "SICK")}
                  />
                  <label>Sick</label>
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    required
                    type="checkbox"
                    name="MATERNITY"
                    checked={formData.leave_type === "MATERNITY"}
                    onChange={() => handleChange("leave_type", "MATERNITY")}
                  />
                  <label>Maternity</label>
                  <input
                    type="checkbox"
                    name="CASUAL"
                    checked={formData.leave_type === "ANNUAL"}
                    onChange={() => handleChange("leave_type", "ANNUAL")}
                  />
                  <label>Casual</label>

                  <input
                    required
                    type="checkbox"
                    name="UNPAID"
                    checked={formData.leave_type === "UNPAID"}
                    onChange={() => handleChange("leave_type", "UNPAID")}
                  />
                  <label>Unpaid</label>
                </div>
              </div>
            </div>

            <div className="py-2 flex justify-between md:justify-normal gap-x-14">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
              >
                Reason:
              </label>

              <textarea
                required
                // className="rounded-md pl-2 w-[60%] md:w-[63%]"
                className=" rounded-md pl-2 w-[60%] md:w-[77%]"
                name="reason"
                value={formData.reason}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>

            <h1 className="text-baseBlue text-base tracking-wider font-semibold lg:my-6">
              Leave Details
            </h1>

            <div className="flex flex-col md:flex-row md:gap-x-20">
              <div className="flex flex-col md:w-[41%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-32">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Start Date:
                  </label>
                  <div className="ml-[-39px]">
                    <Datepicker
                      className="z-50"
                      name="start_date"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("start_date", formattedDate);
                      }}
                    />
                  </div>
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-24">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Last Work Day:
                  </label>
                  <div className="ml-[-48px]">
                    <Datepicker
                      className="z-50"
                      name="last_work_day"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("last_work_day", formattedDate);
                      }}
                    />
                  </div>
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Total Leaves:
                  </label>
                  <input
                    placeholder="Number of Days Here"
                    required
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-[56%]"
                    type="text"
                    name="total_leave"
                    value={formData.total_leave}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col md:w-[44%]">
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-32">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    End Date:
                  </label>
                  <div className="ml-[-6px]">
                    <Datepicker
                      className="z-50"
                      name="end_date"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("end_date", formattedDate);
                      }}
                    />
                  </div>
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-20">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Rejoining Date:
                  </label>
                  <div className="ml-[-5px]">
                    <Datepicker
                      className="z-50"
                      name="rejoining_date"
                      required
                      onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("rejoining_date", formattedDate);
                      }}
                    />
                  </div>
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Contact Number:
                  </label>
                  <input
                    placeholder="Enter Contact Here"
                    required
                    className="rounded-md pl-2 w-[60%] h-8 lg:w-[56%]"
                    type="text"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="py-2 flex justify-between md:justify-normal lg:justify-normal gap-x-16 lg:gap-x-10">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base lg:w-32"
              >
                Address During Leave:
              </label>
              <textarea
                required
                className="rounded-md pl-2  md:w-[74%]"
                name="address_during_leave"
                value={formData.address_during_leave}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>
            <div className="py-2 flex justify-between md:justify-normal gap-x-10">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
              >
                Reporting Manager:
              </label>
              <Select
                menuPlacement="auto"
                className="w-full md:w-[45%] lg:w-[20%]"
                name="report_to"
                options={managers?.map((manager) => ({
                  value: manager.id,
                  label: manager.department_manager,
                }))}
                value={formData.report_to ? formData.report_to.value : null}
                onChange={(selectedOption) =>
                  handleChange("report_to", selectedOption.value)
                }
              />
            </div>
            <button
              disabled={isButtonDisabled}
              type="submit"
              className="bg-[#283B91] text-white block mx-auto px-6 py-2 rounded-md font-semibold tracking-widest md:mt-4 lg:mb-6"
            >
              Submit Application
            </button>
          </div>
        </form>
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

export default connect(mapStateToProps)(EmployeeForm);
