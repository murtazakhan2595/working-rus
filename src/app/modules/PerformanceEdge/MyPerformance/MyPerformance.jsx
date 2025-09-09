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
    Evaluations,
    AddUpdateMyGoals,
    EvaluationResults,
    AddSelfAssessmentForm,
    MyGoals,
} from 'app/modules/PerformanceEdge';
const MyPerformance = ({ }) => {
    // permissions for tranfer
    const isViewFinalEvaluatioFormPermitted = HasAccess("VIEW_EVALUATION_FORMS");
    const isSubmitEvaluatioFormPermitted = HasAccess("CREATE_EVALUATION_FORM");
    const isCreateSelfAssessmentFormPermitted = HasAccess("CREATE_SELF_ASSESSMENT_FORM");
    const isCreatePeerAssessmentFormPermitted = HasAccess("CREATE_PEER_ASSESSMENT_FORM");
    const [OpenMyGoalsForm, setOpenMyGoalsForm] = useState(false);
    const [OpenSelfAssessmentForm, setOpenSelfAssessmentForm] = useState(false);
    const [OpenPeerAssessmentForm, setOpenPeerAssessmentForm] = useState(false);
    const [activeTab, setActiveTab] = useState("Submit Evaluation");


    const TabListArray = React.useMemo(() => [
        ...(isSubmitEvaluatioFormPermitted ? ["Submit Evaluation"] : []),
        ...(isViewFinalEvaluatioFormPermitted ? ["Final Evaluations"] : []),
        ...(isViewFinalEvaluatioFormPermitted ? ["My Goals"] : []),
    ], [isViewFinalEvaluatioFormPermitted, isSubmitEvaluatioFormPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenMyGoalsForm(false);
            setOpenSelfAssessmentForm(false);
            setOpenPeerAssessmentForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'my-goals')
                setOpenMyGoalsForm(true);
            else if (triggeredResquest === 'self-assessment')
                setOpenSelfAssessmentForm(true);
            else if (triggeredResquest === 'peer-assessment')
                setOpenPeerAssessmentForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "My Goals" && isCreateSelfAssessmentFormPermitted)
            return (
                <Button title="my-goals" onClick={handleRequestClick}>
                    Add New Goal
                </Button>
            )
    }

    return (
        <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}        >
            <Header content={<HeaderButton />} />
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
                    <TabsContent value="Submit Evaluation">
                        <Evaluations />
                    </TabsContent>
                    <TabsContent value="Final Evaluations">
                        <EvaluationResults />
                    </TabsContent>
                    <TabsContent value="My Goals">
                        <MyGoals />
                    </TabsContent>
                </Card>
            </Tabs>
            {OpenMyGoalsForm && (
                <AddUpdateMyGoals
                    isOpen={OpenMyGoalsForm}
                    setIsOpen={() => {
                        setOpenMyGoalsForm(false);
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

export default MyPerformance
