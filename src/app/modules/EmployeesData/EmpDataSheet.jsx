import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import EmpDataHeader from "./EmpDataHeader";
import EmpSheetLoader from "../../../common/EmpSheetLoad";

const userRoles = [
  { value: 3, label: "HR" },
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Manager" },
  { value: 4, label: "Employee" },
];

const EmpDataSheet = ({ baseUrl, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Adjust as needed
  const [filter, setFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/emp/?ordering=id`, {
          headers,
        });
        const usersData = response.data;
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [baseUrl, token]);

  // Filter users locally based on search input
  useEffect(() => {
    setCurrentPage(1); // Reset current page to 1 when search term changes
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
    console.log("Filtered users:", filtered); // Add this line
    setFilteredUsers(filtered);
  }, [filter, users]);

  // Calculate current page users
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle Next and Previous page
  const handleNextPage = () => {
    if (indexOfLastUser < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <EmpDataHeader
        title="Employee Data Sheet"
        onSearch={(term) => setFilter(term)}
      />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] roundScroll">
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left rounded-tl-lg">Employee ID</th>
              <th className="px-6 py-3 text-left">User Name</th>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left rounded-tr-lg">Action</th>
            </tr>
          </thead>
          {loading ? (
            <EmpSheetLoader />
          ) : (
            <tbody className="bg-white text-gray-500">
              {currentUsers.map((user) => (
                <tr
                  className="whitespace-nowrap border-b-2 hover:bg-gray-100"
                  key={user.id}
                >
                  <td className="px-6 py-2 text-left">
                    TXB-{user.id.toString().padStart(4, "0")}
                  </td>
                  <td className="px-6 py-2 text-left">{user.username}</td>
                  <td className="px-6 py-2 text-left">
                    {`${user.first_name} ${user.last_name}`}
                  </td>
                  <td className="px-6 py-2 text-left">{user.email}</td>
                  <td className="px-6 py-2 text-left">
                    {Array.isArray(userRoles) &&
                      userRoles.some((role) => role.value === user.user_role)
                      ? userRoles.find((role) => role.value === user.user_role)
                        .label
                      : ""}
                  </td>
                  <td className="px-6 py-2 text-left">
                    <Link
                      to={`/user/${user.id}`}
                      className="bg-baseBlue text-white px-2 py-[3px] rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
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
          disabled={indexOfLastUser >= filteredUsers.length}
          className={`text-base bg-gray-500 flex items-center gap-x-2 hover:bg-[#259ED8] rounded-md ${indexOfLastUser >= filteredUsers.length ? 'hidden' : ''}`}
        >
          <BsArrowRightShort className="text-white text-2xl" title="Next"  />
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
