import React, { useState, useEffect, useRef, memo } from "react";
import { InputTaskCustomFields } from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails/Sections";
import { PriorityList, TaskStatus } from "data/Data";
import {
  Labels,
  Assignee,
  TaskRelation,
} from "app/modules/TaskManagment/Sections";
import { TextInput } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { SelectComponent, CoverFileUpload } from "components/FormControl";
import TaskShare from "app/modules/TaskManagment/Sections/TaskShare";
import { DetailBox } from "components/SheetCardExtension";

const InputTaskDetailFields = React.memo(
  ({
    errors,
    touched,
    onChange = () => {},
    taskId,
    taskData,
    isSubtask,
    projectDetail,
    employees,
    CustomFields = [],
  }) => {
    return (
      <div className="grid grid-cols-2 gap-5 my-8">
        <DateInput
          name="end_date"
          label="Due Date"
          error={errors.end_date}
          touch={touched.end_date}
          value={taskData.end_date}
          onChange={(field, value) => {
            onChange(field, value);
          }}
        />
        <SelectComponent
          name="priority"
          options={PriorityList}
          label={"Priority"}
          error={errors.priority}
          touch={touched.priority}
          value={taskData.priority}
          onChange={(field, value) => {
            onChange(field, value);
          }}
          classes=""
        />
        <Labels
          labelsSelected={taskData.label || []}
          onSelectedLabelsChange={(value) => {
            onChange("label", value);
          }}
          editMode={true} // Always in edit mode
        />
        <Assignee
          assigneeSelected={taskData.assigned_to || []}
          employees={employees}
          onChange={(value) => {
            onChange("assigned_to", value);
          }}
          editMode={true} // Always in edit mode
          projectMembers={projectDetail?.project_members || []}
          error={errors.assigned_to}
          touch={touched.assigned_to}
          value={taskData.assigned_to}
        />
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            name="estimated_time"
            error={errors.estimated_time}
            label={"Estimated Time"}
            touch={touched.estimated_time}
            value={taskData.estimated_time}
            onChange={(field, value) => {
              onChange(field, value);
            }}
          />
          <TextInput
            label={"Time Spent"}
            name="consumed_time"
            error={errors.consumed_time}
            touch={touched.consumed_time}
            value={taskData.consumed_time}
            onChange={(field, value) => {
              onChange(field, value);
            }}
          />
        </div>
        {!isSubtask && (
          <TaskRelation
            relationsList={taskData.relation || []}
            onChange={(value) => {
              onChange("relation", value);
            }}
            projectId={taskData.project_id}
            taskId={taskId}
            editMode={true}
            error={errors.relation}
            touch={touched.relation}
          />
        )}
        {!isSubtask && (
          <SelectComponent
            name="status"
            options={TaskStatus}
            label={"Status"}
            error={errors.status}
            touch={touched.status}
            value={taskData.status}
            onChange={(field, value) => {
              onChange(field, value);
            }}
          />
        )}

        {/* <DetailBox
          label="Share Task"
          orientation="horizontal"
          value={<TaskShare projectId={taskData.project_id} taskId={taskId} />}
        /> */}
        {CustomFields &&
          CustomFields.map((CustomField) => {
            return (
              <div key={CustomField.id}>
                <InputTaskCustomFields
                  CustomField={CustomField}
                  onChange={(field, value) => {
                    onChange(field, value);
                  }}
                  customFieldValues={taskData.custom_fields || []}
                  name={"custom_fields"}
                />
              </div>
            );
          })}
      </div>
    );
  }
);

export default InputTaskDetailFields;
