import { getLeaveApplications } from "app/hooks/leaveManagment";
import { Status } from "app/modules/LeaveManagment/Sections";
import { StatusLabel } from "components";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../../../../src/@/components/ui/table";
import { Badge } from "../../../../components/ui/badge";
export default function MyLeaves() {
  const [leave, setLeave] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userProfile = useSelector((state) => state.user.userProfile);

  console.log(leave);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        const applicationsData = await getLeaveApplications({
          filterData: { employee_id: userProfile.id },
        });
        if (applicationsData) {
          setLeave(applicationsData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchdata();
  }, [userProfile]);

  return (
    <>
      <Card className="w-full col-span-2">
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              My Leaves
            </div>
            <Button variant="secondary">
              <Link to="/request-leave">Add Request</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leave.count > 0 &&
            leave.results
              ?.slice(0, 5)
              ?.map((leave) => <RenderMyLeaves leave={leave} key={leave.id} />)}
        </CardContent>
      </Card>
    </>
  );
}

const RenderMyLeaves = ({ leave }) => {
  return (
    <>
      <Table>
        <TableBody>
          <TableRow className="border-b">
            <TableCell className="">
              <div className="flex flex-row gap-4">
                <div className="border rounded-md flex flex-col items-center justify-center p-2 w-[60px] h-[60px]">
                  <span className="text-base font-semibold">
                    {leave.total_leave}
                  </span>
                  <span className="text-base">days</span>
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-[#111827] font-semibold">{`${moment(
                    leave.start_date
                  ).format("MMM DD")} - ${moment(leave.end_date).format(
                    "MMM DD"
                  )}`}</div>
                  <div className="text-base font-medium">
                    {leave.leave_component_name}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="py-4 text-right">
              <StatusLabel status={Status(leave.status_hr)} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
