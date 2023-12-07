import React, { useEffect, useState } from "react";
import EmpDataHeader from "./EmpDataHeader";
import axios from "axios";
import { connect } from "react-redux";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";

const userRoles = [
  { value: 2, label: "HR" },
  { value: 1, label: "Super Admin" },
  { value: 3, label: "Manager" },
  { value: 4, label: "Employee" },
];

const EmpDataSheet = ({ baseUrl, token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasNextPage, setHasNextPage] = useState(true);

  // handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); 
  };
  

  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

   // Fetching users
   useEffect(() => {
  
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/emp/?ordering=id&search=${searchTerm}&page=${page}`,
          {
            headers,
          }
        );
        const usersData = response.data;
        setUsers(usersData);
        setLoading(false);
        setHasNextPage(!!response.data.next);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, [page, searchTerm, baseUrl, token]);
  

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <EmpDataHeader title="Employee Data Sheet" onSearch={handleSearch} />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
                <th className="px-6 py-3 text-left  rounded-tl-lg">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left">User Name</th>
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-500">
              {users.map((user, index) => (
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
          </table>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-2 px-1 lg:px-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`mr-4 w-7 h-7 rounded-2xl border flex justify-center items-center bg-baseBlue 
          ${page === 1 ? "bg-blue-300": ""}`}
        >
          <BsArrowLeftShort className="text-xl text-white" title="Previous" />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
          className={`w-7 h-7 rounded-2xl border flex justify-center items-center bg-baseBlue 
          ${!hasNextPage ? "bg-blue-300": ""}`}
        >
          <BsArrowRightShort className="text-xl text-white" title="Next" />
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
