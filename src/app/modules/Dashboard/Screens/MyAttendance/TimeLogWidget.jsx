import React from "react";
import { CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Clock } from "lucide-react";

export default function TimeLogWidget() {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Time Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="bg-blue-50/80 rounded-lg p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <span className="text-gray-500 text-sm">Check In:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-900 font-medium">09:00 AM</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Check Out:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-900 font-medium">06:00 PM</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Status:</span>
                <div className="mt-1">
                  <span className="px-2.5 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                    Present
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Total Hours:</span>
                <div className="text-gray-900 font-medium mt-1">9 hours</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
} 