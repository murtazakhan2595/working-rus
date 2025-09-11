
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { FormField } from "components/FormControl";
import { EvaluationSection } from 'app/utils/Types/PerformanceEdge';
import { Progress } from "src/@/components/ui/progress";
import { calculateTotal } from "utils/renderValues";


const PerformanceProccessBar = React.memo(({ label, list, titile, description, error }) => {
    const fieldsScore = calculateTotal(list, label);
    return (
        <FormField
            label={titile ?? 'Section Weightage'}
            className={``}
            field_description={description ?? 'Form section weightage should 100.'}
            error={error}
            touched={true}
        >
            <Progress value={fieldsScore} />

        </FormField>
    )
});

export default PerformanceProccessBar;