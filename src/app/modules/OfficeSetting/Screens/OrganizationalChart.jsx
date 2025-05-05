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
  const [viewMode, setViewMode] = useState("organization");
  const [expandedNodes, setExpandedNodes] = useState({});
  const userProfile = useSelector((state) => state.user.userProfile);

  const viewModeTabsData = [
    { value: "organization", label: "Organization Tree" },
    { value: "reporting", label: "My Reporting Line" },
  ];

  const transformApiData = (apiNode, managerId = null) => {
    const getDepartmentColor = (department) => {
      return "#9C27B0";
    };

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

  const convertHierarchyToApiFormat = (employeeData, hierarchyData) => {
    const getNameParts = (fullName) => {
      if (!fullName) return { first_name: "", last_name: "" };
      const parts = fullName.split(" ");
      if (parts.length === 1) return { first_name: parts[0], last_name: "" };
      const lastName = parts[parts.length - 1];
      const firstName = parts.slice(0, parts.length - 1).join(" ");
      return { first_name: firstName, last_name: lastName };
    };

    const createPersonNode = (personData) => {
      if (!personData) return null;
      const { first_name, last_name } = getNameParts(personData.name);
      return {
        id: personData.id.toString(),
        first_name,
        last_name,
        profile_picture: personData.profile_picture,
        designation_name: personData.designation,
        department_name: "",
      };
    };

    const processDirectReports = (reports) => {
      if (!reports || !reports.length) return [];

      return reports.map((report) => {
        const node = createPersonNode(report);
        if (report.direct_reports && report.direct_reports.length > 0) {
          node.subordinates = processDirectReports(report.direct_reports);
        } else {
          node.subordinates = [];
        }
        return node;
      });
    };

    const processTeamMembers = (members, currentEmployeeId) => {
      if (!members || !members.length) return [];

      return members
        .filter(
          (member) => member.id.toString() !== currentEmployeeId.toString()
        )
        .map((member) => {
          const node = createPersonNode(member);
          node.subordinates = [];
          return node;
        });
    };

    const employeeNode = createPersonNode(employeeData);

    if (!hierarchyData.manager) {
      employeeNode.subordinates = processDirectReports(
        hierarchyData.direct_reports || []
      );
      return employeeNode;
    } else {
      const managerNode = createPersonNode(hierarchyData.manager);
      managerNode.subordinates = [];

      const teamMemberNodes = processTeamMembers(
        hierarchyData.team_members,
        employeeData.id
      );

      const allSubordinates = [
        {
          ...employeeNode,
          subordinates: processDirectReports(
            hierarchyData.direct_reports || []
          ),
        },
        ...teamMemberNodes,
      ];

      managerNode.subordinates = allSubordinates;

      return managerNode;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewMode === "organization") {
          if (initialData) {
            const transformedData = transformApiData(initialData.results[0]);
            setOrganizationData(transformedData);

            if (transformedData) {
              setExpandedNodes({ [transformedData.id]: true });
            }
          } else {
            const organizationTree = await getOrganizationTree();
            console.log(organizationTree, "organizationTree");

            if (
              organizationTree &&
              organizationTree.results &&
              organizationTree.results.length > 0
            ) {
              const transformedData = transformApiData(
                organizationTree.results[0]
              );
              setOrganizationData(transformedData);

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
          const reportingLineData = await getEmployeeReportingLine(
            userProfile.id
          );
          console.log("Reporting line data:", reportingLineData);

          if (reportingLineData && reportingLineData.employee_data) {
            const convertedData = convertHierarchyToApiFormat(
              reportingLineData.employee_data,
              reportingLineData.hierarchy
            );

            const transformedData = transformApiData(convertedData);
            setOrganizationData(transformedData);

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

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
    setExpandedNodes({});
  };

  const toggleNodeExpansion = (nodeId, e, parentId = null) => {
    e.stopPropagation();

    setExpandedNodes((prev) => {
      const newExpandedNodes = { ...prev };

      if (!prev[nodeId]) {
        if (parentId) {
          const closeNodesWithSameParent = (nodes, targetParentId) => {
            if (!nodes) return;

            nodes.forEach((node) => {
              if (
                node.data?.managerId === targetParentId &&
                node.id !== nodeId
              ) {
                delete newExpandedNodes[node.id];

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

          const findParentAndCloseSiblings = (nodes) => {
            if (!nodes) return;

            for (const node of nodes) {
              if (node.id === parentId) {
                closeNodesWithSameParent(node.children, parentId);
                return true;
              }

              if (node.children && findParentAndCloseSiblings(node.children)) {
                return true;
              }
            }

            return false;
          };

          if (organizationData) {
            findParentAndCloseSiblings([organizationData]);
          }
        }
      }

      newExpandedNodes[nodeId] = !prev[nodeId];
      return newExpandedNodes;
    });
  };

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

        {node.children && node.children.length > 0 && isExpanded && (
          <>
            <div className="connector-stem"></div>

            <div className="children-container">
              {node.children.length > 1 && (
                <div className="connector-horizontal"></div>
              )}

              <div className="org-node-children">
                {node.children.map((child) => (
                  <div key={child.id} className="child-wrapper">
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

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2">Organizational Chart</h1>
        <div className="flex justify-start gap-4 mb-4">
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
