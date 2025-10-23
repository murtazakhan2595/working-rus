import React from "react";
import { Sparkles } from "lucide-react";
import AIAlertWidget from "../components/AIAlertWidget";

const AIRecommendations = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          AI Recommendations & Automation
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered insights, anomaly detection, and smart recommendations
        </p>
      </div>

      <AIAlertWidget maxHeight="none" />
    </div>
  );
};

export default AIRecommendations;

