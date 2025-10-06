import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import {
    GenerateRequisition,
    AddUpdateRequisitionRequestForm,
    PublishedVacancies,
    RequisitionRequests,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function RequisitionPlanning() {
    const isViewRequisitionPermitted = HasAccess("VIEW_GENERATED_REQUISITION");
    const isAddRequisitionPermitted = HasAccess("GENERATE_REQUISITION");
    const isViewPublishedVacanciesPermitted = HasAccess("VIEW_PUBLISHED_VACANCIES");
    const isViewRequisitionRequestPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
    const [activeTab, setActiveTab] = useState(null);
    const [OpenRequisitionForm, setOpenRequisitionForm] = useState(false);
    const [reloadData, setReloadData] = useState({});

    const TabListArray = React.useMemo(() => [
        ...(isViewRequisitionPermitted ? ["Generate Requisition"] : []),
        ...(isViewRequisitionRequestPermitted ? ["Requisition Requests"] : []),
        ...(isViewPublishedVacanciesPermitted ? ["Published Vacancies"] : []),
    ], [isViewRequisitionPermitted, isViewPublishedVacanciesPermitted, isViewRequisitionRequestPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenRequisitionForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'generate-requisition')
                setOpenRequisitionForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "Generate Requisition" && isAddRequisitionPermitted) {
            return (
                <Button title="generate-requisition" onClick={handleRequestClick}>
                    Add Requisition
                </Button>
            )
        }
    }
    if (!isViewRequisitionPermitted && !isViewPublishedVacanciesPermitted && !isViewRequisitionRequestPermitted)
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
        </div>
    );
}
