import React from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import EOSSettlementList from "./EOSSettlementList";
import { connect } from "react-redux";
import { DepartmentName } from "utils/getValuesFromTables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

const Exit = ({ userProfile }) => {
  // Check if user has EOS-sarly-setup
  const hasEOSSetup = userProfile?.settings?.hasEOSSarlySetup || false;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary-1100">Exit Management</h1>
      </div>
      
      <Tabs defaultValue="exit-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="exit-info">Exit Information</TabsTrigger>
          <TabsTrigger value="eos-settlements">EOS Settlements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exit-info">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-primary-1100">Exit Information</h2>
              <p className="text-sm text-gray-500">
                Review your exit details and related information
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 mb-6">
                <div className="p-4 border rounded-lg bg-amber-50">
                  <h3 className="flex items-center gap-2 mb-2 text-base font-medium text-amber-700">
                    <ExternalLink className="w-4 h-4" />
                    Exit Process Guidelines
                  </h3>
                  <p className="text-sm text-amber-700">
                    The exit process consists of several steps that must be completed in order to finalize your departure from the company.
                    Below is important information about your exit timeline, clearance processes, and required actions.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="mb-2 text-sm font-medium text-neutral-500">Last Working Day</h3>
                    <p className="text-base font-medium">
                      {userProfile?.exitDate ? new Date(userProfile.exitDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Not specified'}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="mb-2 text-sm font-medium text-neutral-500">Notice Period</h3>
                    <p className="text-base font-medium">{userProfile?.noticePeriod || '1 month'}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="mb-2 text-sm font-medium text-neutral-500">Resignation Type</h3>
                    <p className="text-base font-medium">{userProfile?.exitType || 'Standard'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <h3 className="mb-3 text-base font-medium">Exit Clearance Checklist</h3>
                <ul className="grid gap-2 mb-6">
                  <li className="flex items-center justify-between p-3 border rounded-md">
                    <span>Return company assets</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100">Pending</span>
                  </li>
                  <li className="flex items-center justify-between p-3 border rounded-md">
                    <span>Knowledge transfer</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100">Pending</span>
                  </li>
                  <li className="flex items-center justify-between p-3 border rounded-md">
                    <span>Exit interview</span>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Completed</span>
                  </li>
                  <li className="flex items-center justify-between p-3 border rounded-md">
                    <span>Final clearance</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-amber-700 bg-amber-100">Pending</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="eos-settlements">
          {/* EOS Settlement List Component - only show if user has EOS-sarly-setup */}
          {hasEOSSetup ? <EOSSettlementList /> : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="mb-4 text-center text-gray-600">End of Service Settlement feature is not enabled for your account.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Exit); 