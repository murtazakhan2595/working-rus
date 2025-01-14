import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import moment from "moment";
import {
  TodayStatistics,
  EmployeeInfo,
  HourlyStatistics,
  EmployeeAttendanceHistory,
  EmployeeAttendanceOverview,
} from "app/modules/Attendance/EmployeeAttendance/Section";
import {
  getAttendance,
} from "app/hooks/attendance";
import { PageLoader } from "components";
import { toast } from "react-toastify";
import { calculateBreak } from "app/hooks/attendance";
import { getBreakStatus } from "app/hooks/attendance";
import { endBreak } from "app/hooks/attendance";
import { getStats } from "app/hooks/attendance";
import { GetUser } from "utils/getValuesFromTables";
import { GetDateRange } from "utils/renderValues";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { isEqual } from "lodash"; // For deep comparison of objects
import { Button } from "components/ui/button";
import { ArrowLeft } from "lucide-react";

const EmployeeAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const userProfile = GetUser(id);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [activeTab, setActiveTab] = useState("week");
  const [filterData, setFilterDataState] = useState({
    date_range: GetDateRange("week"),
    employee_id: id,
  });

  const setFilterData = (newFilterData) => {
    if (!isEqual(filterData, newFilterData)) {
      setFilterDataState(newFilterData);
    }
  };

  const getAttendanceList = async (isMounted) => {
    setIsLoading(true);
    try {
      const attendanceData = await getAttendance({
        filterData: filterData,
      });
      if (isMounted) {
        if (attendanceData) {
          setAttendanceData(attendanceData);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getAttendanceList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2 text-lg text-balance"
        >
          <ArrowLeft className="w-4 h-4 mr-2 bg-white rounded-lg shadow-sm" />
          Back
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="mt-5">
            <div className="flex justify-start flex-col">
              <EmployeeInfo user={userProfile} />
              <TodayStatistics
                userId={id}
                shiftId={userProfile?.shift_assignment || 1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-plum-900">Hours Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <HourlyStatistics
              userId={id}
              shiftId={userProfile?.shift_assignment || 1}
              dateRange={
                filterData && filterData.date_range
                  ? filterData.date_range
                  : null
              }
              attendanceData={attendanceData?.results}
            />
          </CardContent>
        </Card> 

        <Card>
          <CardHeader>
            <CardTitle className="text-plum-900">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <EmployeeAttendanceOverview
              userId={id}
              attendanceData={attendanceData?.results}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>

      <EmployeeAttendanceHistory
        userId={id}
        setFilterData={setFilterData}
        attendanceData={attendanceData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
      />
    </div>
  );
};

export default EmployeeAttendance;
