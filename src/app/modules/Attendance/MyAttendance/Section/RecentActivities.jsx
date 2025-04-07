import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import moment from "moment";
import { useSelector } from "react-redux";
import { getRecentActivities } from "app/hooks/attendance";
import { ScrollArea } from "src/@/components/ui/scroll-area";

const RecentActivities = ({ attendance }) => {
  const [recentActivities, setRecentActivities] = useState([]);
  const userProfile = useSelector((state) => state.user.userProfile);
  const fetchData = async () => {
    const recentActivities = await getRecentActivities(
      {
        filterData: {
          employee_id: userProfile.id,
          date: moment().format("YYYY-MM-DD"),
        },
      },
      attendance,
      userProfile
    );
    setRecentActivities(recentActivities);
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [attendance]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-plum-900">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="pb-6 px-2">
        <ScrollArea className="[&>div>div[style]]:!block">
          <div className="h-[280px] px-4">
            {recentActivities?.length > 0 ? (
              <div className="space-y-4">
                {recentActivities?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start gap-3"
                  >
                    <div className="text-slate-1200">{item.activity}: </div>
                    <div>
                      <div>
                        {item.time}{" "}
                        <span className="text-slate-800">
                          ({item.description})
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-900">
                No recent activities to display
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
