import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import {
    GenerateRequisition,
    AddUpdateGenerateRequisitionForm,
    CareerLevels,
    AddUpdateCareerLevelForm,
    Educations,
    AddUpdateEducationForm,
    JobTypes,
    AddUpdateJobTypeForm,
    RemoteWorkChecklist,
    AddUpdateRemoteWorkChecklistForm,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function RequisitionPlanning() {
    const isViewGeneratedRequisitionPermitted = HasAccess("VIEW_TS_BENEFITS");
    const isGeneratRequisitionPermitted = HasAccess("ADD_TS_BENEFITS");
    const isViewCareerLevelsPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
    const isAddCareerLevelsPermitted = HasAccess("ADD_TS_CAREER_LEVEL");
    const isViewEducationsPermitted = HasAccess("VIEW_TS_EDUCATION");
    const isAddEducationsPermitted = HasAccess("ADD_TS_EDUCATION");
    const isViewJobTypesPermitted = HasAccess("VIEW_TS_JOB_TYPE");
    const isAddJobTypesPermitted = HasAccess("ADD_TS_JOB_TYPE");
    const isViewChecklistPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const isAddChecklistPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);
    const [OpenGenerateRequisitionForm, setOpenGenerateRequisitionForm] = useState(false);
    const [OpenCareerLevelForm, setOpenCareerLevelForm] = useState(false);
    const [OpenEducationForm, setOpenEducationForm] = useState(false);
    const [OpenJobTypesForm, setOpenJobTypesForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    const [OpenRWChecklistForm, setOpenRWChecklistForm] = useState(false);


    const TabListArray = React.useMemo(() => [
        ...(isViewGeneratedRequisitionPermitted ? ["Generate Requisition"] : []),
        // ...(isViewChecklistPermitted ? ["Remote Work Checklist"] : []),
        // ...(isViewJobTypesPermitted ? ["Job Types"] : []),
        // ...(isViewEducationsPermitted ? ["Education"] : []),
        // ...(isViewCareerLevelsPermitted ? ["Career Level"] : []),

    ], [isViewGeneratedRequisitionPermitted, isViewCareerLevelsPermitted, isViewEducationsPermitted, isViewJobTypesPermitted, isViewChecklistPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenGenerateRequisitionForm(false);
            setOpenCareerLevelForm(false);
            setOpenEducationForm(false);
            setOpenJobTypesForm(false);
            setOpenRWChecklistForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'generate-requisition')
                setOpenGenerateRequisitionForm(true);
            else if (triggeredResquest === 'career-level')
                setOpenCareerLevelForm(true);
            else if (triggeredResquest === 'education')
                setOpenEducationForm(true);
            else if (triggeredResquest === 'job-type')
                setOpenJobTypesForm(true);
            else if (triggeredResquest === 'checklist')
                setOpenRWChecklistForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "Generate Requisition" && isGeneratRequisitionPermitted) {
            return (
                <Button title="generate-requisition" onClick={handleRequestClick}>
                    Add Requisition
                </Button>
            )
        } else if (activeButtonTab === "Career Level" && isAddCareerLevelsPermitted) {
            return (
                <Button title="career-level" onClick={handleRequestClick}>
                    Add Career Level
                </Button>
            )
        } else if (activeButtonTab === "Educations" && isAddEducationsPermitted) {
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
    if (!isViewGeneratedRequisitionPermitted && !isViewCareerLevelsPermitted && !isViewEducationsPermitted && !isViewJobTypesPermitted && !isViewChecklistPermitted)
        return <Error errorType={401} />
    return (
        <div className="flex flex-col gap-4">
            <Header content={<HeaderButton />} />

            <Tabs
                value={activeTab || TabListArray[0]}
                onValueChange={setActiveTab}
                defaultValue="Generate Requisition"
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
                    <TabsContent value={'Generate Requisition'}>
                        <GenerateRequisition reload={reloadData['generate-requisition']} />
                    </TabsContent>
                    <TabsContent value={'Career Level'}>
                        <CareerLevels reload={reloadData['career-level']} />
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
            {OpenGenerateRequisitionForm && (
                <AddUpdateGenerateRequisitionForm
                    isOpen={OpenGenerateRequisitionForm}
                    setIsOpen={() => {
                        setOpenGenerateRequisitionForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'generate-requisition': !prev["generate-requisition"],
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
