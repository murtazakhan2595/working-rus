import React from "react";
import { useState } from "react";
import { Card } from "components/ui/card";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import {
    EvaluationForm,
    AddUpdateEvaluationForm,
    SelfAssessmentForm,
    AddSelfAssessmentForm,
    PeerAssessmentForm,
    PeerAssessmentActions
} from 'app/modules/PerformanceEdge';
const GenerateForm = ({ }) => {
    // permissions for tranfer
    const isViewEvaluatioFormPermitted = HasAccess("VIEW_EVALUATION_FORMS");
    const isViewSelfAssessmentFormPermitted = HasAccess("VIEW_SELF_ASSESSMENT_FORMS");
    const isViewPeerAssessmentFormPermitted = HasAccess("VIEW_PEER_ASSESSMENT_FORMS");
    const isCreateEvaluatioFormPermitted = HasAccess("CREATE_EVALUATION_FORM");
    const isCreateSelfAssessmentFormPermitted = HasAccess("CREATE_SELF_ASSESSMENT_FORM");
    const isCreatePeerAssessmentFormPermitted = HasAccess("CREATE_PEER_ASSESSMENT_FORM");
    const [OpenEvaluationForm, setOpenEvaluationForm] = useState(false);
    const [OpenSelfAssessmentForm, setOpenSelfAssessmentForm] = useState(false);
    const [OpenPeerAssessmentForm, setOpenPeerAssessmentForm] = useState(false);
    const [activeTab, setActiveTab] = useState("Employee Evaluation");
    const [reloadData, setReloadData] = useState({});


    const TabListArray = React.useMemo(() => [
        ...(isViewEvaluatioFormPermitted ? ["Employee Evaluation"] : []),
        ...(isViewSelfAssessmentFormPermitted ? ["Self Assessment"] : []),
        ...(isViewPeerAssessmentFormPermitted ? ["Peer Assessment"] : []),
    ], [isViewEvaluatioFormPermitted, isViewSelfAssessmentFormPermitted, isViewPeerAssessmentFormPermitted]);


    const handleRequestClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setOpenEvaluationForm(false);
        setOpenSelfAssessmentForm(false);
        setOpenPeerAssessmentForm(false);
        const triggeredResquest = event.target.title;
        if (triggeredResquest === 'employee-evaluation')
            setOpenEvaluationForm(true);
        else if (triggeredResquest === 'self-assessment')
            setOpenSelfAssessmentForm(true);
        else if (triggeredResquest === 'peer-assessment')
            setOpenPeerAssessmentForm(true);
    }

    return (
        <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}        >
            <Header
                content={
                    <>
                        {activeTab === "Employee Evaluation" && isCreateEvaluatioFormPermitted && (
                            <Button title='employee-evaluation' onClick={handleRequestClick}>
                                Add Employee Evaluation Form
                            </Button>
                        )}
                        {activeTab === "Self Assessment" && isCreateSelfAssessmentFormPermitted && (
                            <Button title="self-assessment" onClick={handleRequestClick}>
                                Add Self Assessment Form
                            </Button>
                        )}
                        {activeTab === "Peer Assessment" && isCreatePeerAssessmentFormPermitted && (
                            <Button title="peer-assessment" onClick={handleRequestClick}>
                                Add Peer Assessment Form
                            </Button>
                        )}
                    </>
                }
            />
            <Tabs
                defaultValue="Transfers"
                className="w-full"
                onValueChange={(tab) => {
                    setActiveTab(tab);
                }}
                value={activeTab ?? TabListArray[0]}
            >
                <TabsList>
                    {TabListArray.map((tab) => (
                        <TabsTrigger key={tab} value={tab}>
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <Card>
                    <TabsContent value="Employee Evaluation">
                        <EvaluationForm reload={reloadData['evaluation']} />
                    </TabsContent>
                    <TabsContent value="Self Assessment">
                        <SelfAssessmentForm reload={reloadData['selft-assessment']} />
                    </TabsContent>
                    <TabsContent value="Peer Assessment">
                        <PeerAssessmentForm reload={reloadData['peer-assessment']} />
                    </TabsContent>
                </Card>
            </Tabs>
            {OpenEvaluationForm && (
                <AddUpdateEvaluationForm
                    isOpen={OpenEvaluationForm}
                    setIsOpen={() => {
                        setOpenEvaluationForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'evaluation': !prev["evaluation"],
                            };
                        })
                    }}
                />
            )}
            {OpenSelfAssessmentForm && (
                <AddSelfAssessmentForm
                    isOpen={OpenSelfAssessmentForm}
                    setIsOpen={() => {
                        setOpenSelfAssessmentForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'selft-assessment': !prev["selft-assessment"],
                            };
                        });
                    }}

                />
            )}
            {OpenPeerAssessmentForm && (
                <PeerAssessmentActions
                    isOpen={OpenPeerAssessmentForm}
                    setIsOpen={() => {
                        setOpenPeerAssessmentForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'peer-assessment': !prev["peer-assessment"],
                            };
                        });
                    }}

                />
            )}
        </div>
    );
};

export default GenerateForm
