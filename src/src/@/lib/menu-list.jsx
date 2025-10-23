import {
  Users,
  House,
  Award,
  CalendarClockIcon,
  CalendarRange,
  Crosshair,
  ListTodo,
  UserRoundCheck,
  GalleryHorizontalEnd,
  UserRoundSearch,
  UsersRound,
  BadgeDollarSign,
  Settings,
  Network,
  Laptop,
  Globe,
  TrendingUp,
  PlayCircle,
  Shield,
  Coins,
  CreditCard,
  FileText,
  Edit3,
  Bot,
  BarChart3,
  Lock,
  Link,
} from "lucide-react";
import Config from "constants/config";
import { getNodeExistInTree } from "utils/renderValues";
import { SidebarRoutes } from "constants/routes";

// Helper function to fetch route
const findRouteByCodeName = (codeName) =>
  SidebarRoutes.find(
    (route) => route.name?.toUpperCase() === codeName.toUpperCase()
  );

// Create menu function with default values
const createMenu = (to, label, icon, submenus = [], active = false) => ({
  to,
  label,
  active,
  icon,
  submenus,
});

// Fetch submenu list efficiently
const getSubModuleMenuList = (currentNodeTree) => {
  const directChildren = (currentNodeTree?.childrens || [])
    .filter(({ code_name }) => Config[code_name])
    .map(({ code_name, name }) => {
      const route = findRouteByCodeName(code_name);
      return createMenu(route?.path || "#", name);
    });

  // // Add nested children
  // const nestedChildren = (currentNodeTree?.childrens || [])
  //   .flatMap((parent) =>
  //     (parent.childrens || [])
  //       .filter(({ code_name }) => Config[code_name])
  //       .map(({ code_name, name }) => {
  //         const route = findRouteByCodeName(code_name);
  //         return createMenu(route?.path || "#", name);
  //       })
  //   );
  return [...directChildren,];
};

// Function to generate menu items
const generateMenuItems = (moduleName, icon, moduleTree) => {
  // Handle special menu items that don't depend on permission tree FIRST
  if (moduleName === "ORGANIZATIONAL_CHART") {
    return {
      groupLabel: "",
      menus: [
        createMenu("/organizational-tree", "Organizational Chart", Network),
      ],
    };
  }

  if (moduleName === "PAYROLL_GLOBAL") {
    return {
      groupLabel: "",
      menus: [
        createMenu("/payroll/global", "Payroll Global", Globe, [
          createMenu("/payroll/global", "Dashboard"),
          createMenu("/payroll/setup-configuration", "Payroll Setup & Configuration", Settings, [
            createMenu("/payroll/settings/policies", "Payroll Policies"),
            createMenu("/payroll/settings/country-currency", "Country & Currency"),
            createMenu("/payroll/settings/statutory-rules", "Statutory Rules"),
            createMenu("/payroll/settings/earnings-deductions", "Earnings & Deductions"),
            createMenu("/payroll/settings/cost-centers", "Cost Centers Mapping"),
            createMenu("/payroll/settings/holiday-calendar", "Holiday Calendar"),
          ]),
          createMenu("/payroll/employee-data-integration", "Employee Data Integration", Users, [
            createMenu("/payroll/integration/master-sync", "Employee Master Sync"),
            createMenu("/payroll/integration/salary-components", "Salary Components Fetch"),
            createMenu("/payroll/integration/attendance-links", "Attendance & Leave Links"),
            createMenu("/payroll/integration/employee-types", "Employee Type Support"),
            createMenu("/payroll/integration/bulk-upload", "Bulk Upload & Mapping"),
          ]),
          createMenu("/payroll/earnings-deductions", "Earnings & Deductions", TrendingUp, [
            createMenu("/payroll/earnings/earning-heads", "Earning Heads"),
            createMenu("/payroll/earnings/deduction-heads", "Deduction Heads"),
            createMenu("/payroll/earnings/custom-rules", "Custom Rules"),
            createMenu("/payroll/earnings/overtime-calculation", "Overtime Calculation"),
            createMenu("/payroll/earnings/statutory-contributions", "Statutory Contributions"),
            createMenu("/payroll/earnings/one-time-payments", "One-Time Payments"),
          ]),
          createMenu("/payroll/run-processing", "Payroll Run & Processing", PlayCircle, [
            createMenu("/payroll/run/processing-wizard", "Processing Wizard"),
            createMenu("/payroll/run/period-selection", "Period Selection"),
            createMenu("/payroll/run/computation", "Payroll Computation"),
            createMenu("/payroll/run/employee-inclusion", "Employee Inclusion"),
            createMenu("/payroll/run/workflow", "Review & Approval"),
            createMenu("/payroll/run/validation", "Error Validation"),
            createMenu("/payroll/run/preview", "Preview & Finalize"),
          ]),
          createMenu("/payroll/tax-compliance", "Tax, PF & Statutory Compliance", Shield, [
            createMenu("/payroll/compliance/tax-calculation", "Tax Calculation"),
            createMenu("/payroll/compliance/pf-social-security", "PF & Social Security"),
            createMenu("/payroll/compliance/gratuity", "EOS & Gratuity"),
            createMenu("/payroll/compliance/contribution-breakdown", "Contribution Breakdown"),
            createMenu("/payroll/compliance/tax-tables", "Tax Tables Update"),
            createMenu("/payroll/compliance/government-reporting", "Government Reporting"),
          ]),
          createMenu("/payroll/multi-currency", "Multi-Currency & Multi-Country", Coins, [
            createMenu("/payroll/currency/exchange-rates", "Exchange Rate Conversion"),
            createMenu("/payroll/currency/currency-display", "Currency Display"),
            createMenu("/payroll/currency/country-rules", "Country Rules"),
            createMenu("/payroll/currency/ledger-mapping", "Ledger Mapping"),
            createMenu("/payroll/currency/consolidated-dashboard", "Consolidated Dashboard"),
          ]),
          createMenu("/payroll/wps-payment", "WPS & Payment Processing", CreditCard, [
            createMenu("/payroll/wps/uae-sif-generation", "UAE WPS SIF Generation"),
            createMenu("/payroll/wps/uk-bank-formats", "UK Bank Transfer Formats"),
            createMenu("/payroll/wps/africa-bank-formats", "Africa Bank Formats"),
            createMenu("/payroll/wps/payment-batch-approvals", "Payment Batch Approvals"),
            createMenu("/payroll/wps/payroll-alerts", "Payroll Alerts"),
            createMenu("/payroll/wps/bank-api-integration", "Bank API Integration"),
          ]),
          createMenu("/payroll/payslip-self-service", "Payslip & Employee Self Service", FileText, [
            createMenu("/payroll/payslip/auto-generated", "Auto-Generated Payslips"),
            createMenu("/payroll/payslip/pdf-download", "PDF Payslips"),
            createMenu("/payroll/payslip/employee-portal", "Employee Portal Access"),
            createMenu("/payroll/payslip/payroll-history", "Payroll History"),
            createMenu("/payroll/payslip/year-end-statements", "Year-End Statements"),
          ]),
          createMenu("/payroll/adjustments-corrections", "Adjustments & Corrections", Edit3, [
            createMenu("/payroll/adjustments/manual-override", "Manual Override"),
            createMenu("/payroll/adjustments/retroactive-corrections", "Retroactive Corrections"),
            createMenu("/payroll/adjustments/off-cycle-payroll", "Off-Cycle Payroll"),
            createMenu("/payroll/adjustments/leave-adjustments", "Leave Adjustments"),
            createMenu("/payroll/adjustments/loans-advances", "Loans & Advances"),
          ]),
          createMenu("/payroll/ai-automation", "AI & Automation Features", Bot, [
            createMenu("/payroll/ai/anomaly-detection", "Anomaly Detection"),
            createMenu("/payroll/ai/salary-forecast", "Salary Forecast"),
            createMenu("/payroll/ai/compliance-detection", "Compliance Detection"),
            createMenu("/payroll/ai/smart-reminders", "Smart Reminders"),
            createMenu("/payroll/ai/chatbot", "AI Chatbot"),
          ]),
          createMenu("/payroll/reporting-analytics", "Reporting & Analytics", BarChart3, [
            createMenu("/payroll/reports/payroll-summary", "Payroll Summary"),
            createMenu("/payroll/reports/cost-center-analysis", "Cost Center Analysis"),
            createMenu("/payroll/reports/statutory-reports", "Statutory Reports"),
            createMenu("/payroll/reports/forecast-reports", "Forecast Reports"),
            createMenu("/payroll/reports/export-tools", "Export Tools"),
            createMenu("/payroll/reports/bi-integration", "BI Integration"),
          ]),
          createMenu("/payroll/security-access", "Security & Access Control", Lock, [
            createMenu("/payroll/security/role-based-access", "Role-Based Access"),
            createMenu("/payroll/security/audit-trail", "Audit Trail"),
            createMenu("/payroll/security/change-history", "Change History"),
            createMenu("/payroll/security/compliance-checks", "Compliance Checks"),
            createMenu("/payroll/security/data-encryption", "Data Encryption"),
          ]),
          createMenu("/payroll/integration-points", "Integration Points", Link, [
            createMenu("/payroll/integration/attendance-shift", "Attendance & Shift Management"),
            createMenu("/payroll/integration/leave-timeoff", "Leave & Time-off Module"),
            createMenu("/payroll/integration/loan-reimbursement", "Loan & Reimbursement Module"),
            createMenu("/payroll/integration/general-ledger", "General Ledger / ERP Systems"),
            createMenu("/payroll/integration/bank-payment", "Bank & Payment APIs"),
            createMenu("/payroll/integration/tax-wps", "Tax Authority / WPS Portals"),
          ]),
        ]),
      ],
    };
  }

  // For regular modules, check permission tree
  const currentNodeTree = getNodeExistInTree(
    moduleTree,
    moduleName,
    "code_name"
  );
  if (!currentNodeTree) return null;

  const route = findRouteByCodeName(moduleName);

  return {
    groupLabel: "",
    menus: [
      createMenu(
        route?.path || "#",
        currentNodeTree.name,
        icon,
        getSubModuleMenuList(currentNodeTree)
      ),
    ],
  };
};

// Main function to retrieve the menu list
export function getMenuList(pathname, userRole) {
  const moduleTree = { code_name: "ORG", childrens: userRole };
  // Define common menus
  const commonMenus = [
    { groupLabel: "", menus: [createMenu("/", "Dashboard", House)] },
  ];
  // Dynamically generate menu items based on configuration flags
  const configMenus = [
    ["SELF_SERVICE_HUB", UserRoundCheck],
    ["TEAM_MANAGEMENT", Users],
    ["PEOPLE_TEAM", Users],
    ["ATTENDANCE", CalendarClockIcon],
    ["LEAVE_MANAGEMENT", CalendarRange],
    ["PAYROLL", BadgeDollarSign],
    ["PAYROLL_GLOBAL", Globe],
    ["TASK_MANAGEMENT", ListTodo],
    ["TALENT_SPHERE", UserRoundSearch],
    ["ASSET_MANAGEMENT", Laptop],
    ["PERFORMANCE_EDGE", Award],
    ["ORGANIZATIONAL_CHART", Network],
    ["PERSONAL_DEVELOPMENT", UsersRound],
    ["PEOPLE_ENGAGEMENT", Crosshair],
    ["REPORTS", GalleryHorizontalEnd],
    ["OFFICE_SETTING", Settings],
  ]
    .map(
      ([name, icon]) => {
        // All menus now go through generateMenuItems which handles special cases
        return Config[name] && generateMenuItems(name, icon, moduleTree);
      }
    )
    .filter(Boolean);

  return [...commonMenus, ...configMenus];
}

export default getMenuList;
