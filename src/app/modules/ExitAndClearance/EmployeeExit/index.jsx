import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { getExitDataByEmpId } from "app/hooks/employeeExitAndClearance";
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
  const [exitDetails, setExitDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getExitDataByEmpId(userProfile.id, {
        request_status: "PENDING,APPROVED",
      });
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
    <div className="flex flex-col gap-4 max-w-[1040px] m-auto">
      <Header />
      <div>
        {exitDetails ? (
          <ExitRequestDetails exitData={exitDetails} reloadData={fetchData} />
        ) : (
          <ExitRequestForm reload={fetchData} />
        )}
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
