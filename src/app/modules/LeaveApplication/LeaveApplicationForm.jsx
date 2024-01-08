import React, { useState } from "react";
import LeaveHeader from "./LeaveHeader";
import Select from "react-select";
import Datepicker from "../Dashboard/Datepicker";
import moment from "moment";
import { reportingManager } from "../../../data/Data";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    dateOfBirth: "",
    position: "",
    department: "",
    joiningDate: "",
    nationality: "",
    leaveType: {
      annual: false,
      casual: false,
      emergency: false,
      maternity: false,
      unpaid: false,
      sick: false,
    },
    reason: "",
    startDate: "",
    endDate: "",
    lastWorkDay: "",
    rejoiningDate: "",
    totalLeaves: "",
    contactNumber: "",
    addressDuringLeave: "",
    reportingManager: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        leaveType: {
          ...formData.leaveType,
          [name]: checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Application Form" />
      <div className="px-2 lg:px-7 h-[74vh] overflow-y-scroll">
        <h1 className="font-sfpro tracking-wide text-[#25A8E0] text-center md:text-left text-xs py-5">
          Note: Annual Leave Application Should be Submitted to HR Two Months
          Prior to Annual Leave Date.
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="flex gap-x-7 items-center py-2">
              <label
                className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
              >
                Employee ID:
              </label>
              <input
                className="h-8 w-32 md:w-44 rounded-md lg:w-52"
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
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
                    className="rounded-md h-8 lg:w-full"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    className="rounded-md h-8 lg:w-full"
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-8">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Joining Date:
                  </label>
                  {/* <input
                    className="rounded-md h-8 w-[180px]"
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                  /> */}
                  {/* <Datepicker className="z-50" name="Deadline" required onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("Deadline", formattedDate);
                    }}
                    /> */}

                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
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
                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
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
                    className="rounded-md h-8 lg:w-full"
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
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
                    className="rounded-md h-8 lg:w-full"
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
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
              <div className="rounded-md w-[180px] py-2 bg-white flex items-center gap-1 flex-wrap justify-end text-xs md:justify-start md:text-sm md:gap-x-2 md:w-[75%] md:pl-5">
                <input
                  type="checkbox"
                  name="emergency"
                  checked={formData.leaveType.emergency}
                  onChange={handleChange}
                />
                <label>Emergency</label>
                <input
                  type="checkbox"
                  name="annual"
                  checked={formData.leaveType.annual}
                  onChange={handleChange}
                />
                <label>Annual</label>
                <input
                  type="checkbox"
                  name="sick"
                  checked={formData.leaveType.sick}
                  onChange={handleChange}
                />
                <label>Sick</label>

                <input
                  type="checkbox"
                  name="maternity"
                  checked={formData.leaveType.maternity}
                  onChange={handleChange}
                />
                <label>Maternity</label>
                <input
                  type="checkbox"
                  name="casual"
                  checked={formData.leaveType.casual}
                  onChange={handleChange}
                />
                <label>Casual</label>

                <input
                  type="checkbox"
                  name="unpaid"
                  checked={formData.leaveType.unpaid}
                  onChange={handleChange}
                />
                <label>Unpaid</label>
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
                className="w-[183px] rounded-md md:w-[77%]"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <h1 className="text-baseBlue text-base tracking-wider font-semibold">
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
                  {/* <input
                    className="rounded-md h-8"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  /> */}
                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-24">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Last Work Day:
                  </label>
                  {/* <input
                    className="rounded-md h-8"
                    type="date"
                    name="lastWorkDay"
                    value={formData.lastWorkDay}
                    onChange={handleChange}
                  /> */}
                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
                  />
                </div>
                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Total Leaves:
                  </label>
                  <input
                    className="rounded-md h-8 lg:w-[56%]"
                    type="text"
                    name="totalLeaves"
                    value={formData.totalLeaves}
                    onChange={handleChange}
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
                  {/* <input
                    className="rounded-md h-8"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  /> */}
                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-20">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Rejoining Date:
                  </label>
                  <Datepicker
                    className="z-50"
                    name="Deadline"
                    required
                    onChange={(date) => {
                      let formattedDate = moment(date).format("YYYY-MM-DD");
                      handleChange("Deadline", formattedDate);
                    }}
                  />
                </div>

                <div className="py-2 flex justify-between lg:justify-normal lg:gap-x-16">
                  <label
                    className="font-sfpro tracking-wide font-semibold
                            text-input text-base"
                  >
                    Contact Number:
                  </label>
                  <input
                    className="rounded-md h-8 lg:w-[56%]"
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
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
                className="rounded-md md:w-[63%]"
                name="addressDuringLeave"
                value={formData.addressDuringLeave}
                onChange={handleChange}
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
                className="w-full md:w-[45%] lg:w-[20%]"
                name="reportingManager"
                options={reportingManager}
                value={formData.reportingManager}
                // onChange={(selectedOption) =>
                //   handleChange("Employee_Type", selectedOption)
                // }
                required
              />
              {/* <select
                name="reportingManager"
                value={formData.reportingManager}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="manager1">Manager 1</option>
                <option value="manager2">Manager 2</option>
                
              </select> */}
            </div>
            <button type="submit" className="bg-baseBlue text-white block m-auto px-6 py-2 rounded-md font-semibold tracking-widest md:mt-4">Submit Application</button>
          </div>
        </form>
      </div>

      <div>
        {/* <form onSubmit={handleSubmit}>
                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Employee ID:
                    </label>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Name:
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Date
                    </label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Position:
                    </label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Department:
                    </label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Joining Date:
                    </label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Nationality:
                    </label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />

                    <div>
                        Leave Type:
                        <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                            Annual
                        </label>
                        <input
                            type="checkbox"
                            name="annual"
                            checked={formData.leaveType.annual}
                            onChange={handleChange}
                        />
                        <label>
                            Casual
                        </label>
                        <input
                            type="checkbox"
                            name="casual"
                            checked={formData.leaveType.casual}
                            onChange={handleChange}
                        />
                        <label>
                            Emergency
                        </label>
                        <input
                            type="checkbox"
                            name="emergency"
                            checked={formData.leaveType.emergency}
                            onChange={handleChange}
                        />
                        <label>
                            Maternity
                        </label>
                        <input
                            type="checkbox"
                            name="maternity"
                            checked={formData.leaveType.maternity}
                            onChange={handleChange}
                        />
                        <label>
                            Unpaid
                        </label>
                        <input
                            type="checkbox"
                            name="unpaid"
                            checked={formData.leaveType.unpaid}
                            onChange={handleChange}
                        />
                        <label>
                            Sick
                        </label>
                        <input
                            type="checkbox"
                            name="sick"
                            checked={formData.leaveType.sick}
                            onChange={handleChange}
                        />
                    </div>

                    <label>
                        Reason:
                    </label>

                    <textarea name="reason" value={formData.reason} onChange={handleChange} />
                    <h1 className='text-3xl'>Leave Details</h1>
                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Start Date:
                    </label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        End Date:
                    </label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Last Work Day:
                    </label>
                    <input type="date" name="lastWorkDay" value={formData.lastWorkDay} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Rejoining Date:
                    </label>
                    <input type="date" name="rejoiningDate" value={formData.rejoiningDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Total Leaves:
                    </label>
                    <input type="text" name="totalLeaves" value={formData.totalLeaves} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Contact Number:
                    </label>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Address During Leave:
                    </label>
                    <textarea name="addressDuringLeave" value={formData.addressDuringLeave} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Reporting Manager:
                    </label>
                    <select name="reportingManager" value={formData.reportingManager} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="manager1">Manager 1</option>
                        <option value="manager2">Manager 2</option>
                    </select>

                    <button type="submit">Submit</button>

                </form> */}
      </div>
    </div>
  );
};

export default EmployeeForm;
