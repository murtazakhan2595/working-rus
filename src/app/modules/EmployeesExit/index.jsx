import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeExitDataById } from "app/hooks/employee";
import { Header, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import ExitRequestForm from "./ExitRequestForm";
import ExitRequestDetails from "./ExitRequestDetails";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/@/components/ui/tabs";

const EmployeeExit = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("exit-request");
  const [exitData, setExitData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEmployeeExitDataById(userProfile.id);
      console.log("response emp exit", response.data.results.result[0]);
      if (response) {
        setExitData(response.data.results.result[0]);
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
       <Header/>
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="custom-tabs">
              <TabsList className="custom-tabs-list">
                <TabsTrigger value="exit-request" className="custom-tabs-trigger">
                  Exit Request
                </TabsTrigger>
                <TabsTrigger value="termination-letter" className="custom-tabs-trigger">
                  Termination Letter
                </TabsTrigger>
              </TabsList>
              <TabsContent value="exit-request" className="custom-tabs-content">
                {loading ? (
                  <PageLoader />
                ) : exitData ? (
                  <ExitRequestDetails
                    userProfile={userProfile}
                    exitData={exitData}
                  />
                ) : (
                  <ExitRequestForm userProfile={userProfile} reload={fetchData} />
                )}
              </TabsContent>
              <TabsContent value="termination-letter" className="custom-tabs-content">
                {loading ? (
                  <PageLoader />
                ) : (
                  <div className="w-full h-96 bg-white flex items-center justify-center text-3xl text-gray-600">
                    <div>No Termination Letter</div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    token: state.user.token,
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(EmployeeExit);
