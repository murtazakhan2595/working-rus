
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import { EvaluationSection } from 'app/utils/Types/PerformanceEdge';
import { Progress } from "src/@/components/ui/progress";


const DisplaySection = React.memo(
    ({ section, fields }) => {
        const fieldsScore = 60;
        return (
            <div>
                <Progress value={fieldsScore} />
            </div>
        );
    }
);

export default DisplaySection;