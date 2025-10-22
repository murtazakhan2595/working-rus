import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const UpcomingInterviews = ({ data, loading }) => {
  const navigate = useNavigate();

  // Sort interviews by date AND time, ONLY show today + this week
  const sortedInterviews = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const now = moment();
    const today = moment().startOf("day");
    const startOfWeek = moment().startOf("week"); // Sunday
    const endOfWeek = moment().endOf("week"); // Saturday

    // Parse and categorize interviews
    const parsedInterviews = data
      .map((interview) => {
        const interviewMoment = moment(
          interview.date_time,
          "DD-MMM-YYYY, hh:mm A"
        );

        return {
          ...interview,
          momentDate: interviewMoment,
          isToday: interviewMoment.isSame(today, "day"),
          isThisWeek: interviewMoment.isBetween(
            startOfWeek,
            endOfWeek,
            "day",
            "[]"
          ),
          isCompleted: interviewMoment.isBefore(now),
        };
      })
      // FILTER: Only show interviews from today OR this week
      .filter((interview) => interview.isToday || interview.isThisWeek)
      // Sort by date AND time (descending - latest first)
      .sort((a, b) => b.momentDate.diff(a.momentDate));

    return parsedInterviews;
  }, [data]);

  const handleViewAll = () => {
    navigate("/talent-sphere/interview-tracker");
  };

  if (loading) {
    return (
      <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-plum-900">
            Upcoming Interviews
          </CardTitle>
          <CardDescription>Scheduled interviews overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-plum-900">
              Upcoming Interviews
            </CardTitle>
            <CardDescription>
              {sortedInterviews.length} interviews scheduled this week
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!sortedInterviews || sortedInterviews.length === 0 ? (
          <div className="text-center py-8 text-neutral-900">
            No interviews scheduled for today or this week
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedInterviews.map((interview, index) => {
              const goProfile = (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/talent-sphere/applicant/${interview.candidate_id}`);
              };
              const openReschedule = (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(
                  `/talent-sphere/applicant-management?applicant=${interview.candidate_id}&action=reschedule`
                );
              };
              const openAddFeedback = (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(
                  `/talent-sphere/applicant-management?applicant=${interview.candidate_id}&action=add-feedback`
                );
              };

              return (
                <Card
                  key={index}
                  className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                    interview.isToday
                      ? "border-l-4 border-l-blue-500 bg-blue-50"
                      : interview.isThisWeek
                      ? "border-l-4 border-l-purple-500 bg-purple-50"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(
                      `/talent-sphere/applicant/${interview.candidate_id}`
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-neutral-1200">
                          {interview.candidate_name}
                        </p>
                        {interview.isToday && (
                          <Badge variant="default" className="text-[10px]">
                            Today
                          </Badge>
                        )}
                        {interview.isThisWeek && !interview.isToday && (
                          <Badge variant="secondary" className="text-[10px]">
                            This Week
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-neutral-1000 mt-1">
                        {interview.job_title}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-neutral-1000">
                          <Calendar className="h-3 w-3" />
                          {interview.date_time}
                        </div>
                      </div>

                      {interview.interview_type && (
                        <Badge variant="secondary" className="text-[10px] mt-2">
                          {interview.interview_type}
                        </Badge>
                      )}

                      {/* Panel Members */}
                      {interview.panel_members &&
                        interview.panel_members.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[10px] text-neutral-900 mb-1">
                              Panel Members:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {interview.panel_members.map((name, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-[10px] px-2 py-0.5"
                                >
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {interview.status && (
                        <div className="mt-2">
                          <p className="text-[10px] text-neutral-900 mb-1">
                            Status:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            <Badge
                              variant="secondary"
                              className="text-[10px] mt-2"
                            >
                              {interview.status}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goProfile}
                          className="text-xs"
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={openReschedule}
                          className="text-xs"
                        >
                          Reschedule
                        </Button>
                        {interview.isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={openAddFeedback}
                            className="text-xs"
                          >
                            Add Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews;
