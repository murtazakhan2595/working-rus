export const EvaluationForm = {
    form_name: null,
    evaluation_type: null,
    evaluation_type_name: null,
    departments: null,
    designation: null,
    nationalities: null,
    status: null,
    sections: null,
    form_type: null,
    branches: null,
    id: null,
}

export const EvaluationSection = {
    name: null,
    weightage: null,
    fields: null,
}

export const EvaluationSectionField = {
    question: null,
    weightage: null,
    evaluation_type: null,
}

export const PerformanceCycle = {
    name: null,
    review_start: null,
    review_end: null,
    issuance_date: null,
    self_assessment_enabled: null,
    peer_assessment_enabled: null,
    peer_assessment_form: null,
    self_assement_form: null,
    forms: null,
    review_period: null,
    id: null,
}
export const EvaluationSubmission = {
    form: null,
    cycle: null,
    is_submitted: null,
    status: null,
}

export const MyGoals = {
    id: null,
    title: null,
    description: null,
    due_date: null,
    status: null,
    alignment: null,
    is_submitted: null,
    created_at: null,
    key_results: null,
    employee: null,
    aprroval_status: 'Pending',
}

export const EmployeeFeedback = {
    is_anonymous: null,
    satisfaction_rating: null,
    comments: null,
    category: null
}


export const CalibrationPanel = {
    final_evaluation: null,
    calibrated_by: null,
    new_score: null,
    justification: null,
}