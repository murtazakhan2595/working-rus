import { RxCalendar } from "react-icons/rx";
import { DashboardLeaveTrackerColumns } from "app/modules/Dashboard/Screens/Sections";
import calender from "assets/images/calender.svg";
import { StatusLabel } from "components";

import { useEffect, useState } from "react";
import { FaCaretDown, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import FormateLeaveTrackerName from "../FormateLeaveTrackerName";
import { getFilteredLeaveApplication } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getDesignationList } from "app/hooks/general";
import CustomDropdown from "../CustomDropdown";
import { RenderLeaveStatusDropdown } from "./Sections";
import TableCustom from "components/TableCustom";

import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter, CardSubTitle, CardActions, CardSection, CardBody } from "../../../../../src/@/components/ui/card";
import { Button } from "components/ui/button";


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
    <>
    <Card className="col-span-2 ">
      <CardHeader className="items-start p-6">
        <CardTitle className="flex flex-row justify-between w-full">
        <div className="font-semibold text-plum-1100">
            Leave Tracker 
          </div>
          <Button variant="outline">
          <Link to="/leave-request-management">
          
          View Detail
       
          </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row gap-4">
        <RenderLeaveStatusDropdown
                status={filterOption}
                setFilterOption={setFilterOption}
              />
              <StatusLabel className="text-white bg-yellow-500"
                status={"warning"}
                value={`${pending_leaves} Pending`}
              />
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
          <TableCustom className="overflow-hidden"
              hideTableHeader={true}
              columns={DashboardLeaveTrackerColumns}
              data={applications.slice(0, 5)}
              pagination={false}
              dataStyle={{backgroundColor: "white" , border: "none"}}
            />
      </CardContent>
     
      </Card>
      
    

      <Card>
        <CardHeader>
          <CardTitle>
          <div className="font-semibold text-plum-1100">
            Who's on Leave{""}
          </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          
        <div className="p-4 border-b-1 bg-mauve-200">Today</div>
    {onLeaveToday?.map((application) => (
      <div className="flex flex-col gap-2 p-4">
        <div className="">{application.start_date}</div>
        <FormateLeaveTrackerName row={application} />
      </div>
    ))}
    <div className="p-4 border-b-1 bg-mauve-200">Next Week</div>
    {onLeaveNextWeek?.map((application) => (
      <div className="flex flex-col gap-2 p-4">
        <div className="">
          {application.start_date}
        </div>
        <FormateLeaveTrackerName row={application} />
      </div>
    ))}
          </CardContent>

        
      </Card>
    
    
  
  </>
  );
}





