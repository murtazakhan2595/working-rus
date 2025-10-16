
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import { EvaluationSection } from 'app/utils/Types/PerformanceEdge';


const AddNewSection = React.memo(
    ({ name, onChange = () => { }, value = [], error }) => {
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const updatedSections = [
                ...(value || []),
                { ...EvaluationSection },
            ];
            onChange(name, updatedSections);
        };
        return (
            <div>
                <Button variant="outline" onClick={handleClick}>
                    Add Section
                </Button>
                <div className={errorClassName}>{error}</div>
            </div>
        );
    }
);

export default AddNewSection;