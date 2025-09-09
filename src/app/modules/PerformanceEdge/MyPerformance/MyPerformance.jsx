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
    const isViewGoalsPermitted = HasAccess("VIEW_MY_GOALS");
    const isCreateGoalsPermitted = HasAccess("CREATE_GOAL");
    const isSubmitEvaluatioFormPermitted = HasAccess("CREATE_SELF_ASSESSMENT_FORM");
    const isViewFinalEvaluatioFormPermitted = HasAccess("CREATE_PEER_ASSESSMENT_FORM");
    const [OpenMyGoalsForm, setOpenMyGoalsForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    const [activeTab, setActiveTab] = useState(null);


    const TabListArray = React.useMemo(() => [
        ...(isSubmitEvaluatioFormPermitted ? ["Submit Evaluation"] : []),
        ...(isViewFinalEvaluatioFormPermitted ? ["Final Evaluations"] : []),
        ...(!isViewGoalsPermitted ? ["My Goals"] : []),
    ], [isViewGoalsPermitted, isSubmitEvaluatioFormPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenMyGoalsForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'my-goals')
                setOpenMyGoalsForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "My Goals" && isCreateGoalsPermitted)
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
                        <MyGoals reload={reloadData['my-goals']} />
                    </TabsContent>
                </Card>
            </Tabs>
            {OpenMyGoalsForm && (
                <AddUpdateMyGoals
                    isOpen={OpenMyGoalsForm}
                    setIsOpen={() => {
                        setOpenMyGoalsForm(false);
                        setReloadData((prev) => {
                            return {
                                ...prev,
                                'my-goals': !prev["my-goals"],
                            };
                        });
                    }}
                />
            )}
        </div>
    );
};

export default MyPerformance
