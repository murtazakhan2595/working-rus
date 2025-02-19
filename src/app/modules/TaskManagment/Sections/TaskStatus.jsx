import * as React from "react";
import { lightenColor } from "utils/renderValues";
import { TaskStatus } from "data/Data";
import { Badge } from "components/ui/badge";


const TaskStatusLabel = React.memo(({ status }) => {
  if (!status) return null;
  const statusObj = TaskStatus.find((obj) => obj.value === status);
  return (
    <Badge
      className="me-2 rounded"
      style={{
        background: statusObj.backgroundColor,
      }}
    >
      {statusObj?.label || status}
    </Badge>
  );
});

export default TaskStatusLabel;
