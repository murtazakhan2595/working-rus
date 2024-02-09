import React, { useEffect, useState } from "react";
import LeaveHeader from "./LeaveHeader";
import axios from "axios";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import LeaveRequestData from "./LeaveRequestData"; // Import LeaveRequestData component
import { toast } from "react-toastify";

const defaultFormFields = {
  comments: "",
};

const LeaveRequestManager = ({ baseUrl, token, userProfile }) => {
  const { id } = useParams();
  const [application, setApplication] = useState();
  const [managers, setManagers] = useState([]);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { comments } = formFields;

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchAplication = async () => {
    try {
      const response = await axios.get(`${baseUrl}/leaveManager/${id}`, {
        headers,
      });
      if (response.status === 200) {
        setApplication(response.data);
        console.log("testing", response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, { headers });
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

  const handleLeaveAction = async (action) => {
    try {
      let status_manager = "";
      if (action === "accept") {
        status_manager = "Approved by Manager";
      } else if (action === "reject") {
        status_manager = "Declined by Manager";
      }

      const response = await axios.put(
        `${baseUrl}/leaveManager/${id}`,
        {
          employee_id: userProfile.id,
          name: application.name,
          date: application.date,
          department: application.department,
          position: application.position,
          nationality: application.nationality,
          joining_date: application.joining_date,
          leave_type: application.leave_type,
          reason: application.reason,
          start_date: application.start_date,
          end_date: application.end_date,
          last_work_day: application.last_work_day,
          rejoining_date: application.rejoining_date,
          total_leave: application.total_leave,
          contact_no: application.contact_no,
          address_during_leave: application.address_during_leave,
          report_to: application.report_to,
          manager_comment: formFields.comments,
          status_manager,
        },
        { headers }
      );

      if (response.status === 200) {
        // Handle success
        if (action === "accept") {
          toast.success("Leave accepted!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          navigate("/leave-list");
        } else if (action === "reject") {
          toast.error("Leave rejected!", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          navigate("/leave-list");
        }
      }
    } catch (error) {
      toast.error(`${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const handleSubmit = async (action) => {
    try {
      // Call handleLeaveAction with the appropriate action
      await handleLeaveAction(action);
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };

  return (
    <div className="bg-[#F9F9F9] w-full">
      <LeaveHeader post="Leave Request" />
      <div className="px-3 lg:px-7 h-[76vh] md:h-[76vh] lg:h-[80vh] overflow-y-scroll scroll">
        <LeaveRequestData application={application} managers={managers} />

        {/* comments */}
        <form className="w-full">
          <div className="flex flex-col md:flex-row items-center justify-between md:justify-normal md:gap-x-11 lg:gap-x-14">
            <h1 className="text-baseBlue text-base tracking-wider font-semibold md:my-6">
              HR Comments
            </h1>
            <textarea
              className="rounded-md pl-2 w-full md:w-[77.5%] lg:w-[75%]"
              name="comments"
              required
              onChange={handleChange}
              value={comments}
            />
          </div>

          <div className="flex items-center justify-between mt-3 md:mt-4 lg:mb-6 lg:w-[70%]">
            <button
              type="button"
              className="bg-[#283B91] text-white block mx-auto px-6 py-1 rounded-md tracking-widest "
              onClick={() => handleSubmit("accept")}
            >
              Accept
            </button>
            <button
              type="button"
              className="bg-[#283B91] text-white block mx-auto px-6 py-1 rounded-md tracking-widest"
              onClick={() => handleSubmit("reject")}
            >
              Reject
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

export default connect(mapStateToProps)(LeaveRequestManager);
