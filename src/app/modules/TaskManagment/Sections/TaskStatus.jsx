import * as React from "react";
import { lightenColor } from "utils/renderValues";
import { TaskStatus } from "data/Data";

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
    <div
      className="text-nowrap text-xs font-medium me-2 px-2 py-1 rounded flex items-center justify-center"
      style={{
        background: getStatusLabelBackground(status),
      }}
    >
      {TaskStatus.find((obj) => obj.value === status)?.label || status}
    </div>
  );
});

export default TaskStatusLabel;
