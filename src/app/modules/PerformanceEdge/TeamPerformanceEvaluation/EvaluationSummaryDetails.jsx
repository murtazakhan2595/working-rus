import React, { useState, useEffect } from "react";
import { getEvaluationSummaryDetails } from "app/hooks/performanceEdge";
import {
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    Card,
} from "components/ui/card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { EmployeeOverview, PageLoader, Header } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { FilterInput } from "components/FormControl";
import { ManagerFinalEvaluationColumns } from "app/modules/PerformanceEdge/Sections";
import { Button } from "components/ui/button";
import { renderDate } from "utils/renderValues";

const EvaluationSummaryDetails = ({ reload }) => {
    const isTeamView = HasAccess("VIEW_TEAM_EVALUATION_SUMMARY");
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [EvaluationDetails, setEvaluationDetails] = useState({});




    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await getEvaluationSummaryDetails(id);
                console.log(response, 'responsekkjn')
                setEvaluationDetails(response);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        let isMounted = true;
        if (id) fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [id]);

    if (isTeamView) return null;
    return (
        <div className='max-w-[786px] m-auto flex gap-4 flex-col'>
            <Header showBackButton={true} navigationLink='/team-performance-evaluation' showTitle={true} />
            <Card>
                <CardHeader>
                    <EmployeeOverview id={EvaluationDetails.employee} showId={true} />
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Evaluation Detail</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <DetailBox
                        label={"Name"}
                        value={EvaluationDetails.cycle_name}
                    />
                    <DetailBox
                        label={"Issue Date"}
                        value={EvaluationDetails.cycle_issuance_date}
                    />
                    <DetailBox
                        label={"Review Period"}
                        value={renderDate(EvaluationDetails.cycle_review_period)}
                    />
                </CardContent>

            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Self Assessment Summary</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                {isLoading ?
                    < PageLoader /> :
                    <CardContent>
                        {EvaluationDetails?.self_assessment ?
                            (EvaluationDetails?.self_assessment?.sections || []).map((section, sectionIndex) => {
                                return <div key={`section-${sectionIndex}`}>
                                    <div className="font-semibold text-neutral-1200">{section.name}</div>
                                    {(section.fields || []).map((field, fieldIndex) =>
                                        <DetailBox
                                            label={`${fieldIndex + 1}. ${field.question}`}
                                            value={field.answer_choice || field.answer_text || field.rating}
                                            key={`${fieldIndex}_${field.question}`}
                                            orientation={'horizontal'}
                                        />
                                    )}
                                </div>
                            }) :
                            <div>Self Assessment is not enabled.</div>
                        }

                    </CardContent>
                }

            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Peer Assessment Summary</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                {isLoading ?
                    < PageLoader /> :
                    <CardContent>
                        {EvaluationDetails?.peer_assessment ?
                            (EvaluationDetails?.self_assessment?.sections || []).map((section, sectionIndex) => {
                                return <div key={`section-${sectionIndex}`}>
                                    <div className="font-semibold text-neutral-1200">{section.name}</div>
                                    {(section.fields || []).map((field, fieldIndex) =>
                                        <DetailBox
                                            label={`${fieldIndex + 1}. ${field.question}`}
                                            value={field.answer_choice || field.answer_text || field.rating}
                                            key={`${fieldIndex}_${field.question}`}
                                            orientation={'horizontal'}
                                        />
                                    )}
                                </div>
                            }) :
                            <div>Peer Assessment is not enabled</div>
                        }

                    </CardContent>
                }

            </Card>
        </div>
    );
};

export default EvaluationSummaryDetails;
