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
} from "../../../src/@/components/ui/tabs";

import { Card, CardContent, CardHeader } from "../../../components/ui/card.jsx";
const EmployeeExit = ({
  userProfile,
  departments,
  designations,
  managers,
  userDetails,
}) => {
  const [activeTab, setActiveTab] = useState("exit-request");
    const [resignation, setResignation] = useState({});
    const [termination, setTermination] = useState({});
  const [loading, setLoading] = useState(false);
console.log("termination", termination);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeExitDataById(userProfile.id);
      if (response) {
        const data = response?.data.results.result;
        const resignations = data.filter(
          (item) => item.exit_category === "resignation"
        );
        const terminations = data.filter(
          (item) => item.exit_category === "termination"
        );

        setResignation(resignations[0]);
        setTermination(terminations[0]);
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
    <div className="flex flex-col gap-4 ">
      <Header />
      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
            <TabsList className="flex justify-center mb-4">
              <TabsTrigger
                value="exit-request"
                className="data-[state=active]:bg-plum-500 w-fit data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
              >
                Exit Request
              </TabsTrigger>
              <TabsTrigger
                value="termination-letter"
                className="data-[state=active]:bg-plum-500 w-fit data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
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
                  <div className="w-full h-96 bg-white flex items-center justify-center text-3xl ">
                    <div>No Termination Letter</div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    userProfile: state.user.userProfile,
    departments: state.common.departments,
    designations: state.common.designations,
    managers: state.emp.reportingManagers,
    userDetails: state.emp.userDetails,
  };
};

export default connect(mapStateToProps)(EmployeeExit);
