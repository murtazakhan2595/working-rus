import React from "react";
import { Badge } from "components/ui/badge";
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  PlayCircle, 
  Clock,
  XCircle,
  AlertTriangle
} from "lucide-react";

const PayrollStatusBadge = ({ status, size = "default", showIcon = true }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || "";

    const configs = {
      draft: {
        label: "Draft",
        variant: "secondary",
        icon: FileText,
        className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      },
      in_review: {
        label: "In Review",
        variant: "default",
        icon: Eye,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      },
      approved: {
        label: "Approved",
        variant: "default",
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      },
      processed: {
        label: "Processed",
        variant: "default",
        icon: PlayCircle,
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      },
      pending: {
        label: "Pending",
        variant: "default",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      },
      rejected: {
        label: "Rejected",
        variant: "destructive",
        icon: XCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      },
      failed: {
        label: "Failed",
        variant: "destructive",
        icon: AlertTriangle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      },
      on_hold: {
        label: "On Hold",
        variant: "default",
        icon: AlertTriangle,
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      },
      paid: {
        label: "Paid",
        variant: "default",
        icon: CheckCircle,
        className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100",
      },
    };

    return configs[statusLower] || configs.draft;
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1.5 font-medium w-fit`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{config.label}</span>
    </Badge>
  );
};

export default PayrollStatusBadge;

