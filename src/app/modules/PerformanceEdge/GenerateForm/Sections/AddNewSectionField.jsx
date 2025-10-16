
import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { errorClassName } from "components/FormControl";
import { EvaluationSectionField } from 'app/utils/Types/PerformanceEdge';


const AddNewSectionField = React.memo(
    ({ name, onChange = () => { }, value = [], error }) => {
        const handleClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const updatedSections = [
                ...(value || []),
                { ...EvaluationSectionField },
            ];
            onChange(name, updatedSections);
        };
        return (
            <div>
                <Button variant="outline" onClick={handleClick}>
                    Add Field
                </Button>
                <div className={errorClassName}>{error}</div>
            </div>
        );
    }
);

export default AddNewSectionField;