import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput, TextInput } from "components/FormControl";

import CheckBoxInput from "./CheckBoxInput";
import { ChevronDown, ChevronRight } from "lucide-react"; // or any icon lib
import { ChildALLNodesExist, ChildAnyNodeExist } from "utils/renderValues";
const CheckBoxInputTree = React.memo(
  ({
    name,
    error,
    onChange = () => {},
    touch,
    required = false,
    label,
    disabled,
    className,
    options,
    searchFeature = false,
    value = [],
  }) => {
    const [searchQuery, setSearchQuery] = useState(null);
    const selectedLeafIds = React.useMemo(
      () => (value && Array.isArray(value) ? value : []),
      [value]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;

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

      return options.map(filterTree).filter(Boolean);
    }, [options, searchQuery]);

    // Recursive function to collect all leaf IDs from a node
    const getAllLeafIds = (node) => {
      const children = node.childrens;

      if (!Array.isArray(children) || children.length === 0) {
        return [node.id];
      }

      return children.flatMap((child) => getAllLeafIds(child));
    };
    // onChange Handler
    const handleCheckChange = (node, isChecked) => {
      const leafIds = getAllLeafIds(node);
      const previousSelectedLeadIds = selectedLeafIds;
      if (isChecked) {
        const newSet = new Set([...previousSelectedLeadIds, ...leafIds]);
        const updated = [...newSet];
        onChange(name, updated);
        return updated;
      } else {
        const updated = previousSelectedLeadIds.filter(
          (id) => !leafIds.includes(id)
        );
        onChange(name, updated);
        return updated;
      }
    };

    return (
      <FormField
        name={name}
        label={label}
        required={required}
        error={error}
        touched={touch}
        className={className}
        disabled={disabled}
      >
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
          <RenderTreeLevel
            treeNodes={filteredOptions}
            className="grid grid-cols-1"
            onCheckChange={handleCheckChange}
            selectedLeafIds={selectedLeafIds}
          />
        </div>
      </FormField>
    );
  }
);

const RenderTreeLevel = ({
  treeNodes = [],
  className = "",
  onCheckChange = () => {},
  selectedLeafIds = [],
}) => {
  if (!treeNodes || (Array.isArray(treeNodes) && treeNodes.length === 0))
    return null;

  return (
    <div className={`flex flex-col ${className}`}>
      {treeNodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          onCheckChange={onCheckChange}
          selectedLeafIds={selectedLeafIds}
          fullTree={treeNodes}
        />
      ))}
    </div>
  );
};

const TreeNodeItem = ({ node, selectedLeafIds, onCheckChange }) => {
  const [open, setOpen] = useState(false);
  const { childrens, id, code_name, name, description } = node;
  const hasChildren = Boolean(childrens && childrens.length > 0);
  const CheckSelected = React.useMemo(() => {
    return ChildALLNodesExist(node, selectedLeafIds, "id");
  }, [selectedLeafIds, node]);

  if (code_name === "DASHBOARD") return null;
  return (
    <div className="mb-3 p-2">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {hasChildren && (
          <div className="mr-2">
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
        <CheckBoxInput
          name={code_name}
          label={name}
          description={description}
          value={CheckSelected}
          onChange={(_, checked) => {
            onCheckChange(node, checked);
          }}
          className="w-full mr-3"
        />
      </div>

      {open && hasChildren && (
        <div className={`pl-5 pt-3 ml-3 mt-3 border rounded `}>
          <RenderTreeLevel
            treeNodes={childrens}
            onCheckChange={onCheckChange}
            selectedLeafIds={selectedLeafIds}
          />
        </div>
      )}
    </div>
  );
};

export default CheckBoxInputTree;
