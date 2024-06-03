import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BsArrowLeftShort, BsArrowRightShort, BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import EmpDataHeader from "./EmpDataHeader";
import EmpSheetLoader from "../../../components/EmpSheetLoad";
import { toast } from "react-toastify";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import tie from '../../../assets/images/tie.png';
import profile from '../../../assets/images/profile.png';
import active from '../../../assets/images/active.png';

const userRoles = [
  { value: 3, label: "HR" },
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Manager" },
  { value: 4, label: "Employee" },
];

const actions = [
  { value: 'user', label: 'View' },
  { value: 'edit-employee', label: 'Edit Employee' },
  { value: 'profile', label: 'Edit Profile' },
  { value: 'delete', label: 'Delete' }
];

const EmpDataSheet = ({ baseUrl, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filter, setFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch users from API with pagination
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/emp/?page=${page}&page_size=${itemsPerPage}`, {
        headers
      });
      
      setUsers(response.data); // Assuming response.data contains the user data directly
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, baseUrl, token]);

  // Update filtered users based on search term
  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = users.filter((user) => {
      const userIdWithPrefix = `TXB-${user.id.toString().padStart(4, "0")}`;
      return (
        userIdWithPrefix.toLowerCase().includes(lowerCaseFilter) ||
        user.username.toLowerCase().includes(lowerCaseFilter) ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerCaseFilter) ||
        user.email.toLowerCase().includes(lowerCaseFilter)
      );
    });
    setFilteredUsers(filtered);
  }, [filter, users]);

  const handleDelete = async (employeeId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${baseUrl}/emp/${employeeId}`, { headers });
      if (response.status === 204) {
        toast.success("User deleted successfully", { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
        fetchUsers(currentPage);
      } else {
        toast.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      toast.error(error.message, { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const toggleDropdown = (userId) => {
    setOpenDropdownRow(userId === openDropdownRow ? null : userId);
  };

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2] h-[100vh]">
      {/* <EmpDataHeader title="Employee Data Sheet" onSearch={(term) => setFilter(term)} /> */}
  <div className="px-6">
        {/* header part */}
        <div className="flex md:justify-between md:px-9 md:py-7">
        <h2 className="font-lato text-2xl font-bold text-baseGray leading-normal">Profile Management</h2>
        <button className="flex items-center gap-x-2 text-white text-base font-semibold leading-6 bg-black rounded-lg font-opensans md:px-4">
          <div className="text-xl">+</div>
          <div>Add Employee</div>
        </button>
      </div>
      {/* blocks */}
      <div className="flex items-center gap-x-6">
        <div className="md:w-[32%] bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px]">
          <img src={profile} alt="tie icon" />
          <div>
            <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">Total Employees</h4>
            <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">42</h2>
          </div>
        </div>
        <div className="md:w-[32%] bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px]">
          <img src={tie} alt="tie icon" />
          <div>
            <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">Mangers only</h4>
            <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">11</h2>
          </div>
        </div>
        <div className="md:w-[32%] bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px]">
          <img src={active}  alt="tie icon" />
          <div>
            <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">Active Employees</h4>
            <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">48</h2>
          </div>
        </div>
      </div>
  </div>
        {/* Table */}
      <div className="md:p-4 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] roundScroll">
      <div className="overflow-hidden rounded-t-[10px] bg-[#EBECED]">
  <table className="min-w-full">
    <thead>
      <tr className="text-[#323333] font-lato text-base font-normal leading-5">
        <th className="px-3 py-2 text-left">ID</th>
        <th className="px-3 py-2 text-left">Name</th>
        <th className="px-3 py-2 text-left">Role</th>
        <th className="px-3 py-2 text-left">User Name</th>
        <th className="px-3 py-2 text-left">Phone no/Email</th>
        <th className="px-3 py-2 text-left">Status</th>
        <th className="px-3 py-2 text-center">Action</th>
      </tr>
    </thead>
    {loading ? (
      <EmpSheetLoader />
    ) : (
      <tbody className="bg-white text-gray-500">
        {filteredUsers.map((user) => (
          <React.Fragment key={user.id}>
            <tr className="whitespace-nowrap border-b-2 hover:bg-gray-100">
              <td className="px-3 font-lato text-base text-baseGray font-normal leading-5 py-1 text-left">TXB-{user.id.toString().padStart(4, "0")}</td>
              <td className="px-3 py-1 text-left flex items-center gap-x-[10px]">
              <div className="bg-[#BE24A5] text-[#FAFBFC] flex font-lato font-semibold text-lg items-center justify-center rounded-full w-10 h-10">
    {user.first_name.toUpperCase().charAt(0)}{user.last_name.toUpperCase().charAt(0)}
  </div>
<div className="flex flex-col">
<div className="text-base font-bold leading-normal text-[#323333] font-lato">{`${user.first_name} ${user.last_name}`}</div>
                <div className="text-base font-lato">{`${user.department_position}`}</div>
</div>
              </td>
              <td className="px-3 py-1 text-left">{Array.isArray(userRoles) &&
                  userRoles.some((role) => role.value === user.user_role)
                  ? userRoles.find((role) => role.value === user.user_role).label
                  : ""}</td>
              <td className="px-3 py-1 text-left">{user.username}</td>
              <td className="px-3 py-1 text-left">
              <div className="flex flex-col">
                <div className="text-base font-lato">{`${user.mobile_no}`}</div>
                <div className="text-base font-lato">{`${user.email}`}</div>
</div>
              </td>
              <td className="px-3 py-1 text-left text-sm font-lato">{user.employee_status}</td>

              <td className="px-4 py-1 text-right gap-x-2 relative">
                {/* <button
                  onClick={() => toggleDropdown(user.id)}
                  className="border-2 text-baseBlue border-blue-500 px-2 py-[2px] rounded flex gap-x-3 items-center"
                >
                  Actions
                  <IoIosArrowDropdownCircle />
                </button> */}
                <div className="w-6 h-6  flex justify-center cursor-pointer items-center rounded-full bg-[#F0F1F2] hover:bg-[#dbeff8]">
                <BsThreeDots onClick={() => toggleDropdown(user.id)} className="" />
                </div>
                {openDropdownRow === user.id && (
                  <div className="absolute right-12 top-[34px] bg-white border text-baseBlue font-semibold border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                    <Link
                      to={`/profile/${user.id}`}
                      className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
                    >
                      Edit Profile
                    </Link>
                    <Link
                      to={`/edit-employee/${user.id}`}
                      className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
                    >
                      Edit Employee
                    </Link>
                    <Link
                      to={`/user/${user.id}`}
                      className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
                    >
                      View Employee
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className='block px-2 py-1 text-sm cursor-pointer border border-gray-300 hover:bg-blue-100'
                    >
                      Delete Employee
                    </button>
                  </div>
                )}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    )}
  </table>
</div>

      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end gap-x-8 items-center pr-16">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`text-base bg-gray-500 flex items-center gap-x-2 hover:bg-[#259ED8] rounded-md ${currentPage === 1 ? 'hidden' : ''}`}
        >
          <BsArrowLeftShort className="text-white text-2xl" title="Previous" />
        </button>
        <button
          onClick={handleNextPage}
          disabled={users.length < itemsPerPage}
          className={`text-base bg-gray-500 flex items-center gap-x-2 hover:bg-[#259ED8] rounded-md ${users.length < itemsPerPage ? 'hidden' : ''}`}
        >
          <BsArrowRightShort className="text-white text-2xl" title="Next" />
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(EmpDataSheet);



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { connect } from "react-redux";
// import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
// import { Link } from "react-router-dom";
// import EmpDataHeader from "./EmpDataHeader";
// import EmpSheetLoader from "../../../components/EmpSheetLoad";
// import { toast } from "react-toastify";


// import { IoIosArrowDropdownCircle } from "react-icons/io";

// const userRoles = [
//   { value: 3, label: "HR" },
//   { value: 1, label: "Super Admin" },
//   { value: 2, label: "Manager" },
//   { value: 4, label: "Employee" },
// ];

// const actions = [
//   { value: 'user', label: 'View' },
//   { value: 'edit-employee', label: 'Edit Employee' },
//   { value: 'profile', label: 'Edit Profile' },
//   { value: 'delete', label: 'Delete' }
// ];

// const EmpDataSheet = ({ baseUrl, token }) => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8); // Adjust as needed
//   const [filter, setFilter] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [openDropdownRow, setOpenDropdownRow] = useState(null);

//   // Functions for calling the API
//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };

//   // Fetch users from API
//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`${baseUrl}/emp/?ordering=id`, {
//         headers,
//       });
//       const usersData = response.data;
//       setUsers(usersData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [baseUrl, token]);


//   const handleDelete = async (employeeId) => {
//     try {
//       setLoading(true);
//       const response = await axios.delete(`${baseUrl}/emp/${employeeId}`, {
//         headers,
//       });
//       if (response.status === 204) {
//         toast.success("User deleted Successfully", {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1000,
//         });
//         // Update state after deletion
//         setUsers(users.filter(user => user.id !== employeeId));
//       } else {
//         toast.error("Unexpected response status:", response.status);
//       }
//     } catch (error) {
//       toast.error(error, {
//         position: toast.POSITION.TOP_RIGHT,
//         autoClose: 1000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   // Filter users locally based on search input
//   useEffect(() => {
//     setCurrentPage(1); // Reset current page to 1 when search term changes
//     const lowerCaseFilter = filter.toLowerCase();
//     const filtered = users.filter((user) => {
//       const userIdWithPrefix = `TXB-${user.id.toString().padStart(4, "0")}`;
//       return (
//         userIdWithPrefix.toLowerCase().includes(lowerCaseFilter) ||
//         user.username.toLowerCase().includes(lowerCaseFilter) ||
//         `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerCaseFilter) ||
//         user.email.toLowerCase().includes(lowerCaseFilter)
//       );
//     });
//     setFilteredUsers(filtered);
//   }, [filter, users]);

//   // Calculate current page users
//   const indexOfLastUser = currentPage * itemsPerPage;
//   const indexOfFirstUser = indexOfLastUser - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

//   // Handle Next and Previous page
//   const handleNextPage = () => {
//     if (indexOfLastUser < filteredUsers.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   // Toggle dropdown for a specific row
//   const toggleDropdown = (userId) => {
//     setOpenDropdownRow(userId === openDropdownRow ? null : userId);
//   };

//   return (
//     <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
//       <EmpDataHeader
//         title="Employee Data Sheet"
//         onSearch={(term) => setFilter(term)}
//       />

//       {/* Table */}
//       <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] roundScroll">
//         <table className="min-w-full">
//           <thead>
//             <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
//               <th className="px-4 py-3 text-left rounded-tl-lg">Employee ID</th>
//               <th className="px-6 py-3 text-left">User Name</th>
//               <th className="px-6 py-3 text-left">Full Name</th>
//               <th className="px-6 py-3 text-left">Email</th>
//               <th className="px-6 py-3 text-left">Role</th>
//               <th className="px-6 py-3 text-left rounded-tr-lg">Actions</th>
//             </tr>
//           </thead>
//           {loading ? (
//             <EmpSheetLoader />
//           ) : (
//             <tbody className="bg-white text-gray-500">
//               {currentUsers.map((user) => (
//                 <React.Fragment key={user.id}>
//                   <tr
//                     className="whitespace-nowrap border-b-2 hover:bg-gray-100"
//                   >
//                     <td className="px-6 py-1 text-left">
//                       TXB-{user.id.toString().padStart(4, "0")}
//                     </td>
//                     <td className="px-6 py-1 text-left">{user.username}</td>
//                     <td className="px-6 py-1 text-left">
//                       {`${user.first_name} ${user.last_name}`}
//                     </td>
//                     <td className="px-6 py-1 text-left">{user.email}</td>
//                     <td className="px-6 py-1 text-left">
//                       {Array.isArray(userRoles) &&
//                         userRoles.some((role) => role.value === user.user_role)
//                         ? userRoles.find((role) => role.value === user.user_role)
//                           .label
//                         : ""}
//                     </td>
//                     <td className="px-6 py-1 text-left gap-x-2 relative">
//                       <button
//                         onClick={() => toggleDropdown(user.id)}
//                         className="border-2 text-baseBlue border-blue-500 px-2 py-[2px] rounded flex gap-x-3 items-center"
//                       >Actions
//                         <IoIosArrowDropdownCircle />
//                       </button>
//                       {openDropdownRow === user.id && (
//                         <div className="absolute right-12 top-[34px] bg-white border text-baseBlue font-semibold border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">

//                           <Link
//                             to={`/profile/${user.id}`}
//                             className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
//                           >
//                             Edit Profile
//                           </Link>
//                           <Link
//                             to={`/edit-employee/${user.id}`}
//                             className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
//                           >
//                             Edit Employee
//                           </Link>
//                           <Link
//                             to={`/user/${user.id}`}
//                             className='block px-2 py-1 text-sm border border-gray-300 hover:bg-blue-100'
//                           >
//                             View Employee
//                           </Link>

//                           <button onClick={() => handleDelete(user.id)}
//                             className='block px-2 py-1 text-sm cursor-pointer border border-gray-300 hover:bg-blue-100'
//                           >
//                             Delete Employee
//                           </button>

//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 </React.Fragment>
//               ))}
//             </tbody>
//           )}
//         </table>
//       </div>
//       {/* Pagination Controls */}
//       <div className="flex justify-end gap-x-8 items-center pr-16">
//         <button
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           className={`text-base bg-gray-500 flex items-center gap-x-2 hover:bg-[#259ED8] rounded-md ${currentPage === 1 ? 'hidden' : ''}`}
//         >
//           <BsArrowLeftShort className="text-white text-2xl" title="Previous" />
//         </button>

//         <button
//           onClick={handleNextPage}
//           disabled={indexOfLastUser >= filteredUsers.length}
//           className={`text-base bg-gray-500 flex items-center gap-x-2 hover:bg-[#259ED8] rounded-md ${indexOfLastUser >= filteredUsers.length ? 'hidden' : ''}`}
//         >
//           <BsArrowRightShort className="text-white text-2xl" title="Next" />
//         </button>
//       </div>
//     </div>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     token: state.user.token,
//     baseUrl: state.user.baseUrl,
//   };
// };

// export default connect(mapStateToProps)(EmpDataSheet);
