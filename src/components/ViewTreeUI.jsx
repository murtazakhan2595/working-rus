import React, { useState } from "react";
import { TextInput } from "components/FormControl";

import { ChevronDown, ChevronRight } from "lucide-react"; // or any icon lib

const ViewTreeUI = React.memo(({ searchFeature = false, list = [] }) => {
  const [searchQuery, setSearchQuery] = useState(null);

  const FilteredTree = React.useMemo(() => {
    if (!searchQuery) return list;

    const query = searchQuery.toLowerCase();

    const filterTree = (node) => {
      const nodeName = node.name?.toLowerCase() || "";
      const children = node.childrens || [];

      // Recursively filter children
      const matchingChildren = children
        .map((child) => filterTree(child))
        .filter(Boolean);

      const isMatch = nodeName.includes(query);

      if (isMatch) {
        // Parent matches → keep full children as-is
        return {
          ...node,
          childrens: children,
        };
      } else if (matchingChildren.length > 0) {
        // Children matched → keep only matching children
        return {
          ...node,
          childrens: matchingChildren,
        };
      }

      return null;
    };

    return list.map(filterTree).filter(Boolean);
  }, [list, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-56">
        {searchFeature && (
          <TextInput
            name="search"
            placeholder="Search module by name"
            value={searchQuery}
            onChange={(_, value) => setSearchQuery(value)}
          />
        )}
      </div>
      <RenderTreeLevel treeNodes={FilteredTree} className="grid grid-cols-1" />
    </div>
  );
});

const RenderTreeLevel = ({ treeNodes = [], className = "" }) => {
  if (!treeNodes || (Array.isArray(treeNodes) && treeNodes.length === 0))
    return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {treeNodes.map((node) => (
        <TreeNodeItem key={node.id} node={node} fullTree={treeNodes} />
      ))}
    </div>
  );
};

const TreeNodeItem = ({ node }) => {
  const [open, setOpen] = useState(false);
  const { childrens, id, code_name, name, description } = node;
  const hasChildren = Boolean(childrens && childrens.length > 0);

  if (code_name === "DASHBOARD") return null;
  return (
    <div className="p-1">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {hasChildren && (
          <div className="mr-2">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
        <div>
          <div>{name}</div>
          <div>{description}</div>
        </div>
      </div>

      {open && hasChildren && (
        <div className={`pl-5 ml-3 mt-1 `}>
          <RenderTreeLevel treeNodes={childrens} />
        </div>
      )}
    </div>
  );
};

export default ViewTreeUI;
