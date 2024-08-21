// import { RxCalendar } from "react-icons/rx";
// import { DashboardLeaveTrackerColumns } from "app/modules/Dashboard/Screens/Sections";
// import calender from "assets/images/calender.svg";
// import { Table, StatusLabel } from "components";
// import { useEffect, useState } from "react";
// import { FaCaretDown, FaChevronDown, FaChevronRight } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import FormateLeaveTrackerName from "../FormateLeaveTrackerName";
// import { getFilteredLeaveApplication } from "app/hooks/leaveManagment";
// import { FilterInput } from "components/form-control";
// import { getDesignationList } from "app/hooks/general";
// import CustomDropdown from "../CustomDropdown";
// import { RenderLeaveStatusDropdown } from "./Sections";

// export default function LeaveTrackerOverview() {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterData, setFilterData] = useState({});
//   const [filterApplications, setFilterApplications] = useState({});
//   const [designations, setDesignations] = useState([]);
//   const [onLeaveToday, setOnLeaveToday] = useState([]);
//   const [onLeaveNextWeek, setOnLeaveNextWeek] = useState([]);
//   const [allApplications, setAllApplications] = useState([]);
//   const [pending_leaves, setPendingLeaves] = useState(0);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [filterOption, setFilterOption] = useState("All Requests");

//   const applyFilters = (applications, filterApplications) => {
//     let filteredData = applications;
//     console.log(filterApplications);
//     console.log(designations);
//     console.log("data filter", filteredData);
//     if (filterApplications.id_and_first_name) {
//       const searchTerm = filterApplications.id_and_first_name.toLowerCase();
//       filteredData = filteredData.filter((item) => {
//         const id = item.employee_id.toString();
//         const name = item.name.toLowerCase();
//         return id.includes(searchTerm) || name.includes(searchTerm);
//       });
//     }
//     if (filterApplications.department_position) {
//       const position = parseInt(filterApplications.department_position, 10);
//       console.log("position", position);
//       filteredData = filteredData.filter((item) => {
//         return Number(item.position) === position;
//       });
//     }
//     if (filterOption !== "All Requests") {
//       filteredData = filteredData.filter((item) => {
//         console.log("filterOption", filterOption);
//         console.log("status_hr", item.status_hr);
//         if (filterOption === "Approved") {
//           return item.status_hr === "Approved by HR";
//         } else if (filterOption === "Pending") {
//           return item.status_hr === "Pending";
//         } else if (filterOption === "Rejected") {
//           return item.status_hr === "Declined by HR";
//         }
//         return true;
//       });
//     }
//     return filteredData;
//   };

//   const getApplications = async () => {
//     setLoading(true);
//     try {
//       const result = await getFilteredLeaveApplication({
//         filterData,
//       });
//       setAllApplications(result.data);
//       setOnLeaveToday(result.onLeaveToday);
//       setOnLeaveNextWeek(result.onLeaveNextWeek);
//       setApplications(result.data);
//       setPendingLeaves(result.pending_leaves);
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     getApplications();
//   }, [filterData]);

//   useEffect(() => {
//     const filteredApplications = applyFilters(
//       allApplications,
//       filterApplications
//     );
//     setApplications(filteredApplications);
//   }, [filterApplications, filterOption]);

//   useEffect(() => {
//     const fetchLists = async () => {
//       try {
//         const designationResponse = await getDesignationList();
//         setDesignations(designationResponse);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchLists();
//   }, []);

//   const handleFilterChange = (filterName, filterValue) => {
//     setFilterApplications((prevFilters) => {
//       const updatedFilters = { ...prevFilters };
//       if (filterValue === "") {
//         delete updatedFilters[filterName];
//       } else {
//         updatedFilters[filterName] = filterValue;
//       }
//       return updatedFilters;
//     });
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };
//   const options = [
//     {
//       label: "All Requests",
//       onClick: () => {
//         setIsDropdownOpen(false);
//         setFilterOption("All Requests");
//       },
//     },
//     {
//       label: "Approved",
//       onClick: () => {
//         setIsDropdownOpen(false);
//         setFilterOption("Approved");
//       },
//     },
//     {
//       label: "Pending",
//       onClick: () => {
//         setIsDropdownOpen(false);
//         setFilterOption("Pending");
//       },
//     },
//     {
//       label: "Rejected",
//       onClick: () => {
//         setIsDropdownOpen(false);
//         setFilterOption("Rejected");
//       },
//     },
//   ];
//   return (
//     <div className="h-fit px-3.5 pt-6 pb-3 bg-white rounded-md flex-col justify-start items-start gap-4 inline-flex w-full ">
//       <div className=" justify-between w-full items-center gap-[19px] inline-flex">
//         <div className="flex items-center justify-start gap-3 p-3 rounded-lg ">
//           <RxCalendar />
//           <div className="text-[#323233] text-lg font-normal  leading-tight">
//             Leave Tracker 1
//           </div>
//         </div>
//         <Link to="/leave-request-management">
//           <div className="pr-2 rounded-[3px] justify-center items-center gap-[3px] flex">
//             <div className="text-black text-[14px] font-normal leading-[18px]">
//               View All
//             </div>
//             <FaChevronRight size={11} />
//           </div>
//         </Link>
//       </div>
//       <div className="flex gap-4">
//         <div className="md:w-[75%] sm:w-[100%]">
//           <div className="py-0.5 mb-2 justify-between items-center gap-2 flex flex-wrap w-full">
//             <div className="flex flex-wrap items-center justify-start gap-2">
//               <RenderLeaveStatusDropdown
//                 status={filterOption}
//                 setFilterOption={setFilterOption}
//               />
//               <StatusLabel
//                 status={"warning"}
//                 value={`${pending_leaves} Pending`}
//               />
//             </div>
//             <div className="flex flex-wrap items-center justify-start gap-2">
//               <FilterInput
//                 filters={[
//                   {
//                     type: "search",
//                     placeholder: "Name/ID",
//                     name: "id_and_first_name",
//                     width: "w-[100px]",
//                     height: "h-[32px]",
//                     className:
//                       "focus:outline-none focus:border-non bg-[#F0F1F2] py-1 pl-2 text-[12px] placeholder-[#5C5E64] border-none rounded-md",
//                   },
//                   {
//                     type: "select",
//                     option: designations,
//                     name: "department_position",
//                     placeholder: "Designation",
//                     width: "w-32",
//                     className: {
//                       backgroundColor: "#F0F1F2",
//                       fontSize: "12px",
//                       height: "32px",
//                     },
//                   },
//                 ]}
//                 onChange={handleFilterChange}
//               />
//             </div>
//           </div>
//           <div className="overflow-y-auto h-80 m-bottom-zero hideScroll" >
//             <Table
//               hideTableHeader={true}
//               columns={DashboardLeaveTrackerColumns}
//               data={applications}
//               pagination={false}
//               dataStyle={{backgroundColor: "white" , border: "none"}}
//             />
//           </div>
//         </div>
//         <div className="flex flex-col md:w-[25%] sm:w-[100%] max-h-[30rem] overflow-y-auto">
//           <div className="w-full text-sm font-bold tracking-normal text-zinc-800">
//             Who’s on Leave{" "}
//           </div>
//           <div className="w-full mt-6 text-sm text-zinc-400">Today</div>
//           {onLeaveToday?.map((application) => (
//             <div className="mt-[23px] flex flex-col gap-2">
//               <div className="w-full text-xs text-zinc-600">Nov 09 -Nov 20</div>
//               <FormateLeaveTrackerName row={application} />
//             </div>
//           ))}
//           <div className="w-full mt-6 text-sm text-zinc-400">Next Week</div>
//           {onLeaveNextWeek?.map((application) => (
//             <div className="mt-[23px] flex flex-col gap-2">
//               <div className="w-full text-xs text-zinc-600">
//                 {application.start_date}
//               </div>
//               <FormateLeaveTrackerName row={application} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"

import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "../../../../../src/@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../../src/@/components/ui/tabs";
import { Input } from "../../../../../src/@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../src/@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../../src/@/components/ui/avatar";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/button";

export default function Component() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const employees = [
    {
      name: "John Doe",
      email: "john@example.com",
      designation: "Software Engineer",
      leaveStatus: "Approved",
      leaveStart: "2023-06-01",
      leaveEnd: "2023-06-05",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      designation: "Product Manager",
      leaveStatus: "Pending",
      leaveStart: "2023-07-15",
      leaveEnd: "2023-07-20",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Bob Johnson",
      email: "bob@example.com",
      designation: "UI Designer",
      leaveStatus: "Approved",
      leaveStart: "2023-08-10",
      leaveEnd: "2023-08-15",
      avatar: "/placeholder-user.jpg",
    },
    {
      name: "Sarah Lee",
      email: "sarah@example.com",
      designation: "QA Analyst",
      leaveStatus: "Denied",
      leaveStart: "2023-09-01",
      leaveEnd: "2023-09-05",
      avatar: "/placeholder-user.jpg",
    },
  ]
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-between md:items-center">
      <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100">Leave Tracker</div>
          <Button variant="outline" className="text-sm rounded-full text-slate-900 h-7">
            <Link to="#">View Details</Link>
          </Button>
        </CardTitle>
        <div className="flex justify-between w-full flew-row">

        <div className="flex items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="md:mr-auto">
            <TabsList className="flex-col md:flex-row">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute w-4 h-4 right-2 top-2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pl-4 pr-8 border rounded-md border-input bg-background"
            />
          </div>
          
        </div>
        </div>
      
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employees</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Leave Status</TableHead>
              <TableHead>Leave Dates</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.email}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-muted-foreground">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      employee.leaveStatus === "Approved"
                        ? "bg-green-100 text-green-600"
                        : employee.leaveStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {employee.leaveStatus}
                  </div>
                </TableCell>
                <TableCell>
                  {employee.leaveStart} - {employee.leaveEnd}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

