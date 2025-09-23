import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import {
    TeamManpowerHeadcount,
    AddUpdateManpowerHeadcountRequest,
    ManpowerHeadCountRequest,
    AddUpdateCareerLevelForm,
    Educations,
    AddUpdateEducationForm,
    JobTypes,
    AddUpdateJobTypeForm,
    RemoteWorkChecklist,
    AddUpdateRemoteWorkChecklistForm,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function TeamTalentSphere() {
    const isViewManpowerHeadcountPermitted = HasAccess("VIEW_TEAM_MANPOWER_HEADCOUNT");
    const isAddManpowerHeadcountPermitted = HasAccess("REQUEST_MANPOWER_HEADCOUNT");
    const isViewCareerLevelsPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
    const isAddCareerLevelsPermitted = HasAccess("ADD_TS_CAREER_LEVEL");
    const isViewEducationsPermitted = HasAccess("VIEW_TS_EDUCATION");
    const isAddEducationsPermitted = HasAccess("ADD_TS_EDUCATION");
    const isViewJobTypesPermitted = HasAccess("VIEW_TS_JOB_TYPE");
    const isAddJobTypesPermitted = HasAccess("ADD_TS_JOB_TYPE");
    const isViewHeadcountRequestPermitted = HasAccess("VIEW_TEAM_MANPOWER_HEADCOUNT");
    const isAddChecklistPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);
    const [OpenHeadcountRequest, setOpenBenefitForm] = useState(false);
    const [OpenCareerLevelForm, setOpenCareerLevelForm] = useState(false);
    const [OpenEducationForm, setOpenEducationForm] = useState(false);
    const [OpenJobTypesForm, setOpenJobTypesForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    const [OpenRWChecklistForm, setOpenRWChecklistForm] = useState(false);


    const TabListArray = React.useMemo(() => [
        ...(isViewManpowerHeadcountPermitted ? ["Manpower Headcount"] : []),
        ...(isViewHeadcountRequestPermitted ? ["Manpower Headcount Request"] : []),
        // ...(isViewJobTypesPermitted ? ["Job Types"] : []),
        // ...(isViewEducationsPermitted ? ["Education"] : []),
        // ...(isViewCareerLevelsPermitted ? ["Career Level"] : []),

    ], [isViewManpowerHeadcountPermitted, isViewCareerLevelsPermitted, isViewEducationsPermitted, isViewJobTypesPermitted, isViewHeadcountRequestPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenBenefitForm(false);
            setOpenEducationForm(false);
            setOpenJobTypesForm(false);
            setOpenRWChecklistForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'headcount-request')
                setOpenBenefitForm(true);
            else if (triggeredResquest === 'education')
                setOpenEducationForm(true);
            else if (triggeredResquest === 'job-type')
                setOpenJobTypesForm(true);
            else if (triggeredResquest === 'checklist')
                setOpenRWChecklistForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if ((activeButtonTab === "Manpower Headcount" || activeTab === 'Manpower Headcount Request') && isAddManpowerHeadcountPermitted) {
            return (
                <Button title="headcount-request" onClick={handleRequestClick}>
                    Request Manpower Headcount
                </Button>
            )
        }else if (activeButtonTab === "Education" && isAddEducationsPermitted) {
            return (
                <Button title="education" onClick={handleRequestClick}>
                    Add Education
                </Button>
            )
        } else if (activeButtonTab === "Job Types" && isAddJobTypesPermitted) {
            return (
                <Button title="job-type" onClick={handleRequestClick}>
                    Add Job Type
                </Button>
            )
        } else if (activeButtonTab === "Remote Work Checklist" && isAddChecklistPermitted) {
            return (
                <Button title="checklist" onClick={handleRequestClick}>
                    Add Remote Work Checklist
                </Button>
            )
        }
    }
    if (!isViewManpowerHeadcountPermitted && !isViewCareerLevelsPermitted && !isViewEducationsPermitted && !isViewJobTypesPermitted && !isViewHeadcountRequestPermitted)
        return <Error errorType={401} />
    return (
        <div className="flex flex-col gap-4">
            <Header content={<HeaderButton />} />

            <Tabs
                value={activeTab || TabListArray[0]}
                onValueChange={setActiveTab}
                defaultValue="Manpower Headcount"
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
                    <TabsContent value={'Manpower Headcount'}>
                        <TeamManpowerHeadcount reload={reloadData['headcount-request']} />
                    </TabsContent>
                    <TabsContent value={'Manpower Headcount Request'}>
                        <ManpowerHeadCountRequest reload={reloadData['headcount-request']} />
                    </TabsContent>
                    <TabsContent value={'Education'}>
                        <Educations reload={reloadData['education']} />
                    </TabsContent>
                    <TabsContent value={'Job Types'}>
                        <JobTypes reload={reloadData['job-type']} />
                    </TabsContent>
                    <TabsContent value={'Remote Work Checklist'}>
                        <RemoteWorkChecklist reload={reloadData['checklist']} />
                    </TabsContent>
                </Card>
            </Tabs>
            {OpenHeadcountRequest && (
                <AddUpdateManpowerHeadcountRequest
                    isOpen={OpenHeadcountRequest}
                    setIsOpen={() => {
                        setOpenBenefitForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'headcount-request': !prev["headcount-request"],
                            };
                        })
                    }}
                />
            )}
            {OpenCareerLevelForm && (
                <AddUpdateCareerLevelForm
                    isOpen={OpenCareerLevelForm}
                    setIsOpen={() => {
                        setOpenCareerLevelForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'career-level': !prev["career-level"],
                            };
                        })
                    }}
                />
            )}
            {OpenEducationForm && (
                <AddUpdateEducationForm
                    isOpen={OpenEducationForm}
                    setIsOpen={() => {
                        setOpenEducationForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'education': !prev["education"],
                            };
                        })
                    }}
                />
            )}
            {OpenJobTypesForm && (
                <AddUpdateJobTypeForm
                    isOpen={OpenJobTypesForm}
                    setIsOpen={() => {
                        setOpenJobTypesForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'job-type': !prev["job-type"],
                            };
                        })
                    }}
                />
            )}
            {OpenRWChecklistForm && (
                <AddUpdateRemoteWorkChecklistForm
                    isOpen={OpenRWChecklistForm}
                    setIsOpen={() => {
                        setOpenRWChecklistForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'checklist': !prev["checklist"],
                            };
                        })
                    }}
                />
            )}
        </div>
    );
}
