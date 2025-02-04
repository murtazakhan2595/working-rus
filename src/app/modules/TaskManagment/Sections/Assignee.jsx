import React, { useEffect } from "react";
import { SelectMultiInputComponent } from "components/FormControl";

const Assignee = React.memo(
  ({
    assigneeSelected = [],
    employees,
    onChange,
    projectMembers = [],
    error,
    touch,
  }) => {
    // Filter employee based on project Members
    const filteredEmployees = React.useMemo(() => {
      return employees?.filter((employee) =>
        projectMembers.includes(employee.value)
      );
    }, [employees, projectMembers]);

    useEffect(() => {
      //Remove the member as assignee if removed/no longer part of project
      if (
        Array.isArray(assigneeSelected) &&
        assigneeSelected.length &&
        Array.isArray(projectMembers) &&
        projectMembers.length
      ) {
        const assigneeIncluded = assigneeSelected?.filter((employee) =>
          projectMembers.includes(employee)
        );
        onChange(assigneeIncluded);
      }
    }, [projectMembers]);

    return (
      <SelectMultiInputComponent
        name="assigned_to"
        options={filteredEmployees}
        label={"Assignee"}
        value={assigneeSelected || []}
        onChange={(field, value) => {
          onChange(value);
        }}
        error={error}
        touch={touch}
        // icon={<Users size={15} strokeWidth={2} />}
        placeholder="Add Assignee"
      />
    );
  }
);
export default Assignee;
