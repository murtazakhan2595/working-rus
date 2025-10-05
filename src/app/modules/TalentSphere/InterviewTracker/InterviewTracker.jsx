import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { HasAccess } from "utils/PermissionUtils";
import { Applicants } from "app/modules/TalentSphere/ScreenedApplicants";
import {
    AllApplicants,
    CareerLevels,
    InProgressInterviews,
    ResumeBankApplicants,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function InterviewTracker() {
    const isViewInProgressPermitted = HasAccess("VIEW_TS_BENEFITS");
    const isViewCareerLevelsPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
    const isViewScreenedPermitted = HasAccess("VIEW_TS_EDUCATION");
    const isViewResumedPermitted = HasAccess("VIEW_TS_JOB_TYPE");
    const isViewRejectedPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);
    const [reloadData, setReloadData] = useState({});

    const TabListArray = React.useMemo(() => [
        ...(isViewInProgressPermitted ? ["In Progress"] : []),
        // ...(isViewRejectedPermitted ? ["Rejected Applications"] : []),
        // ...(isViewResumedPermitted ? ["Resume Bank Application"] : []),
        // ...(isViewScreenedPermitted ? ["Screened Application"] : []),
        // // ...(isViewCareerLevelsPermitted ? ["Career Level"] : []),

    ], [isViewInProgressPermitted, isViewCareerLevelsPermitted, isViewScreenedPermitted, isViewResumedPermitted, isViewRejectedPermitted]);

    if (!isViewInProgressPermitted && !isViewCareerLevelsPermitted && !isViewScreenedPermitted && !isViewResumedPermitted && !isViewRejectedPermitted)
        return <Error errorType={401} />
    return (
        <div className="flex flex-col gap-4">
            <Header />

            <Tabs
                value={activeTab || TabListArray[0]}
                onValueChange={setActiveTab}
                defaultValue="All InProgress"
            >
                <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
                    <TabsList>
                        {TabListArray.map((tab) => (
                            <TabsTrigger key={tab} value={tab}>
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <Card>
                    <TabsContent value={'In Progress'}>
                        <InProgressInterviews reload={reloadData['benefits']} />
                    </TabsContent>
                    <TabsContent value={'Career Level'}>
                        <CareerLevels reload={reloadData['career-level']} />
                    </TabsContent>
                    <TabsContent value={'Screened Application'}>
                        <Applicants />
                    </TabsContent>
                    <TabsContent value={'Resume Bank Application'}>
                        <ResumeBankApplicants reload={reloadData['resume']} />
                    </TabsContent>
                    <TabsContent value={'Rejected Applications'}>
                        <AllApplicants reload={reloadData['rejected']} variant='rejected' />
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
