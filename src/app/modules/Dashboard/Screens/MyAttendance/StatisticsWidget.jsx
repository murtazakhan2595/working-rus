import React from "react";
import { CardHeader, CardTitle, CardContent } from "components/ui/card";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

export default function StatisticsWidget() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Present Days */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-medium">Present</span>
            </div>
            <div className="text-2xl font-semibold text-green-700">22</div>
            <div className="text-sm text-gray-500 mt-1">This Month</div>
          </div>

          {/* Absent Days */}
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-gray-700 font-medium">Absent</span>
            </div>
            <div className="text-2xl font-semibold text-red-700">2</div>
            <div className="text-sm text-gray-500 mt-1">This Month</div>
          </div>

          {/* Late Days */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700 font-medium">Late</span>
            </div>
            <div className="text-2xl font-semibold text-orange-700">3</div>
            <div className="text-sm text-gray-500 mt-1">This Month</div>
          </div>

          {/* Half Days */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700 font-medium">Half Day</span>
            </div>
            <div className="text-2xl font-semibold text-blue-700">1</div>
            <div className="text-sm text-gray-500 mt-1">This Month</div>
          </div>
        </div>
      </CardContent>
    </>
  );
} 