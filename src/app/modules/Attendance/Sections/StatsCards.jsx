import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { DialogBox } from "components";
import { useSelector } from "react-redux";
import { getAttendanceStats, getAttendanceSummary } from "app/hooks/attendance";
import { EmployeeOverview } from "components";
import moment from "moment";
import { TextInput } from "components/FormControl";

export function StatsCards({ isTeamView, isEmpView, isBranchView }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ModalDetails, setModalDetails] = useState({});
  const [EmployeeDetails, setEmployeeDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);
  const [cardStats, setCardStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
  });
  const handleCardClicked = async (event, { title, status, description }) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const attendanceData = await getAttendanceSummary({
        filterData: { ...(status ? { status: status } : {}) },
        dateRange: `${moment().format("YYYY-MM-DD")},${moment().format(
          "YYYY-MM-DD"
        )}`,
        ordering: "emp_name",
      });
      if (attendanceData) {
        setEmployeeDetails(attendanceData.results || []);
        setModalDetails({ Title: title, description: description });
        setIsOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const attendanceStats = async (isMounted) => {
    setLoading(true);
    try {
      const FilterData = isTeamView
        ? { report_to: user_id }
        : isEmpView
        ? {}
        : isBranchView
        ? { branch_id: user_branch }
        : {
            // ...({ department_name } || {}),
            // ...({ branch_id } || {}),
          };
      const response = await getAttendanceStats({ filterData: FilterData });
      if (response && isMounted) {
        setCardStats({
          present: parseInt(response?.daily_stats?.Present),
          absent: response?.daily_stats?.Absent,
          late: response?.daily_stats?.Late,
          leave: response?.daily_stats?.Leave,
          totalEmployees: response?.valid_employee_count,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Employees",
      value: cardStats?.totalEmployees || 0,
      status: "",
      description: "Here is the list of all the active employees",
    },
    {
      title: "Present",
      value: cardStats?.present || 0,
      status: "Present",
      description: "Here is the list of all employees who are present today",
    },
    {
      title: "Late",
      value: cardStats?.late || 0,
      status: "Late",
      description: "Here is the list of all employees who are late today",
    },
    {
      title: "Absent",
      value: cardStats?.absent || 0,
      status: "Absent",
      description: "Here is the list of the all employees who are absent today",
    },
    {
      title: "Not Arrived",
      status: "not_arrived",
      value:
        (parseInt(cardStats?.totalEmployees) || 0) -
        (parseInt(cardStats?.present) || 0),
      description:
        "Here is the list of the all employees who are not arrived yet",
    },
    {
      title: "On Leave",
      value: cardStats?.leave || 0,
      status: "Leave",
      description: "Here is the list of all employees on leave",
    },
  ];
  useEffect(() => {
    let isMounted = true;
    attendanceStats(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter employee based on search
  const FilteredEmployees = React.useMemo(() => {
    if (
      !EmployeeDetails ||
      (Array.isArray(EmployeeDetails) && EmployeeDetails.length === 0)
    )
      return [];
    const query = searchQuery.toLowerCase();
    return EmployeeDetails.filter(({ emp_name }) => {
      const matchesQuery = emp_name.toLowerCase().includes(query);
      // const matchesStatus = selectedAssigneeStatus
      //   ? status === selectedAssigneeStatus
      //   : true;
      return matchesQuery;
    });
  }, [EmployeeDetails, searchQuery]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg"
          value="cardslicked"
          onClick={(event) => handleCardClicked(event, stat)}
        >
          {loading ? (
            <div className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="h-4 bg-gray-300 rounded w-2/3"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </div>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-900">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium text-plum-900">
                  {stat.value}
                </p>
              </CardContent>
            </>
          )}
        </Card>
      ))}
      <DialogBox
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={ModalDetails.Title}
        description={ModalDetails.description}
        className=""
      >
        <div className="my-4">
          <div className="w-50">
            <TextInput
              name="document_name"
              placeholder="Search by employee name"
              onChange={(_, value) => {
                setSearchQuery(value);
              }}
              value={searchQuery}
            />
          </div>
          {FilteredEmployees.map(({ employee_id }) => (
            <div key={`employee-${employee_id}`} className="my-2">
              <EmployeeOverview
                id={employee_id}
                showId={true}
                showDepartment={true}
                showBranchName={true}
              />
            </div>
          ))}
        </div>
      </DialogBox>
    </div>
  );
}
