import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLoader } from "components";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import {
  getOrganizationTree,
  getEmployeeReportingLine,
} from "app/hooks/officeSetting";
import Avatar from "components/ui/Avatar";

const OrganizationalChart = ({ initialData = null }) => {
  const [direction, setDirection] = useState("top-to-bottom");
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("organization"); // 'organization' or 'reporting'
  const userProfile = useSelector((state) => state.user.userProfile);

  // Define tabs data for the chart directions
  const directionTabsData = [
    { value: "top-to-bottom", label: "Top to Bottom" },
    { value: "bottom-to-top", label: "Bottom to Top" },
    { value: "left-to-right", label: "Left to Right" },
    { value: "right-to-left", label: "Right to Left" },
  ];

  // Define view mode tabs
  const viewModeTabsData = [
    { value: "organization", label: "Organization Tree" },
    { value: "reporting", label: "My Reporting Line" },
  ];

  // Helper function to transform API data to chart format for the full organization tree
  const transformApiData = (apiNode, managerId = null) => {
    // Generate a node border color based on department
    const getDepartmentColor = (department) => {
      const colors = {
        Sales: "#4CAF50",
        HR: "#2196F3",
        Development: "#9C27B0",
        "Project Management": "#FF9800",
        Operations: "#F44336",
      };
      return colors[department] || "#953EA3"; // Default purple for unknown departments
    };

    // Generate initials for avatar fallback
    const getInitials = (firstName, lastName) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    return {
      id: apiNode.id.toString(),
      data: {
        // Use the profile picture from the API data
        imageURL: apiNode.profile_picture,
        name: `${apiNode.first_name} ${apiNode.last_name}`,
        role: apiNode.emp_designation || apiNode.designation_name,
        department: apiNode.department_name,
        managerId: managerId,
        initials: getInitials(apiNode.first_name, apiNode.last_name),
      },
      options: {
        nodeBorderColor: getDepartmentColor(apiNode.department_name),
      },
      children: apiNode.subordinates
        ? apiNode.subordinates.map((subordinate) =>
            transformApiData(subordinate, apiNode.id.toString())
          )
        : [],
    };
  };

  // Helper function to transform reporting line API data to chart format
  // Helper function to transform reporting line API data to chart format
  const transformReportingLineData = (reportingData) => {
    if (!reportingData) return null;

    // Generate a node border color based on role level
    const getManagerColor = (designation) => {
      if (designation && designation.toLowerCase().includes("ceo")) {
        return "#4CAF50"; // Green for CEO
      } else if (designation && designation.toLowerCase().includes("manager")) {
        return "#FF9800"; // Orange for managers
      } else {
        return "#2196F3"; // Blue for others
      }
    };

    // Generate initials for avatar fallback
    const getInitials = (firstName, lastName) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    // The reporting line structure is different from the organization tree
    // It contains the current employee at the root, then their manager, and so on up to the CEO

    // First, let's create a flattened array of the reporting chain (from employee up to CEO)
    const reportingChain = [];
    let currentPerson = reportingData;

    while (currentPerson) {
      reportingChain.push({
        id: currentPerson.id.toString(),
        first_name: currentPerson.first_name,
        last_name: currentPerson.last_name,
        designation_name: currentPerson.designation_name,
        profile_picture: currentPerson.profile_picture,
      });
      currentPerson = currentPerson.reporting_manager;
    }

    // Reverse the array to have CEO at the top (index 0)
    reportingChain.reverse();

    // Now construct the tree structure (CEO → Manager → Employee)
    const buildReportingTree = (index) => {
      if (index >= reportingChain.length) return null;

      const person = reportingChain[index];

      const node = {
        id: person.id,
        data: {
          imageURL: person.profile_picture,
          name: `${person.first_name} ${person.last_name}`,
          role: person.designation_name,
          department: "", // Not included in reporting line data
          initials: getInitials(person.first_name, person.last_name),
        },
        options: {
          nodeBorderColor: getManagerColor(person.designation_name),
        },
        children: [],
      };

      // Add the next person in the chain as a child, if there is one
      const childNode = buildReportingTree(index + 1);
      if (childNode) {
        node.children.push(childNode);
      }

      return node;
    };

    // Build the tree starting from the CEO (index 0)
    return buildReportingTree(0);
  };

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewMode === "organization") {
          if (initialData) {
            // If initial data is provided, use it
            const transformedData = transformApiData(initialData.results[0]);
            setOrganizationData(transformedData);
          } else {
            // Otherwise fetch from API
            const organizationTree = await getOrganizationTree();
            console.log(organizationTree, "organizationTree");

            // Transform the first result (assuming structure matches what we expect)
            if (
              organizationTree &&
              organizationTree.results &&
              organizationTree.results.length > 0
            ) {
              const transformedData = transformApiData(
                organizationTree.results[0]
              );
              setOrganizationData(transformedData);
            } else {
              console.error(
                "Invalid organization tree data structure",
                organizationTree
              );
            }
          }
        } else if (viewMode === "reporting" && userProfile && userProfile.id) {
          // Fetch reporting line data for the current user
          const reportingLineData = await getEmployeeReportingLine(
            userProfile.id
          );
          console.log("Reporting line data:", reportingLineData);

          // Transform the reporting line data
          if (reportingLineData) {
            // For the reporting line view, we start with the employee and then show their managers
            // We need to reverse the chain to show the hierarchy from top to bottom
            const transformedData =
              transformReportingLineData(reportingLineData);
            setOrganizationData(transformedData);
          } else {
            console.error(
              "Invalid reporting line data structure",
              reportingLineData
            );
          }
        }
      } catch (error) {
        console.error(`Error fetching ${viewMode} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData, viewMode, userProfile]);

  // Function to handle view mode change
  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    // Data will be fetched by the useEffect
  };

  // Function to render org chart nodes recursively
  const renderOrganizationNode = (node) => {
    if (!node) return null;

    return (
      <div key={node.id} className="org-node-container">
        <div
          className="org-node"
          style={{
            borderColor: node.options.nodeBorderColor,
            borderWidth: "1px",
          }}
        >
          <div className="org-node-content">
            <Avatar
              className="border border-neutral-500 h-10 w-10"
              src={node.data.imageURL || ""}
              fallbackText={node.data.initials || ""}
              text={node.data.name || "Unknown User"}
              alt="Avatar"
            />
            <div className="org-node-name">{node.data.name}</div>
            {node.data.role && (
              <div className="org-node-role">{node.data.role}</div>
            )}
            {node.data.department && (
              <div className="org-node-department">{node.data.department}</div>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <>
            {/* Connector stem from parent to children */}
            <div className="connector-stem"></div>

            {/* Container for children with connector lines */}
            <div className="children-container">
              {/* Horizontal connector line */}
              {node.children.length > 1 && (
                <div className="connector-horizontal"></div>
              )}

              {/* Children nodes */}
              <div className="org-node-children">
                {node.children.map((child) => (
                  <div key={child.id} className="child-wrapper">
                    {/* Vertical connector to child */}
                    <div className="connector-vertical"></div>
                    {renderOrganizationNode(child)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Organizational Chart</h1>
        <div className="flex flex-col lg:flex-row md:flex-row xl:flex-row justify-between gap-4 mb-4">
          {/* View Mode Tabs */}
          <Tabs
            value={viewMode}
            onValueChange={handleViewModeChange}
            defaultValue="organization"
          >
            <TabsList className="flex justify-center mb-4">
              {viewModeTabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary-200 w-36 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Chart Direction Tabs */}
          <Tabs
            value={direction}
            onValueChange={setDirection}
            defaultValue="top-to-bottom"
          >
            <TabsList className="flex justify-center mb-4">
              {directionTabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-lg shadow overflow-auto"
        style={{ minHeight: "600px" }}
      >
        <div className={`org-chart-container ${direction}`}>
          {organizationData ? (
            renderOrganizationNode(organizationData)
          ) : (
            <div className="text-center">
              {viewMode === "organization"
                ? "No organizational data available"
                : "No reporting line data available for this user"}
            </div>
          )}
        </div>
      </div>

      {/* Styling for the organization chart */}
      <style jsx global>{`
        .org-chart-container {
          width: 100%;
          min-width: max-content;
          padding: 20px;
          display: flex;
          justify-content: center;
        }

        /* ===== Top to Bottom Layout ===== */
        .org-chart-container.top-to-bottom .org-node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: max-content;
        }

        .org-chart-container.top-to-bottom .children-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 100%;
        }

        .org-chart-container.top-to-bottom .org-node-children {
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          gap: 60px;
          position: relative;
          z-index: 1;
        }

        .org-chart-container.top-to-bottom .connector-stem {
          width: 1px;
          height: 20px;
          background-color: #d9d9e0;
          margin-top: 3px;
        }

        .org-chart-container.top-to-bottom .connector-horizontal {
          height: 1px;
          background-color: #d9d9e0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
        }

        .org-chart-container.top-to-bottom .child-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .org-chart-container.top-to-bottom .connector-vertical {
          width: 1px;
          height: 20px;
          background-color: #d9d9e0;
        }

        /* ===== Bottom to Top Layout ===== */
        .org-chart-container.bottom-to-top .org-node-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          min-width: max-content;
        }

        .org-chart-container.bottom-to-top .children-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          position: relative;
          width: 100%;
        }

        .org-chart-container.bottom-to-top .org-node-children {
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          gap: 60px;
          position: relative;
          z-index: 1;
        }

        .org-chart-container.bottom-to-top .connector-stem {
          width: 1px;
          height: 20px;
          background-color: #d9d9e0;
          margin-bottom: 3px;
        }

        .org-chart-container.bottom-to-top .connector-horizontal {
          height: 1px;
          background-color: #d9d9e0;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
        }

        .org-chart-container.bottom-to-top .child-wrapper {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
        }

        .org-chart-container.bottom-to-top .connector-vertical {
          width: 1px;
          height: 20px;
          background-color: #d9d9e0;
        }

        /* ===== Left to Right Layout ===== */
        .org-chart-container.left-to-right .org-node-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          min-width: max-content;
        }

        .org-chart-container.left-to-right .children-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
          height: 100%;
        }

        .org-chart-container.left-to-right .org-node-children {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .org-chart-container.left-to-right .connector-stem {
          height: 1px;
          width: 20px;
          background-color: #d9d9e0;
          margin-left: 3px;
        }

        .org-chart-container.left-to-right .connector-horizontal {
          width: 1px;
          background-color: #d9d9e0;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          height: 100%;
        }

        .org-chart-container.left-to-right .child-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .org-chart-container.left-to-right .connector-vertical {
          height: 1px;
          width: 20px;
          background-color: #d9d9e0;
        }

        /* ===== Right to Left Layout ===== */
        .org-chart-container.right-to-left .org-node-container {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          min-width: max-content;
        }

        .org-chart-container.right-to-left .children-container {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          position: relative;
          height: 100%;
        }

        .org-chart-container.right-to-left .org-node-children {
          display: flex;
          flex-direction: column;
          margin-right: 10px;
          gap: 40px;
          position: relative;
          z-index: 1;
        }

        .org-chart-container.right-to-left .connector-stem {
          height: 1px;
          width: 20px;
          background-color: #d9d9e0;
          margin-right: 3px;
        }

        .org-chart-container.right-to-left .connector-horizontal {
          width: 1px;
          background-color: #d9d9e0;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
        }

        .org-chart-container.right-to-left .child-wrapper {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
        }

        .org-chart-container.right-to-left .connector-vertical {
          height: 1px;
          width: 20px;
          background-color: #d9d9e0;
        }

        /* ===== Node Styling ===== */
        .org-node {
          width: 180px;
          height: auto;
          min-height: 120px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 15px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          background-color: white;
          border-style: solid;
        }

        .org-node:hover {
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .org-node-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .org-node-name {
          color: #333;
          font-weight: 600;
          font-size: 14px;
          margin-top: 8px;
        }

        .org-node-role {
          color: #666;
          font-size: 12px;
          margin-top: 4px;
        }

        .org-node-department {
          color: #777;
          font-size: 11px;
          margin-top: 2px;
          font-style: italic;
        }

        .org-node-name,
        .org-node-role,
        .org-node-department {
          width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};

export default OrganizationalChart;
