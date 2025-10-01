import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import {
    GenerateRequisition,
    AddUpdateRequisitionRequestForm,
    CareerLevels,
    AddUpdateCareerLevelForm,
    Educations,
    AddUpdateEducationForm,
    PublishedVacancies,
    AddUpdateJobTypeForm,
    RequisitionRequests,
    AddUpdateRemoteWorkChecklistForm,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function RequisitionPlanning() {
    const isViewRequisitionPermitted = HasAccess("VIEW_GENERATED_REQUISITION");
    const isAddRequisitionPermitted = HasAccess("GENERATE_REQUISITION");
    const isViewCareerLevelsPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
    const isAddCareerLevelsPermitted = HasAccess("ADD_TS_CAREER_LEVEL");
    const isViewEducationsPermitted = HasAccess("VIEW_TS_EDUCATION");
    const isAddEducationsPermitted = HasAccess("ADD_TS_EDUCATION");
    const isViewPublishedVacanciesPermitted = HasAccess("VIEW_PUBLISHED_VACANCIES");
    const isAddPublishedVacanciesPermitted = HasAccess("ADD_TS_JOB_TYPE");
    const isViewRequisitionRequestPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const isAddChecklistPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);
    const [OpenRequisitionForm, setOpenRequisitionForm] = useState(false);
    const [OpenCareerLevelForm, setOpenCareerLevelForm] = useState(false);
    const [OpenEducationForm, setOpenEducationForm] = useState(false);
    const [OpenPublishedVacanciesForm, setOpenPublishedVacanciesForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    const [OpenRWChecklistForm, setOpenRWChecklistForm] = useState(false);


    const TabListArray = React.useMemo(() => [
        ...(isViewRequisitionPermitted ? ["Generate Requisition"] : []),
        ...(isViewRequisitionRequestPermitted ? ["Requisition Requests"] : []),
        ...(isViewPublishedVacanciesPermitted ? ["Published Vacancies"] : []),
        // ...(isViewEducationsPermitted ? ["Education"] : []),
        // ...(isViewCareerLevelsPermitted ? ["Career Level"] : []),

    ], [isViewRequisitionPermitted, isViewCareerLevelsPermitted, isViewEducationsPermitted, isViewPublishedVacanciesPermitted, isViewRequisitionRequestPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenRequisitionForm(false);
            setOpenCareerLevelForm(false);
            setOpenEducationForm(false);
            setOpenPublishedVacanciesForm(false);
            setOpenRWChecklistForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'generate-requisition')
                setOpenRequisitionForm(true);
            else if (triggeredResquest === 'career-level')
                setOpenCareerLevelForm(true);
            else if (triggeredResquest === 'education')
                setOpenEducationForm(true);
            else if (triggeredResquest === 'published-vacancies')
                setOpenPublishedVacanciesForm(true);
            else if (triggeredResquest === 'requisition-requests')
                setOpenRWChecklistForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "Generate Requisition" && isAddRequisitionPermitted) {
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
        } else if (activeButtonTab === "Published Vacancies" && isAddPublishedVacanciesPermitted) {
            return (
                <Button title="published-vacancies" onClick={handleRequestClick}>
                    Add Job Type
                </Button>
            )
        }
    }
    if (!isViewRequisitionPermitted && !isViewCareerLevelsPermitted && !isViewEducationsPermitted && !isViewPublishedVacanciesPermitted && !isViewRequisitionRequestPermitted)
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
                <TabsContent value={'Requisition Requests'}>
                    <RequisitionRequests reload={reloadData['requisition-requests']} />
                </TabsContent>
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
                    <TabsContent value={'Published Vacancies'}>
                        <PublishedVacancies reload={reloadData['published-vacancies']} />
                    </TabsContent>

                </Card>
            </Tabs>
            {OpenRequisitionForm && (
                <AddUpdateRequisitionRequestForm
                    isOpen={OpenRequisitionForm}
                    setIsOpen={() => {
                        setOpenRequisitionForm(false);
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
            {OpenPublishedVacanciesForm && (
                <AddUpdateJobTypeForm
                    isOpen={OpenPublishedVacanciesForm}
                    setIsOpen={() => {
                        setOpenPublishedVacanciesForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'published-vacancies': !prev["published-vacancies"],
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
                                'requisition-requests': !prev["requisition-requests"],
                            };
                        })
                    }}
                />
            )}
        </div>
    );
}
