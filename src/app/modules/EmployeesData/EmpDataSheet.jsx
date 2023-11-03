import { useEffect, useState } from "react";
import EmpDataHeader from "./EmpDataHeader";
import axios from "axios";
import { connect } from "react-redux";

const userRoles = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "HR" },
  { value: 3, label: "Manager" },
  { value: 4, label: "Employee" },
];

const EmpDataSheet = ({baseUrl, token}) => {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    console.log(users)


      // Functions for calling api started
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/emp/`, { headers });
        const usersData = response.data.results;
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9]">
    <EmpDataHeader title="Employee Data Sheet" />
      {/* Table */}
      <div className=" px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-6 overflow-x-auto overflow-y-auto max-h-[72vh] xScroll">
        <table class="min-w-full ">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th class="px-6 py-3 text-left  rounded-tl-lg">Employee ID</th>
              <th class="px-6 py-3 text-left">User Name</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">Role</th>
              <th class="px-6 py-3 text-left rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500 ">
            {users.map((user, index) => (
              <tr className="whitespace-nowrap border-b-2" key={user.id}>
              <td class="px-6 py-3 text-left">TXB00{user.id}</td>
              <td class="px-6 py-3 text-left">{user.username}</td>
              <td class="px-6 py-3 text-left">{user.email}</td>
              <td class="px-6 py-3 text-left">{user.user_role}</td>
              <td class="px-6 py-3 text-left">Action here</td>
            </tr>
            ))}
          </tbody>
        </table>
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


