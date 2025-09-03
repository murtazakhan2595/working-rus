
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import { EvaluationSection } from 'app/utils/Types/PerformanceEdge';
import { Progress } from "src/@/components/ui/progress";
import { RadioGroupInput } from "components/FormControl";


const DisplaySectionField = React.memo(
    ({ section, field, fieldNumber , value }) => {
        const fieldsScore = 60;
        return (
            <div>
                <div className='font-bold'>{fieldNumber + 1}. {field.question}</div>
                <Progress value={fieldsScore} />
            </div>
        );
    }
);

export default DisplaySectionField;