import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeExitDataById } from "app/hooks/employee";
import { Header, PageLoader } from "components";
import ExitRequestForm from "./ExitRequestForm";
import ExitRequestDetails from "./ExitRequestDetails";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";

const EmployeeExit = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("exit-request");
  const [exitDetails, setExitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeExitDataById(userProfile.id);
      if (response) {
        const data = response?.data.results.result;
        setExitDetails(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  return (
    <div className="flex flex-col gap-4">
      <Header />
      <div>
        {exitDetails ? (
          <ExitRequestDetails exitData={exitDetails} reloadData={fetchData} />
        ) : (
          <ExitRequestForm reload={fetchData} />
        )}
        {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
            <TabsList className="flex justify-center mb-4">
              <TabsTrigger
                value="exit-request"
                className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Exit Request
              </TabsTrigger>
              <TabsTrigger
                value="termination-letter"
                className="data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Termination Letter
              </TabsTrigger>
            </TabsList>
          </div>
          <Card>
            <CardContent>
              <TabsContent value="exit-request">
                {loading ? (
                  <PageLoader />
                ) : resignation ? (
                  <ExitRequestDetails
                    userProfile={userProfile}
                    departments={departments}
                    exitData={resignation}
                  />
                ) : (
                  <ExitRequestForm
                    userProfile={userProfile}
                    reload={fetchData}
                    departments={departments}
                    designations={designations}
                    managers={managers}
                  />
                )}
              </TabsContent>
              <TabsContent value="termination-letter">
                {loading ? (
                  <PageLoader />
                ) : termination ? (
                  <ExitRequestDetails
                    userDetails={userDetails}
                    exitData={termination}
                    isTermination={true}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full text-3xl bg-white h-96 ">
                    <div>No Termination Letter</div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(EmployeeExit);
