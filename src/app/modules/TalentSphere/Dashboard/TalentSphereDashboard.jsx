// src/app/modules/PerformanceEdge/PerformanceDashboard/PerformanceDashboard.jsx
import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardHeader,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
    getDashboardMetrics,
    getBulkDashboardData,
} from "app/hooks/performanceEdge";
import { PageLoader, TableCustom } from "components";
import { useSelector } from "react-redux";
import { HasAccess } from "utils/PermissionUtils";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "src/@/components/ui/tabs";
import { OverAllStats } from 'app/modules/TalentSphere/Dashboard';

const TalentSphereDashboard = () => {
    // const isAdminView = HasAccess("VIEW_PERFORMANCE_DASHBOARD");
    // const isBranchView = HasAccess("VIEW_BRN_PERFORMANCE_DASHBOARD");
    // const isDepartmentView = HasAccess("VIEW_DPT_PERFORMANCE_DASHBOARD");
    // const isManagerView = HasAccess("VIEW_MANAGER_PERFORMANCE_DASHBOARD");
    const isAdminView = true;
    const isBranchView = true;
    const isDepartmentView = true;
    const isManagerView = true;

    const Departments = useSelector((state) => state.common.departments);
    const Branches = useSelector((state) => state.common.branches);
    const Designations = useSelector((state) => state.common.designations);
    const {
        branch_id: user_branch,
        department_name: user_department,
        id: user_id,
    } = useSelector((state) => state.emp.user_details);


    return (
        <div className={`flex flex-col gap-4 mb-10 ${window.location.pathname.substring(1)}`}    >
            <OverAllStats />
        </div>
    );
};

export default TalentSphereDashboard;
