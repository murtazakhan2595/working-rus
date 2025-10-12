import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Badge } from "components/ui/badge";
import { Alert, AlertDescription } from "src/@/components/ui/alert";
import {
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import { Progress } from "src/@/components/ui/progress";

const SkillsGapWidget = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Skills Gap Analysis</CardTitle>
          <CardDescription>Demand vs. Supply</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.skills_gap_analysis) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Skills Gap Analysis</CardTitle>
          <CardDescription>Demand vs. Supply</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>No skills gap data available</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const {
    skills_gap_analysis,
    critical_skills,
    summary,
    total_requisitions,
    total_applicants,
  } = data;

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          badge: "bg-[#fee2e2] text-red-700",
        };
      case "high":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-700",
          badge: "bg-orange-100 text-orange-700",
        };
      case "medium":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
        };
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-plum-900">
          Skills Gap Analysis
        </CardTitle>
        <CardDescription>
          Demand vs. Supply across {total_requisitions || 0} requisitions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-900">
              {summary?.total_skills_analyzed || 0}
            </p>
            <p className="text-[10px] text-blue-700 uppercase">
              Skills Analyzed
            </p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-orange-900">
              {summary?.skills_with_gap || 0}
            </p>
            <p className="text-[10px] text-orange-700 uppercase">With Gaps</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-red-50 to-[#fee2e2] rounded-lg">
            <Users className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-900">
              {summary?.average_gap_percentage?.toFixed(0) || 0}%
            </p>
            <p className="text-[10px] text-red-700 uppercase">Avg Gap</p>
          </div>
        </div>

        {/* Critical Skills Alert */}
        {critical_skills && critical_skills.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <span className="font-semibold">
                {critical_skills.length} Critical Skill Gap(s) Identified
              </span>
              <br />
              Immediate action required for hiring success
            </AlertDescription>
          </Alert>
        )}

        {/* Skills Gap List */}
        <div>
          <h4 className="text-xs font-semibold text-neutral-1200 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Detailed Skills Gap
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {skills_gap_analysis && skills_gap_analysis.length > 0 ? (
              skills_gap_analysis.map((skill, index) => {
                const colors = getSeverityColor(skill.severity);
                return (
                  <Card
                    key={index}
                    className={`p-3 border ${colors.border} ${colors.bg}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className={`text-sm font-bold ${colors.text}`}>
                            {skill.skill_name}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-[9px] ${colors.badge} border-0`}
                          >
                            {skill.severity}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-neutral-1000">Demand</p>
                            <p className={`font-bold ${colors.text}`}>
                              {skill.demand}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-1000">Supply</p>
                            <p className={`font-bold ${colors.text}`}>
                              {skill.supply}
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-1000">Gap</p>
                            <p className={`font-bold ${colors.text}`}>
                              {skill.gap}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          {skill.gap_percentage}%
                        </p>
                        <p className="text-[9px] text-neutral-1000">Gap</p>
                      </div>
                    </div>
                    <Progress
                      value={skill.gap_percentage}
                      className="h-2"
                      indicatorClassName={
                        skill.severity === "Critical"
                          ? "bg-red-600"
                          : skill.severity === "High"
                          ? "bg-orange-600"
                          : "bg-yellow-600"
                      }
                    />
                  </Card>
                );
              })
            ) : (
              <Alert>
                <AlertDescription className="text-sm">
                  ✅ No skill gaps detected - good candidate pool!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Context Footer */}
        <div className="text-center pt-2 border-t">
          <p className="text-[11px] text-neutral-1000">
            Based on {total_requisitions || 0} open requisitions and{" "}
            {total_applicants || 0} active applicants
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsGapWidget;

