import { Header } from "components";
import React, { useState, useEffect } from "react";
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
import { useLocation } from "react-router-dom";

export default function RequisitionPlanning() {
    const isViewRequisitionPermitted = HasAccess("VIEW_GENERATED_REQUISITION");
    const isAddRequisitionPermitted = HasAccess("GENERATE_REQUISITION");
    const isViewPublishedVacanciesPermitted = HasAccess("VIEW_PUBLISHED_VACANCIES");
    const isViewRequisitionRequestPermitted = HasAccess("VIEW_REQUISITION_REQUEST");
    const [activeTab, setActiveTab] = useState(null);
    const [OpenRequisitionForm, setOpenRequisitionForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    
    // Location state handling for deep linking from dashboard
    const location = useLocation();
    const [deepLinkRequisition, setDeepLinkRequisition] = useState(null);
    const [deepLinkAction, setDeepLinkAction] = useState(null);
    const [deepLinkFilterData, setDeepLinkFilterData] = useState(null);

    const TabListArray = React.useMemo(() => [
        ...(isViewRequisitionPermitted ? ["Generate Requisition"] : []),
        ...(isViewRequisitionRequestPermitted ? ["Requisition Requests"] : []),
        ...(isViewPublishedVacanciesPermitted ? ["Published Vacancies"] : []),
    ], [isViewRequisitionPermitted, isViewPublishedVacanciesPermitted, isViewRequisitionRequestPermitted]);

    // Handle location state for deep linking from dashboard
    useEffect(() => {
        if (location.state?.filterRequisition || location.state?.filterData) {
            const { filterRequisition, tab, action, filterData } = location.state;
            
            if (filterRequisition) setDeepLinkRequisition(filterRequisition);
            if (action) setDeepLinkAction(action);
            if (filterData) setDeepLinkFilterData(filterData);
            
            // Set the correct tab based on state
            if (tab) {
                const tabName = tab === 'requisition-requests' ? 'Requisition Requests' : 
                               tab === 'generate-requisition' ? 'Generate Requisition' :
                               tab === 'published-vacancies' ? 'Published Vacancies' : null;
                if (tabName && TabListArray.includes(tabName)) {
                    setActiveTab(tabName);
                }
            }
            
            // Clear location state after reading
            window.history.replaceState({}, document.title);
        }
    }, [location.state, TabListArray]);

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
                    <RequisitionRequests 
                        reload={reloadData['requisition-requests']} 
                        deepLinkRequisition={deepLinkRequisition}
                        deepLinkAction={deepLinkAction}
                    />
                </TabsContent>
                <Card>
                    <TabsContent value={'Generate Requisition'}>
                        <GenerateRequisition 
                            reload={reloadData['generate-requisition']} 
                            deepLinkRequisition={deepLinkRequisition}
                            deepLinkAction={deepLinkAction}
                            deepLinkFilterData={deepLinkFilterData}
                        />
                    </TabsContent>
                    <TabsContent value={'Published Vacancies'}>
                        <PublishedVacancies 
                            reload={reloadData['published-vacancies']} 
                            deepLinkRequisition={deepLinkRequisition}
                            deepLinkAction={deepLinkAction}
                        />
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
