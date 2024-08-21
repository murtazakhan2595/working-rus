import { RxCalendar } from "react-icons/rx";
import { DashboardLeaveTrackerColumns } from "app/modules/Dashboard/Screens/Sections";
import calender from "assets/images/calender.svg";
import { Table, StatusLabel } from "components";
import { useEffect, useState } from "react";
import { FaCaretDown, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormateLeaveTrackerName from "../FormateLeaveTrackerName";
import { getFilteredLeaveApplication } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getDesignationList } from "app/hooks/general";
import CustomDropdown from "../CustomDropdown";
import { RenderLeaveStatusDropdown } from "./Sections";

export default function LeaveTrackerOverview() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [filterApplications, setFilterApplications] = useState({});
  const [designations, setDesignations] = useState([]);
  const [onLeaveToday, setOnLeaveToday] = useState([]);
  const [onLeaveNextWeek, setOnLeaveNextWeek] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [pending_leaves, setPendingLeaves] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All Requests");

  const applyFilters = (applications, filterApplications) => {
    let filteredData = applications;
    console.log(filterApplications);
    console.log(designations);
    console.log("data filter", filteredData);
    if (filterApplications.id_and_first_name) {
      const searchTerm = filterApplications.id_and_first_name.toLowerCase();
      filteredData = filteredData.filter((item) => {
        const id = item.employee_id.toString();
        const name = item.name.toLowerCase();
        return id.includes(searchTerm) || name.includes(searchTerm);
      });
    }
    if (filterApplications.department_position) {
      const position = parseInt(filterApplications.department_position, 10);
      console.log("position", position);
      filteredData = filteredData.filter((item) => {
        return Number(item.position) === position;
      });
    }
    if (filterOption !== "All Requests") {
      filteredData = filteredData.filter((item) => {
        console.log("filterOption", filterOption);
        console.log("status_hr", item.status_hr);
        if (filterOption === "Approved") {
          return item.status_hr === "Approved by HR";
        } else if (filterOption === "Pending") {
          return item.status_hr === "Pending";
        } else if (filterOption === "Rejected") {
          return item.status_hr === "Declined by HR";
        }
        return true;
      });
    }
    return filteredData;
  };

  const getApplications = async () => {
    setLoading(true);
    try {
      const result = await getFilteredLeaveApplication({
        filterData,
      });
      setAllApplications(result.data);
      setOnLeaveToday(result.onLeaveToday);
      setOnLeaveNextWeek(result.onLeaveNextWeek);
      setApplications(result.data);
      setPendingLeaves(result.pending_leaves);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getApplications();
  }, [filterData]);

  useEffect(() => {
    const filteredApplications = applyFilters(
      allApplications,
      filterApplications
    );
    setApplications(filteredApplications);
  }, [filterApplications, filterOption]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterApplications((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const options = [
    {
      label: "All Requests",
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption("All Requests");
      },
    },
    {
      label: "Approved",
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption("Approved");
      },
    },
    {
      label: "Pending",
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption("Pending");
      },
    },
    {
      label: "Rejected",
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption("Rejected");
      },
    },
  ];
  return (
    <div className="h-fit px-3.5 pt-6 pb-3 bg-white rounded-md flex-col justify-start items-start gap-4 inline-flex w-full ">
      <div className=" justify-between w-full items-center gap-[19px] inline-flex">
        <div className="flex items-center justify-start gap-3 p-3 rounded-lg ">
          <RxCalendar />
          <div className="text-[#323233] text-lg font-normal  leading-tight">
            Leave Tracker
          </div>
        </div>
        <Link to="/leave-request-management">
          <div className="pr-2 rounded-[3px] justify-center items-center gap-[3px] flex">
            <div className="text-black text-[14px] font-normal leading-[18px]">
              View All
            </div>
            <FaChevronRight size={11} />
          </div>
        </Link>
      </div>
      <div className="flex gap-4">
        <div className="md:w-[75%] sm:w-[100%]">
          <div className="py-0.5 mb-2 justify-between items-center gap-2 flex flex-wrap w-full">
            <div className="flex flex-wrap items-center justify-start gap-2">
              <RenderLeaveStatusDropdown
                status={filterOption}
                setFilterOption={setFilterOption}
              />
              <StatusLabel
                status={"warning"}
                value={`${pending_leaves} Pending`}
              />
            </div>
            <div className="flex flex-wrap items-center justify-start gap-2">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Name/ID",
                    name: "id_and_first_name",
                    width: "w-[100px]",
                    height: "h-[32px]",
                    className:
                      "focus:outline-none focus:border-non bg-[#F0F1F2] py-1 pl-2 text-[12px] placeholder-[#5C5E64] border-none rounded-md",
                  },
                  {
                    type: "select",
                    option: designations,
                    name: "department_position",
                    placeholder: "Designation",
                    width: "w-32",
                    className: {
                      backgroundColor: "#F0F1F2",
                      fontSize: "12px",
                      height: "32px",
                    },
                  },
                ]}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="overflow-y-auto h-80 m-bottom-zero hideScroll" >
            <Table
              hideTableHeader={true}
              columns={DashboardLeaveTrackerColumns}
              data={applications}
              pagination={false}
              dataStyle={{backgroundColor: "white" , border: "none"}}
            />
          </div>
        </div>
        <div className="flex flex-col md:w-[25%] sm:w-[100%] max-h-[30rem] overflow-y-auto">
          <div className="w-full text-sm font-bold tracking-normal text-zinc-800">
            Who’s on Leave{" "}
          </div>
          <div className="w-full mt-6 text-sm text-zinc-400">Today</div>
          {onLeaveToday?.map((application) => (
            <div className="mt-[23px] flex flex-col gap-2">
              <div className="w-full text-xs text-zinc-600">Nov 09 -Nov 20</div>
              <FormateLeaveTrackerName row={application} />
            </div>
          ))}
          <div className="w-full mt-6 text-sm text-zinc-400">Next Week</div>
          {onLeaveNextWeek?.map((application) => (
            <div className="mt-[23px] flex flex-col gap-2">
              <div className="w-full text-xs text-zinc-600">
                {application.start_date}
              </div>
              <FormateLeaveTrackerName row={application} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
