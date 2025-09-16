import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { StartAssessmentForm, ViewSelfAssessment, StartPeerAssessmentForm } from "app/modules/PerformanceEdge";
import { useNavigate } from "react-router-dom";

const TeamEvaluationActions = ({ data, reloadData = () => { }, ViewFinalEvaluation = false }) => {
    const [startTeamEvaluation, setStartTeamEvaluation] = useState(null);
    const navigate = useNavigate();
    const handleView = () => {
        if (ViewFinalEvaluation)
            navigate(`/evaluatoin-summary/${data.id}`)
        else
            setStartTeamEvaluation(true);
    };

    return (
        <>
            <DropdownActionMenu
                menuTooltip="Evaluation Actions"
                onView={handleView}
                //  onEdit={handleEdit}
                // onDelete={handleDelete}
                viewText={ViewFinalEvaluation ? "View Final Evaluation" : "Proceed Evaluation"}
            // deleteText="Delete Goals"
            />

            {startTeamEvaluation && (
                <StartAssessmentForm
                    isOpen={startTeamEvaluation}
                    setIsOpen={setStartTeamEvaluation}
                    form_id={data?.self_assesment_id?.form_id}
                    reloadData={reloadData}
                    cycle_id={data.id}
                />
            )}

        </>
    );
};

export default TeamEvaluationActions;
