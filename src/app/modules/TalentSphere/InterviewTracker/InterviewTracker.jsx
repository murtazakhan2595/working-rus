import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import {
    AllApplicants,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function InterviewTracker() {
    const isViewInProgressPermitted = HasAccess("VIEW_APPLICANT_INPROGRESS_INTERVIEWS");
    const isViewHoldPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);

    const TabListArray = React.useMemo(() => [
        ...(isViewInProgressPermitted ? ["In Progress"] : []),
        ...(isViewHoldPermitted ? ["Hold Applications"] : []),
    ], [isViewInProgressPermitted, isViewHoldPermitted]);

    if (!isViewInProgressPermitted && !isViewHoldPermitted)
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

                <TabsContent value={'In Progress'}>
                    <AllApplicants variant={"in_progress"} />
                </TabsContent>
                <TabsContent value={'Hold Applications'}>
                    <AllApplicants variant={"hold"} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
