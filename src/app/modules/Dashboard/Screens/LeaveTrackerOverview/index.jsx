
import { DashboardLeaveTrackerColumns } from "app/modules/Dashboard/Screens/Sections";
import { StatusLabel } from "components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormateLeaveTrackerName from "../FormateLeaveTrackerName";
import { getFilteredLeaveApplication } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getDesignationList } from "app/hooks/general";
import { RenderLeaveStatusDropdown } from "./Sections";
import TableCustom from "components/TableCustom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from "components/ui/button";


export default function LeaveTrackerOverview() {
  const [applications, setApplications] = useState([]);
  const [ loading,setLoading] = useState(true);
  const [filterData] = useState({});
  const [filterApplications, setFilterApplications] = useState({});
  const [designations, setDesignations] = useState([]);
  const [onLeaveToday, setOnLeaveToday] = useState([]);
  const [onLeaveNextWeek, setOnLeaveNextWeek] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [pending_leaves, setPendingLeaves] = useState(0);
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

  
 
  
  return (
    <>
    <Card className="xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-1 ">
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
        <div className="flex justify-end gap-4 xl:flex-row lg:flex-col md:flex-col sm:flex-col">
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
              <div className="flex flex-wrap gap-4">
              <RenderLeaveStatusDropdown
                status={filterOption}
                setFilterOption={setFilterOption}
              />
              
              <StatusLabel className=""
                status={"warning"}
                value={`${pending_leaves} Pending`}
              />
              </div>
        
               
          </div>
          <TableCustom className=""
              showHeader={true}
              columns={DashboardLeaveTrackerColumns}
              data={applications.slice(0, 5)}
              pagination={false}
              
            />
      </CardContent>     
      </Card>
      
    

      <Card className="w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1">
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





