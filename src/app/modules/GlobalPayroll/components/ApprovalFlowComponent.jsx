import React from "react";
import { CheckCircle, Clock, XCircle, ArrowRight, User } from "lucide-react";
import { Badge } from "components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const ApprovalFlowComponent = ({ 
  approvalLevels = [], 
  currentLevel = 0,
  className = "" 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  const getInitials = (name) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Approval Flow
        </h3>
        <Badge variant="secondary">
          Level {currentLevel} of {approvalLevels.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {approvalLevels.map((level, index) => {
          const isActive = index === currentLevel;
          const isCompleted = index < currentLevel;
          const isPending = index === currentLevel;
          const isFuture = index > currentLevel;

          return (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < approvalLevels.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform translate-y-3" />
              )}

              {/* Approval Level Card */}
              <div
                className={`
                  relative p-4 rounded-lg border-2 transition-all
                  ${isActive 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : isCompleted
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {getStatusIcon(level.status)}
                  </div>

                  {/* Level Details */}
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Level {index + 1}: {level.role || level.title}
                        </h4>
                        <Badge className={getStatusColor(level.status)}>
                          {level.status || "Pending"}
                        </Badge>
                      </div>
                      
                      {level.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>

                    {/* Approver Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={level.approver?.avatar} alt={level.approver?.name} />
                        <AvatarFallback>
                          {getInitials(level.approver?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {level.approver?.name || "Pending Assignment"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {level.approver?.email || level.approver?.position}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp and Comments */}
                    {level.timestamp && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {level.status === "approved" && "Approved "}
                        {level.status === "rejected" && "Rejected "}
                        {formatDistanceToNow(new Date(level.timestamp), { addSuffix: true })}
                      </div>
                    )}

                    {level.comments && (
                      <div className="mt-2 p-2 bg-white/50 dark:bg-gray-900/50 rounded text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Comment:</span> {level.comments}
                        </p>
                      </div>
                    )}

                    {/* Delegates if any */}
                    {level.delegates && level.delegates.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delegates:</p>
                        <div className="flex items-center gap-2">
                          {level.delegates.map((delegate, idx) => (
                            <div key={idx} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              <User className="w-3 h-3" />
                              <span>{delegate.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Arrow for next level */}
              {index < approvalLevels.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            {approvalLevels.filter((l) => l.status === "approved").length} of {approvalLevels.length} levels approved
          </span>
          {approvalLevels.every((l) => l.status === "approved") && (
            <Badge className="bg-green-500 text-white">
              <CheckCircle className="w-3 h-3 mr-1" />
              Fully Approved
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalFlowComponent;

