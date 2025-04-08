import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getEmployeePayroll } from "../../../hooks/payroll";
import { useNavigate } from "react-router-dom";
import { PageLoader } from "components";

const MyPayroll = ({ userProfile }) => {
  const [payroll, setPayroll] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        const response = await getEmployeePayroll({
          filterData: { employee_id: userProfile.id },
        });
        setPayroll(response?.results[0]);
        console.log("response", response);
        if (response?.results[0]) {
          navigate(
            `/payroll/${response.results[0]?.id}?employeeID=${userProfile.id}&fromMyPayroll=true`
          );
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (loading) {
    return <PageLoader />;
  }
  return (
    <div>
      {(!payroll || !payroll?.id) && (
        <div className="bg-plum-400 text-plum-900 text-center rounded-lg p-4">
          No Payroll Data Found
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyPayroll);
