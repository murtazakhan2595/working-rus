import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getEmployeePayroll } from "../../../hooks/payroll";
import { useNavigate } from "react-router-dom";
import { PageLoader, UnauthorizedAccess } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";

const MyPayroll = ({ userProfile }) => {
  // Permission checks for payroll features
  const canViewPayroll = HasAccess("VIEW_PAYROLL");
  const canViewPayslips = HasAccess("VIEW_PAYSLIPS");
  const canDownloadPayslips = HasAccess("DOWNLOAD_PAYSLIPS");

  const [payroll, setPayroll] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        setLoading(true);
        
        // Only fetch if user has permission to view payroll
        if (!canViewPayroll) {
          setLoading(false);
          return;
        }

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
        setLoading(false);
      }
    };
    fetchPayroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewPayroll]);

  if (loading) {
    return <PageLoader />;
  }

  // If user doesn't have permission to view payroll
  if (!canViewPayroll) {
    return (
      <UnauthorizedAccess
        title="Payroll Access Denied"
        featureName="payroll information"
        message="You don't have permission to view payroll information. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Main Payroll Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-plum-900">My Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          {(!payroll || !payroll?.id) ? (
            <div className="bg-plum-50 text-plum-800 text-center rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">No Payroll Data Found</h3>
              <p>There is currently no payroll information available for your account.</p>
            </div>
          ) : (
            <div className="text-center p-6">
              <h3 className="text-lg font-semibold text-plum-900 mb-2">
                Payroll Information Available
              </h3>
              <p className="text-gray-600 mb-4">
                Your payroll information is ready to view.
              </p>
              <Button 
                onClick={() => navigate(`/payroll/${payroll.id}?employeeID=${userProfile.id}&fromMyPayroll=true`)}
                className="bg-plum-600 hover:bg-plum-700"
              >
                View Payroll Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payslip Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-plum-900">Payslip Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {canViewPayslips && payroll?.id ? (
            <div className="space-y-3">
              <p className="text-gray-600">Access your payslip information and downloads.</p>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/payslip/${payroll.id}`)}
                  className="border-plum-300 text-plum-700 hover:bg-plum-50"
                >
                  View Payslip
                </Button>
                {canDownloadPayslips && (
                  <Button 
                    onClick={() => navigate(`/payslip/${payroll.id}`)}
                    className="bg-plum-600 hover:bg-plum-700"
                  >
                    Download Payslip
                  </Button>
                )}
              </div>
            </div>
          ) : !canViewPayslips ? (
            <UnauthorizedAccess
              title="Payslip Access Denied"
              featureName="payslip information"
              size="sm"
            />
          ) : (
            <div className="text-center p-4 text-gray-500">
              <p>No payslip available. Please check back later or contact HR.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyPayroll);
