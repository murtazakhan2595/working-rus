import * as React from "react";
import { lightenColor } from "utils/renderValues";
import { TaskStatus } from "data/Data";
import { Badge } from "components/ui/badge";

const getStatusLabelBackground = (status) => {
  switch (status) {
    case "INPROGRESS":
      return lightenColor("#2e86c1", 85);
    case "COMPLETED":
      return lightenColor("#12B76A", 85);
    case "Onhold":
      return lightenColor("#B00D1B", 85);
    default:
      return lightenColor("#FBBF24", 85);
  }
};
const TaskStatusLabel = React.memo(({ status }) => {
  if (!status) return null;
  return (
    <Badge
      className="me-2 rounded"
      style={{
        background: getStatusLabelBackground(status),
      }}
    >
      {TaskStatus.find((obj) => obj.value === status)?.label || status}
    </Badge>
  );
});

export default TaskStatusLabel;
