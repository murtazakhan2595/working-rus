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
    PendingEvaluation,
    AddUpdateEvaluationForm,
    CalibrationPanel,
    AddSelfAssessmentForm,
    PeerAssessmentForm,
    TeamGoals
} from 'app/modules/PerformanceEdge';
const PerformanceEvaluation = ({ }) => {
    // permissions for tranfer
    const isViewGoalsPermitted = HasAccess("VIEW_TEAM_GOALS");
    const isViewFinalEvaluatioFormPermitted = HasAccess("VIEW_EVALUATION_FORMS");
    const isSubmitEvaluatioFormPermitted = HasAccess("CREATE_EVALUATION_FORM");
    const isCreateSelfAssessmentFormPermitted = HasAccess("CREATE_SELF_ASSESSMENT_FORM");
    const isCreatePeerAssessmentFormPermitted = HasAccess("CREATE_PEER_ASSESSMENT_FORM");
    const [OpenEvaluationForm, setOpenEvaluationForm] = useState(false);
    const [OpenSelfAssessmentForm, setOpenSelfAssessmentForm] = useState(false);
    const [OpenPeerAssessmentForm, setOpenPeerAssessmentForm] = useState(false);
    const [activeTab, setActiveTab] = useState("Pending Evaluation");


    const TabListArray = React.useMemo(() => [
        ...(isSubmitEvaluatioFormPermitted ? ["Pending Evaluation"] : []),
         ...(isSubmitEvaluatioFormPermitted ? ["Calibration Panel"] : []),
        // ...(isViewGoalsPermitted ? ["Team Goals"] : []),
    ], [isViewGoalsPermitted, isViewFinalEvaluatioFormPermitted, isSubmitEvaluatioFormPermitted]);


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
                defaultValue="Submit Evaluation"
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
                    <TabsContent value="Pending Evaluation">
                        <PendingEvaluation />
                    </TabsContent>
                    <TabsContent value="Calibration Panel">
                        <CalibrationPanel />
                    </TabsContent>
                    <TabsContent value="Team Goals">
                        <TeamGoals />
                    </TabsContent>
                </Card>
            </Tabs>
            {OpenEvaluationForm && (
                <AddUpdateEvaluationForm
                    isOpen={OpenEvaluationForm}
                    setIsOpen={() => {
                        setOpenEvaluationForm(false);
                        //fetchData(true);
                    }}
                    initiator={'MANAGER'}
                />
            )}
            {OpenSelfAssessmentForm && (
                <AddSelfAssessmentForm
                    isOpen={OpenSelfAssessmentForm}
                    setIsOpen={() => {
                        setOpenSelfAssessmentForm(false);
                        //fetchData(true);
                    }}

                />
            )}
            {OpenPeerAssessmentForm && (
                <AddSelfAssessmentForm
                    isOpen={OpenPeerAssessmentForm}
                    setIsOpen={() => {
                        setOpenPeerAssessmentForm(false);
                        //fetchData(true);
                    }}

                />
            )}
        </div>
    );
};

export default PerformanceEvaluation
