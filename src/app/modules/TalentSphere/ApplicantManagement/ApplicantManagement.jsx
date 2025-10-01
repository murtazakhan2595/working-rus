import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { HasAccess } from "utils/PermissionUtils";
import { Applicants } from "app/modules/TalentSphere/ScreenedApplicants";
import {
    AllApplicants,
    CareerLevels,
    Educations,
    ResumeBankApplicants,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function ApplicantManagement() {
    const isViewApplicantsPermitted = HasAccess("VIEW_TS_BENEFITS");
    const isViewShortlistedPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
    const isViewScreenedPermitted = HasAccess("VIEW_TS_EDUCATION");
    const isViewResumedPermitted = HasAccess("VIEW_RESUME_BANK_APPLICATION");
    const isViewRejectedPermitted = HasAccess("VIEW_REJECTED_APPLICATION");
    const [activeTab, setActiveTab] = useState(null);
    const [reloadData, setReloadData] = useState({});

    const TabListArray = React.useMemo(() => [
        ...(isViewApplicantsPermitted ? ["All Applicants"] : []),
        ...(isViewRejectedPermitted ? ["Rejected"] : []),
        ...(isViewResumedPermitted ? ["Resume Bank"] : []),
        ...(isViewScreenedPermitted ? ["Screened"] : []),
        ...(isViewShortlistedPermitted ? ["Shortlisted"] : []),

    ], [isViewApplicantsPermitted, isViewShortlistedPermitted, isViewScreenedPermitted, isViewResumedPermitted, isViewRejectedPermitted]);

    if (!isViewApplicantsPermitted && !isViewShortlistedPermitted && !isViewScreenedPermitted && !isViewResumedPermitted && !isViewRejectedPermitted)
        return <Error errorType={401} />
    return (
        <div className="flex flex-col gap-4">
            <Header />

            <Tabs
                value={activeTab || TabListArray[0]}
                onValueChange={setActiveTab}
                defaultValue="All Applicants"
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
                    <TabsContent value={'All Applicants'}>
                        <AllApplicants reload={reloadData['benefits']} />
                    </TabsContent>
                    <TabsContent value={'Shortlisted'}>
                        <AllApplicants variant='shortlisted'/>
                    </TabsContent>
                    <TabsContent value={'Screened'}>
                        <Applicants />
                    </TabsContent>
                    <TabsContent value={'Resume Bank'}>
                        <ResumeBankApplicants reload={reloadData['resume']} />
                    </TabsContent>
                    <TabsContent value={'Rejected'}>
                        <AllApplicants reload={reloadData['rejected']} variant='rejected' />
                    </TabsContent>
                </Card>
            </Tabs>
        </div>
    );
}
