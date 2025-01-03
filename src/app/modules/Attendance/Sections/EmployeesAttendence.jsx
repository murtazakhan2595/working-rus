import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/@/components/ui/table';
import moment from 'moment';
import { PageLoader } from 'components';
import { getAttendance } from 'app/hooks/attendance';
import { getEmployeeCustomList } from 'app/hooks/general';
import TableCustom from 'components/CustomTable';
// import { EmployeesAttendance } from 'app/utils/Types/TableColumns';

const EmployeesAttendence = () => {
  const [activeTab, setActiveTab] = useState('day');
  const [attendanceData, setAttendanceData] = useState([]);
  const [allData, setAllData] = useState(null)
  const [filterData, setFilterData] = useState({
    date: moment().format('YYYY-MM-DD'),
  });
  const [attendanceHistoryLoading, setAttendanceHistoryLoading] = useState(false);

  // Fetch attendance data
  const getAttendanceList = async () => {
    setAttendanceHistoryLoading(true);
    try {
      const attendanceResponse = await getAttendance({ filterData });
      if (attendanceResponse) {
        setAttendanceData(attendanceResponse.results || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    setAttendanceHistoryLoading(false);
  };

  // Merge employee data with attendance
  const fetchEmployeeDataAndMerge = async () => {
    try {
      const employeeListResponse = await getEmployeeCustomList();
      const employeeList = employeeListResponse?.results || [];

      const mergedData = employeeList.map((employee) => {
        const { id, first_name, last_name } = employee;
        const records = attendanceData.filter((record) => record.employee_id === id);

        if (records.length > 0) {
          const totalDays = records.length;
          const absentDays = records.filter((r) => r.is_absent).length;
          const attendancePercentage = ((1 - absentDays / totalDays) * 100).toFixed(2);
          const statuses = [...new Set(records.map((r) => r.status))];

          return {
            id,
            first_name,
            last_name,
            total_days: totalDays,
            absent_days: absentDays,
            statuses,
            attendance: records.map((r) => ({
              date: r.date,
              status: r.status,
              is_absent: r.is_absent,
            })),
            attendance_percentage: attendancePercentage,
          };
        }

        return {
          id,
          first_name,
          last_name,
          total_days: 0,
          absent_days: 0,
          statuses: ['Absent'],
          attendance: [],
          attendance_percentage: '0.00',
        };
      });
      setAllData(mergedData)
      // console.log('Merged Data:', mergedData);
    } catch (error) {
      console.error('Error merging employee data:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name) => {
    const updatedFilterData = { ...filterData };
    if (name === 'day') {
      updatedFilterData.date = moment().format('YYYY-MM-DD');
    } else if (name === 'week') {
      updatedFilterData.date_range = `${moment().startOf('week').format('YYYY-MM-DD')},${moment()
        .endOf('week')
        .format('YYYY-MM-DD')}`;
    }
    setFilterData(updatedFilterData);
  };

  // Fetch data on component load and filter changes
  useEffect(() => {
    getAttendanceList();
  }, [filterData]);

  useEffect(() => {
    fetchEmployeeDataAndMerge();
  }, [attendanceData]);

  

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="text-plum-900">Attendance History</div>
          <div className="flex items-center gap-2 text-lg font-normal text-slate-900">
            {['day', 'week', 'month'].map((tab) => (
              <button
                key={tab}
                className={`p-2 rounded-sm hover:bg-plum-400 hover:text-plum-900 ${
                  activeTab === tab ? 'bg-plum-400 text-plum-900' : ''
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  handleFilterChange(tab);
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      {attendanceHistoryLoading ? (
        <PageLoader />
      ) : (
        <CardContent>
          {/* <TableCustom
           data={allData}
           columns={EmployeesAttendance}
          /> */}
        </CardContent>
      )}
    </Card>
  );
};

export default EmployeesAttendence;
