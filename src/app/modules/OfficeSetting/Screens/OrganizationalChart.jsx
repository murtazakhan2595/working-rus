import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PageLoader } from "components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import {
  getOrganizationTree,
  getEmployeeReportingLine,
} from "app/hooks/officeSetting";
import Avatar from "components/ui/Avatar";

const OrganizationalChart = ({ initialData = null }) => {
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("organization"); // 'organization' or 'reporting'
  const [expandedNodes, setExpandedNodes] = useState({}); // Track expanded nodes
  const userProfile = useSelector((state) => state.user.userProfile);

  // Define view mode tabs
  const viewModeTabsData = [
    { value: "organization", label: "Organization Tree" },
    { value: "reporting", label: "My Reporting Line" },
  ];

  // Helper function to transform API data to chart format for the full organization tree
  const transformApiData = (apiNode, managerId = null) => {
    // Generate a node border color based on department
    const getDepartmentColor = (department) => {
      return "#9C27B0";
    };

    // Generate initials for avatar fallback
    const getInitials = (firstName, lastName) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    return {
      id: apiNode.id.toString(),
      data: {
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
  // Enhanced function to transform reporting line API data to chart format including team members
  const transformReportingLineData = (reportingData) => {
    if (!reportingData) return null;

    // Generate initials for avatar fallback
    const getInitials = (firstName, lastName) => {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    };

    // First, let's create a flattened array of the reporting chain (from employee up to CEO)
    const reportingChain = [];
    let currentPerson = reportingData;

    // Create a map to store team member information by their manager's ID
    const teamMembersByManager = {};

    // If the current person has team members, store them by direct report ID
    if (currentPerson.team_members && currentPerson.team_members.length > 0) {
      currentPerson.team_members.forEach((member) => {
        const directReportId = member.direct_report;
        if (directReportId) {
          if (!teamMembersByManager[directReportId]) {
            teamMembersByManager[directReportId] = [];
          }
          teamMembersByManager[directReportId].push(member);
        }
      });
    }

    // Build the reporting chain
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
      const personId = person.id.toString();

      // Create the node for the current person in the reporting chain
      const node = {
        id: personId,
        data: {
          imageURL: person.profile_picture,
          name: `${person.first_name} ${person.last_name}`,
          role: person.designation_name,
          department: "", // Not included in reporting line data
          initials: getInitials(person.first_name, person.last_name),
          // Store the manager ID if not at the top level
          managerId: index > 0 ? reportingChain[index - 1].id.toString() : null,
        },
        children: [],
      };

      // Add the next person in the chain as a child, if there is one
      const childNode = buildReportingTree(index + 1);
      if (childNode) {
        node.children.push(childNode);
      }

      // Add team members who report to this person
      if (teamMembersByManager[personId]) {
        teamMembersByManager[personId].forEach((member) => {
          // Skip if the team member is already in the reporting chain
          if (
            !reportingChain.some(
              (p) => p.id.toString() === member.id.toString()
            )
          ) {
            const teamMemberNode = {
              id: member.id.toString(),
              data: {
                imageURL: member.profile_picture,
                name: `${member.first_name} ${member.last_name}`,
                role: member.designation_name,
                department: "",
                initials: getInitials(member.first_name, member.last_name),
                managerId: personId,
              },
              children: [], // Team members typically don't have children in this view
            };

            node.children.push(teamMemberNode);
          }
        });
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

            // Initialize expanded state for the root node only
            if (transformedData) {
              setExpandedNodes({ [transformedData.id]: true });
            }
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

              // Initialize expanded state for the root node only
              if (transformedData) {
                setExpandedNodes({ [transformedData.id]: true });
              }
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

            // Initialize expanded state for the root node only
            if (transformedData) {
              setExpandedNodes({ [transformedData.id]: true });
            }
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
    setExpandedNodes({}); // Reset expanded nodes when changing view mode
    // Data will be fetched by the useEffect
  };

  const toggleNodeExpansion = (nodeId, e, parentId = null) => {
    e.stopPropagation();

    setExpandedNodes((prev) => {
      const newExpandedNodes = { ...prev };

      // If we're expanding this node (it was previously collapsed)
      if (!prev[nodeId]) {
        // If we have a parent ID, we need to find and close siblings
        if (parentId) {
          // Find all expanded nodes that share the same parent
          // We'll get all node IDs from organizationData
          const closeNodesWithSameParent = (nodes, targetParentId) => {
            if (!nodes) return;

            nodes.forEach((node) => {
              // If this node has the target parent and is currently expanded, close it
              // But don't close the node we're trying to expand
              if (
                node.data?.managerId === targetParentId &&
                node.id !== nodeId
              ) {
                delete newExpandedNodes[node.id];

                // Also close any children of this node that might be expanded
                const closeChildrenRecursively = (childNodes) => {
                  if (!childNodes) return;
                  childNodes.forEach((child) => {
                    delete newExpandedNodes[child.id];
                    closeChildrenRecursively(child.children);
                  });
                };

                closeChildrenRecursively(node.children);
              }
            });
          };

          // Find the parent node in the tree and close its children except the one being expanded
          const findParentAndCloseSiblings = (nodes) => {
            if (!nodes) return;

            for (const node of nodes) {
              if (node.id === parentId) {
                closeNodesWithSameParent(node.children, parentId);
                return true;
              }

              // Recursively search deeper in the tree
              if (node.children && findParentAndCloseSiblings(node.children)) {
                return true;
              }
            }

            return false;
          };

          // Start the search from the root of the tree
          if (organizationData) {
            findParentAndCloseSiblings([organizationData]);
          }
        }
      }

      // Toggle the current node
      newExpandedNodes[nodeId] = !prev[nodeId];
      return newExpandedNodes;
    });
  };

  // Modified renderOrganizationNode function to pass parent ID
  const renderOrganizationNode = (node) => {
    if (!node) return null;

    const isExpanded = !!expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="org-node-container">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <div
                  className="cursor-pointer"
                  onClick={(e) =>
                    hasChildren &&
                    toggleNodeExpansion(node.id, e, node.data.managerId)
                  }
                >
                  <Avatar
                    src={node.data.imageURL || ""}
                    fallbackText={node.data.initials || ""}
                    alt={node.data.name}
                  />

                  {/* Expand/collapse indicator for nodes with children */}
                  {hasChildren && (
                    <div
                      className="expand-toggle"
                      onClick={(e) =>
                        toggleNodeExpansion(node.id, e, node.data.managerId)
                      }
                    >
                      {isExpanded ? "−" : "+"}
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50">
              <div className="text-center p-2">
                <p className="font-bold text-sm">{node.data.name}</p>
                {node.data.role && (
                  <p className="text-xs text-foreground">{node.data.role}</p>
                )}
                {node.data.department && (
                  <p className="text-xs text-foreground italic">
                    {node.data.department}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Only render children if the node is expanded */}
        {node.children && node.children.length > 0 && isExpanded && (
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
        <h1 className="text-xl font-bold mb-2">Organizational Chart</h1>
        <div className="flex justify-start gap-4 mb-4">
          {/* View Mode Tabs */}
          <div className="flex space-x-2">
            {viewModeTabsData.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleViewModeChange(tab.value)}
                className={`px-3 py-1 text-sm rounded-sm ${
                  viewMode === tab.value
                    ? "bg-primary-200 text-primary-1100 font-medium"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="bg-white p-4 rounded-lg shadow overflow-auto"
        style={{ minHeight: "600px" }}
      >
        <div className="w-full flex items-center justify-center">
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
        .org-node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: fit-content;
        }

        .expand-toggle {
          position: absolute;
          bottom: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .expand-toggle:hover {
          background-color: #e5e7eb;
        }

        .children-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 100%;
        }

        .org-node-children {
          display: flex;
          flex-direction: row;
          /* margin-top: 15px; */
          gap: 25px;
          position: relative;
        }

        .connector-stem {
          width: 1px;
          height: 20px;
          background-color: #d9d9e0;
          margin-top: 5px;
        }

        .connector-horizontal {
          height: 1px;
          background-color: #d9d9e0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
        }

        .child-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .connector-vertical {
          width: 1px;
          height: 15px;
          background-color: #d9d9e0;
        }
      `}</style>
    </div>
  );
};

export default OrganizationalChart;
