import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { StartAssessmentForm, ViewSelfAssessment, StartPeerAssessmentForm } from "app/modules/PerformanceEdge";

const MyPerformanceActions = ({ data, reloadData = () => { }, DataList = [] }) => {
    const [startSelfAssessment, setStartSelfAssessment] = useState(null);
    const [viewSelfAssessment, setViewSelfAssessment] = useState(null);
    const [startPeerAssessment, setStartPeerAssessment] = useState(null);
    const [viewPeerAssessment, setViewPeerAssessment] = useState(null);

    const handleStartSelfAssessment = () => {
        setStartSelfAssessment(true);
    };

    const handleViewSelfAssessment = () => {
        setViewSelfAssessment(true);
    };
    const handleStartPeerAssessment = () => {
        setStartPeerAssessment(true);
    };

    const handleViewPeerAssessment = () => {
        setViewPeerAssessment(true);
    };

    return (
        <>
            <DropdownActionMenu
                menuTooltip="Perfotmance Actions"
                additionalOptionsConfig={[
                    ...(data?.self_assessment_status?.toLowerCase() === 'pending' ? [{ text: 'Start Self Assessment', action: handleStartSelfAssessment }] : []),
                    ...(data?.self_assessment_status?.toLowerCase() === 'completed' ? [{ text: 'View Self Assessment', action: handleViewSelfAssessment }] : []),
                    ...(data?.peer_assessment_status?.toLowerCase() === 'pending' ? [{ text: 'Start Peer Assessment', action: handleStartPeerAssessment }] : []),
                    ...(data?.peer_assessment_status?.toLowerCase() === 'completed' ? [{ text: 'View Peer Assessment', action: handleViewPeerAssessment }] : []),
                ]}
            />

            {startSelfAssessment && (
                <StartAssessmentForm
                    isOpen={startSelfAssessment}
                    setIsOpen={setStartSelfAssessment}
                    form_id={data?.self_assesment_id?.form_id}
                    reloadData={reloadData}
                    cycle_id={data.id}
                />
            )}
            {startPeerAssessment && (
                <StartPeerAssessmentForm
                    isOpen={startPeerAssessment}
                    setIsOpen={setStartPeerAssessment}
                    form_id={data?.peer_assesment_id?.form_id}
                    reloadData={reloadData}
                    cycle_id={data.id}
                    isPeerAssessment={true}
                />
            )}
            {viewSelfAssessment && (
                <ViewSelfAssessment
                    isOpen={viewSelfAssessment}
                    setIsOpen={setViewSelfAssessment}
                    form_id={data?.self_assesment_id?.form_id}
                    reloadData={reloadData}
                    cycle_id={data.id}
                />
            )}
        </>
    );
};

export default MyPerformanceActions;
