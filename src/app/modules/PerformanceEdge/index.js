// src/app/modules/PerformanceEdge/index.js
import {
    GenerateForm,
    SelfAssessmentFormActions,
    EvaluationForm,
    AddSelfAssessmentForm,
    PeerAssessmentForm,
    AddUpdateEvaluationForm,
    EvaluationFormActions,
    SelfAssessmentForm,
    PeerAssessmentActions,
    AddUpdatePeerAssesmentForm,
} from "./GenerateForm";
import {
    PerformanceCycleSetup,
    CreateUpdateCycleForm,
    PerformanceCycleActions,
    PerformanceCycleDetails
} from "./PerformanceCycleSetup";
import {
    PerformanceDashboard,
    PerformanceStatsCards,
    PerformanceCharts,
    DepartmentRatingChart,
    PerformanceTableColumns,
    ExportPerformanceReports,
} from "./PerformanceDashboard";


import {
    MyPerformance,
    MyPerformanceActions,
    StartAssessmentForm,
    Evaluations,
    PerformanceResults,
    PerformanceResultsActions,
    PerformanceResultDetails,
    AddUpdateMyGoals,
    MyGoals,
    MyGoalsActions,
    ViewMyGoalsDetails,
} from './MyPerformance';

import {
    TeamPerformanceEvaluation,
    PendingEvaluation,
    EvaluationSummary,
    TeamGoals,
    TeamGoalsActions,
} from './TeamPerformanceEvaluation';

import { EmployeeFeedback, SubmitFeedBack } from './EmployeeFeedback';

export {
    GenerateForm,
    EvaluationForm,
    AddUpdateEvaluationForm,
    EvaluationFormActions,
    SelfAssessmentForm,
    AddSelfAssessmentForm,
    SelfAssessmentFormActions,
    PeerAssessmentForm,
    PerformanceCycleSetup,
    CreateUpdateCycleForm,
    MyPerformance,
    MyPerformanceActions,
    StartAssessmentForm,
    Evaluations,
    PerformanceResults,
    PerformanceResultsActions,
    PerformanceResultDetails,
    PerformanceCycleActions,
    PerformanceCycleDetails,
    TeamPerformanceEvaluation,
    PendingEvaluation,
    EvaluationSummary,
    AddUpdatePeerAssesmentForm,
    AddUpdateMyGoals,
    PeerAssessmentActions,
    MyGoalsActions,
    ViewMyGoalsDetails,
    MyGoals,
    TeamGoals,
    TeamGoalsActions,
    EmployeeFeedback,
    SubmitFeedBack,
    // Performance Dashboard Components
    PerformanceDashboard,
    PerformanceStatsCards,
    PerformanceCharts,
    DepartmentRatingChart,
    PerformanceTableColumns,
    ExportPerformanceReports,
};
