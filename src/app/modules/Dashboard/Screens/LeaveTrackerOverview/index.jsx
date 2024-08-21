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

import { useState, useMemo } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "../../../../../src/@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../../../../src/@/components/ui/tabs";
import { Input } from "../../../../../src/@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../src/@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../../src/@/components/ui/avatar";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "components/ui/button";
import { Pagination } from "../../../../../src/@/components/ui/pagination";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "../../../../../src/@/components/ui/dropdown-menu"
import { Badge } from "../../../../../src/@/components/ui/badge";



export default function Component() {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState({ key: "name", order: "asc" })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")
  const [designationFilter, setDesignationFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const employees = useMemo(() => {
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        designation: "Software Engineer",
        status: "Active",
        leaveDate: "2023-06-30",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        designation: "Product Manager",
        status: "On Leave",
        leaveDate: "2023-07-15",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 3,
        name: "Michael Johnson",
        email: "michael.johnson@example.com",
        designation: "UI/UX Designer",
        status: "Active",
        leaveDate: "2023-08-01",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        designation: "Data Analyst",
        status: "Active",
        leaveDate: "2023-09-01",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 5,
        name: "David Wilson",
        email: "david.wilson@example.com",
        designation: "Project Manager",
        status: "On Leave",
        leaveDate: "2023-07-31",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 6,
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        designation: "Software Engineer",
        status: "Active",
        leaveDate: "2023-10-15",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 7,
        name: "Daniel Thompson",
        email: "daniel.thompson@example.com",
        designation: "Marketing Coordinator",
        status: "Active",
        leaveDate: "2023-11-01",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 8,
        name: "Olivia Anderson",
        email: "olivia.anderson@example.com",
        designation: "HR Specialist",
        status: "On Leave",
        leaveDate: "2023-08-15",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 9,
        name: "William Martinez",
        email: "william.martinez@example.com",
        designation: "Accountant",
        status: "Active",
        leaveDate: "2023-12-01",
        avatar: "/placeholder-user.jpg",
      },
      {
        id: 10,
        name: "Emma Hernandez",
        email: "emma.hernandez@example.com",
        designation: "Sales Representative",
        status: "Active",
        leaveDate: "2024-01-01",
        avatar: "/placeholder-user.jpg",
      },
    ]
      .filter((employee) => {
        const searchValue = search.toLowerCase()
        const statusFilterValue = statusFilter === "all" ? "" : statusFilter
        const designationFilterValue = designationFilter === "all" ? "" : designationFilter
        return (
          employee.name.toLowerCase().includes(searchValue) ||
          employee.email.toLowerCase().includes(searchValue) ||
          employee.designation.toLowerCase().includes(searchValue) ||
          (statusFilterValue ? employee.status.toLowerCase() === statusFilterValue : true) ||
          (designationFilterValue ? employee.designation.toLowerCase() === designationFilterValue : true) ||
          employee.leaveDate.includes(searchValue)
        )
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key] > b[sort.key] ? 1 : -1
        } else {
          return a[sort.key] < b[sort.key] ? 1 : -1
        }
      })
      .slice((page - 1) * pageSize, page * pageSize)
  }, [search, sort, page, pageSize, statusFilter, designationFilter])
  const handleSort = (key) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === "asc" ? "desc" : "asc" })
    } else {
      setSort({ key, order: "asc" })
    }
  }
  const handlePageChange = (page) => {
    setPage(page)
  }
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setPage(1)
  }
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status)
    setPage(1)
  }
  const handleDesignationFilterChange = (designation) => {
    setDesignationFilter(designation)
    setPage(1)
  }
  return (
    <>
      <Card>
      <CardHeader className="flex flex-col items-start justify-between md:flex-row md:items-center">
    <div className="flex items-center gap-4">
      <h4 className="text-lg font-medium">Leave Tracker</h4>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="md:mr-auto">
        <TabsList className="flex-col md:flex-row">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
    <div className="flex items-center gap-4 mt-4 md:mt-0">
      <div className="relative">
        <Search className="absolute w-4 h-4 right-[16px] top-[13px] text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 pl-4 pr-8 border rounded-md border-input bg-background"
        />
      </div>
      <Link
        href="#"
        className="inline-flex items-center justify-center px-4 text-sm font-medium transition-colors rounded-md shadow h-9 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        prefetch={false}
      >
        View All
      </Link>
    </div>
  </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                  Employees
                  {sort.key === "name" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                
                <TableHead className="cursor-pointer" onClick={() => handleSort("designation")}>
                  Designation
                  {sort.key === "designation" && (
                    <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                  Status
                  {sort.key === "status" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("leaveDate")}>
                  Leave Date
                  {sort.key === "leaveDate" && <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
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
                    <Badge variant={employee.status === "Active" ? "secondary" : "outline"}>{employee.status}</Badge>
                  </TableCell>
                  <TableCell>{employee.leaveDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
         
        </CardContent>
      </Card>


      <div className="flex flex-col gap-4">

        <div className="overflow-auto border rounded-lg">

        </div>
        <div className="flex items-center justify-between">
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={employees.length}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}

function FilterIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}


function Rows2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 12h18" />
    </svg>
  )
}




