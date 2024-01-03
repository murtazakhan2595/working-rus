// EmpDataSheet.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { Link } from "react-router-dom";
import EmpDataHeader from "./EmpDataHeader";
import Loader from "../../../common/Loader";

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
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filter, setFilter] = useState("");

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
          `${baseUrl}/emp/?ordering=id&page=${page}`,
          {
            headers,
          }
        );
        const usersData = response.data;
        // Apply frontend filtering based on ID, username, or fullname
        const filteredUsers = usersData.filter(
          (user) =>
            user.id.toString().includes(filter) ||
            user.username.toLowerCase().includes(filter) ||
            `${user.first_name} ${user.last_name}`.includes(
              filter.toLowerCase()
            )
        );
        setUsers(filteredUsers);
        setLoading(false);
        setHasNextPage(!!response.data.next);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page, baseUrl, token, filter]);

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <EmpDataHeader
        title="Employee Data Sheet"
        onSearch={(term) => setFilter(term)}
      />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
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
            <Loader />
          ) : (
            <tbody className="bg-white text-gray-500">
              {users.map((user) => (
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
      {/*  <div className="flex justify-end items-center mt-2 px-1 lg:px-8">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`mr-4 w-7 h-7 rounded-2xl border flex justify-center items-center bg-baseBlue 
          ${page === 1 ? "bg-blue-300" : ""}`}
        >
          <BsArrowLeftShort className="text-xl text-white" title="Previous" />
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasNextPage}
          className={`w-7 h-7 rounded-2xl border flex justify-center items-center bg-baseBlue 
          ${!hasNextPage ? "bg-blue-300" : ""}`}
        >
          <BsArrowRightShort className="text-xl text-white" title="Next" />
        </button>
      </div> */}
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
