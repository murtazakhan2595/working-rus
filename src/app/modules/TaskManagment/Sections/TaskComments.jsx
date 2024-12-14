import React, { useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover";
import {
  TextInput,
  SelectComponent,
  DateInput,
  InputComments
} from "components/form-control.jsx";
import {
  getCommentsWithAttachments,
  getTaskById,
} from "app/hooks/taskManagment";
import { EmployeeName } from "utils/getValuesFromTables";
import { filebase64Download } from "utils/fileUtils";
import moment from "moment";
import { Button } from "components/ui/button";
import {
  AiOutlineDownload,
  AiOutlineFile,
  AiOutlinePaperClip,
} from "react-icons/ai";
import { Input } from "components/ui/input";
import { Label } from "../../../../src/@/components/ui/label";
import { Checkbox } from "../../../../src/@/components/ui/checkbox";
import { Card } from "components/ui/card";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDarkerTextColor } from "../Boards/Sections/getTaskStatus";
import { Members } from "app/modules/TaskManagment/Sections";

export default function TaskComments({
  taskId
}) {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedAssignee, setSelectedLabels] = React.useState([]);

  useEffect(async () => {
    try {
      const data = await getCommentsWithAttachments({ task_id: [taskId] });
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, [taskId]);

  return (
    <div className="mt-3">
     
      <InputComments/>
    </div>
  );
}
