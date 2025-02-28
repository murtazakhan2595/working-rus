import React, { useEffect, useState } from "react";
import { PageLoader } from "components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";

// Define role IDs as constants
const ROLE_SUPERADMIN = 1;
const ROLE_MANAGER = 2;
const ROLE_HR = 3;
const ROLE_EMPLOYEE = 4;

const OrganizationalChart = ({
  userRole = ROLE_EMPLOYEE,
  currentUserId = null,
  initialData = null,
}) => {
  const [direction, setDirection] = useState("top-to-bottom");
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default organization data in case no data is provided
  const defaultOrgData = {
    id: "ms",
    data: {
      imageURL: "https://i.pravatar.cc/300?img=68",
      name: "Margret Swanson",
      role: "CEO",
      roleId: ROLE_SUPERADMIN,
    },
    options: {
      nodeBorderColor: "#953EA3",
    },
    children: [
      {
        id: "mh",
        data: {
          imageURL: "https://i.pravatar.cc/300?img=69",
          name: "Mark Hudson",
          role: "CTO",
          roleId: ROLE_MANAGER,
          managerId: "ms",
        },
        options: {
          nodeBorderColor: "#953EA3",
        },
        children: [
          {
            id: "kb",
            data: {
              imageURL: "https://i.pravatar.cc/300?img=65",
              name: "Karyn Borbas",
              role: "Product Manager",
              roleId: ROLE_EMPLOYEE,
              managerId: "mh",
            },
            options: {
              nodeBorderColor: "#953EA3",
            },
          },
          {
            id: "cr",
            data: {
              imageURL: "https://i.pravatar.cc/300?img=60",
              name: "Chris Rup",
              role: "UX Designer",
              roleId: ROLE_EMPLOYEE,
              managerId: "mh",
            },
            options: {
              nodeBorderColor: "#953EA3",
            },
          },
        ],
      },
      {
        id: "cs",
        data: {
          imageURL: "https://i.pravatar.cc/300?img=59",
          name: "Chris Lysack",
          role: "CFO",
          roleId: ROLE_MANAGER,
          managerId: "ms",
        },
        options: {
          nodeBorderColor: "#953EA3",
        },
        children: [
          {
            id: "nc",
            data: {
              imageURL: "https://i.pravatar.cc/300?img=57",
              name: "Noah Chandler",
              role: "Financial Analyst",
              roleId: ROLE_EMPLOYEE,
              managerId: "cs",
            },
            options: {
              nodeBorderColor: "#953EA3",
            },
          },
          {
            id: "fw",
            data: {
              imageURL: "https://i.pravatar.cc/300?img=52",
              name: "Felix Wagner",
              role: "Accountant",
              roleId: ROLE_EMPLOYEE,
              managerId: "cs",
            },
            options: {
              nodeBorderColor: "#953EA3",
            },
          },
        ],
      },
    ],
  };

  // Define tabs data for the chart directions
  const directionTabsData = [
    { value: "top-to-bottom", label: "Top to Bottom" },
    { value: "bottom-to-top", label: "Bottom to Top" },
    { value: "left-to-right", label: "Left to Right" },
    { value: "right-to-left", label: "Right to Left" },
  ];

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (initialData) {
          setOrganizationData(initialData);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setOrganizationData(defaultOrgData);
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  // Filter data based on user role and ID
  const getFilteredData = (data, role, userId) => {
    if (!data) return null;

    // Clone the data to avoid modifying the original
    const cloneData = (node) => {
      if (!node) return null;
      const clonedNode = { ...node };

      if (node.children) {
        clonedNode.children = node.children.map((child) => cloneData(child));
      }

      return clonedNode;
    };

    const orgData = cloneData(data);

    // SuperAdmin (role 1) sees everything
    if (role === ROLE_SUPERADMIN) {
      return orgData;
    }

    // HR (role 3) sees everything like SuperAdmin
    if (role === ROLE_HR) {
      return orgData;
    }

    // Manager (role 2) sees only their team
    if (role === ROLE_MANAGER) {
      if (!userId) return orgData; // Default to full org if no userId

      // Find the manager's node
      const findManagerNode = (node) => {
        if (node.id === userId) {
          return node;
        }

        if (node.children) {
          for (const child of node.children) {
            const result = findManagerNode(child);
            if (result) return result;
          }
        }

        return null;
      };

      // Find manager's manager to provide context
      const findManagersManager = (node, managerId) => {
        if (node.id === managerId) {
          // Create a simplified view with just this manager and the target manager
          const simplifiedNode = { ...node };
          simplifiedNode.children = node.children.filter(
            (child) => child.id === userId
          );
          return simplifiedNode;
        }

        if (node.children) {
          for (const child of node.children) {
            const result = findManagersManager(child, managerId);
            if (result) return result;
          }
        }

        return null;
      };

      const managerNode = findManagerNode(orgData);
      if (managerNode) {
        // If manager has a manager, include that for context
        if (managerNode.data.managerId) {
          const contextNode = findManagersManager(
            orgData,
            managerNode.data.managerId
          );
          return contextNode || managerNode;
        }
        return managerNode;
      }

      return orgData; // Fallback
    }

    // Employee (role 4) sees only their manager and peers
    if (role === ROLE_EMPLOYEE) {
      if (!userId) return orgData; // Default to full org if no userId

      // Find employee's manager
      const findEmployeeManager = (node) => {
        if (node.children) {
          const hasEmployee = node.children.some(
            (child) => child.id === userId
          );

          if (hasEmployee) {
            // Create a modified version with only the manager and this employee + peers
            const simplifiedNode = { ...node };
            return simplifiedNode;
          }

          for (const child of node.children) {
            const result = findEmployeeManager(child);
            if (result) return result;
          }
        }

        return null;
      };

      const managerNode = findEmployeeManager(orgData);
      return managerNode || orgData; // Fallback to full org
    }

    // Default fallback
    return orgData;
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
            <img
              src={node.data.imageURL}
              alt={node.data.name}
              className="org-node-image"
            />
            <div className="org-node-name">{node.data.name}</div>
            {node.data.role && (
              <div className="org-node-role">{node.data.role}</div>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <>
            {/* Connector stem - vertical line from parent to children */}
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

  // Get filtered data based on role and user ID
  const filteredData = getFilteredData(
    organizationData,
    userRole,
    currentUserId
  );

  // Role label for display
  const getRoleLabel = (roleId) => {
    switch (roleId) {
      case ROLE_SUPERADMIN:
        return "SuperAdmin";
      case ROLE_MANAGER:
        return "Manager";
      case ROLE_HR:
        return "HR";
      case ROLE_EMPLOYEE:
        return "Employee";
      default:
        return "User";
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Organizational Chart</h1>
        <div className="flex justify-between mb-4">
          <Tabs
            value={direction}
            onValueChange={setDirection}
            defaultValue="top-to-bottom"
          >
            <div className="flex flex-col lg:flex-row md:flex-row xl:flex-row">
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
            </div>
          </Tabs>
          <div className="text-sm self-center">
            Viewing as:{" "}
            <span className="font-semibold">{getRoleLabel(userRole)}</span>
          </div>
        </div>
      </div>

      <div
        className={`org-chart-container bg-white p-4 rounded-lg shadow ${direction}`}
      >
        {filteredData ? (
          renderOrganizationNode(filteredData)
        ) : (
          <div className="text-center">No organizational data available</div>
        )}
      </div>

      <style jsx>{`
        .org-chart-container {
          width: 100%;
          overflow: auto;
          padding: 20px;
          min-height: 600px;
        }

        /* ===== Top to Bottom Layout ===== */
        .org-chart-container.top-to-bottom .org-node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .org-chart-container.top-to-bottom .children-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .org-chart-container.top-to-bottom .org-node-children {
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          gap: 30px;
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
        }

        .org-chart-container.bottom-to-top .children-container {
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          position: relative;
        }

        .org-chart-container.bottom-to-top .org-node-children {
          display: flex;
          flex-direction: row;
          margin-bottom: 10px;
          gap: 30px;
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
        }

        .org-chart-container.left-to-right .children-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
        }

        .org-chart-container.left-to-right .org-node-children {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          gap: 30px;
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
        }

        .org-chart-container.right-to-left .children-container {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          position: relative;
        }

        .org-chart-container.right-to-left .org-node-children {
          display: flex;
          flex-direction: column;
          margin-right: 10px;
          gap: 30px;
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
          height: 120px;
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

        .org-node-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-bottom: 8px;
          border: 2px solid #f0f0f0;
        }

        .org-node-name {
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .org-node-role {
          color: #666;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default OrganizationalChart;
