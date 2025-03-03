
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { connect } from "react-redux";

const LeaveEmployeeDetails = ({ userProfile }) => {
  return (
      <>
        <CardHeader>
          <CardTitle>
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              Who's on Leave{""}
            </div>
          </CardTitle>
        </CardHeader>
        {/* <CardContent>
          <div className="p-4 border-b-1 bg-mauve-200">Today</div>
          {onLeaveToday?.map((application) => (
            <div className="flex flex-col gap-2 p-4">
              <div className="">{application.start_date}</div>
              <FormateLeaveTrackerName row={application} />
            </div>
          ))}
          <div className="p-4 border-b-1 bg-mauve-200">Next Week</div>
          {onLeaveNextWeek?.map((application) => (
            <div className="flex flex-col gap-2 p-4">
              <div className="">{application.start_date}</div>
              <FormateLeaveTrackerName row={application} />
            </div>
          ))}
        </CardContent> */}
      </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveEmployeeDetails);
