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
    PerformanceResults,
    SubmitFeedBack,
    MyGoals,
} from 'app/modules/PerformanceEdge';
const MyPerformance = ({ }) => {
    // permissions for tranfer
    const isViewGoalsPermitted = HasAccess("VIEW_MY_GOALS");
    const isCreateGoalsPermitted = HasAccess("CREATE_GOAL");
    const isSubmitEvaluatioFormPermitted = HasAccess("CREATE_SELF_ASSESSMENT_FORM");
    const isViewFinalEvaluatioFormPermitted = HasAccess("VIEW_EVALUATION_RESULT");
    const [OpenMyGoalsForm, setOpenMyGoalsForm] = useState(false);
    const [OpenFeedbackForm, setOpenFeedbackForm] = useState(false);
    const [reloadData, setReloadData] = useState({});
    const [activeTab, setActiveTab] = useState(null);


    const TabListArray = React.useMemo(() => [
        ...(isSubmitEvaluatioFormPermitted ? ["My Performance"] : []),
        ...(isViewFinalEvaluatioFormPermitted ? ["Performance Results"] : []),
        ...(!isViewGoalsPermitted ? ["My Goals"] : []),
    ], [isViewGoalsPermitted, isSubmitEvaluatioFormPermitted, isViewFinalEvaluatioFormPermitted]);

    const HeaderButton = () => {
        const handleRequestClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpenMyGoalsForm(false);
            setOpenFeedbackForm(false);
            const triggeredResquest = event.target.title;
            if (triggeredResquest === 'my-goals')
                setOpenMyGoalsForm(true);
            else if (triggeredResquest === 'feedback')
                setOpenFeedbackForm(true);
        }
        const activeButtonTab = activeTab ?? TabListArray[0];
        if (activeButtonTab === "My Goals" && isCreateGoalsPermitted) {
            return (
                <Button title="my-goals" onClick={handleRequestClick}>
                    Add New Goal
                </Button>
            )
        }
        else {
            return (
                <Button title="feedback" onClick={handleRequestClick}>
                    Submit Feedback
                </Button>
            )
        }
    }

    return (
        <div className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}        >
            <Header content={<HeaderButton />} />
            <Tabs
                defaultValue="My Performance"
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
                    <TabsContent value="My Performance">
                        <Evaluations />
                    </TabsContent>
                    <TabsContent value="Performance Results">
                        <PerformanceResults />
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
            {OpenFeedbackForm && (
                <SubmitFeedBack
                    isOpen={OpenFeedbackForm}
                    setIsOpen={() => {
                        setOpenFeedbackForm(false);
                    }}
                />
            )}
        </div>
    );
};

export default MyPerformance
