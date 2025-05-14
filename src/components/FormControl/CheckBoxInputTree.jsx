import React, { useState, useEffect } from "react";
import { Input } from "components/ui/input";
import { FormField, InvalidInput, TextInput } from "components/FormControl";
import { Checkbox } from "src/@/components/ui/checkbox";
import { cn } from "src/@/lib/utils";
import CheckBoxInput from "./CheckBoxInput";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/@/components/ui/accordion";

const CheckBoxInputTree = React.memo(
  ({
    name,
    value = [],
    error,
    onChange = () => {},
    touch,
    required = false,
    label,
    disabled,
    className,
    columns = 1,
    options,
    searchFeature = false,
    treeLevels = 2,
    treeLevelsName = {},
    selectedNodes = [],
  }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItems, setSelectedItems] = useState(new Set(value || []));

    // Update selected items when value prop changes
    useEffect(() => {
      setSelectedItems(new Set(value || []));
    }, [value]);

    // Get all feature IDs from a node and its children
    const getAllFeatureIds = (node, currentLevel = 0) => {
      const featureIds = [];
      const nextLevelKey = treeLevelsName[`level_${currentLevel + 1}`];

      // If this is a feature node (leaf level), return its ID
      if (currentLevel === treeLevels - 1 || !node[nextLevelKey]) {
        return [node.id];
      }

      // Otherwise, get all feature IDs from children
      const children = node[nextLevelKey] || [];
      children.forEach((child) => {
        featureIds.push(...getAllFeatureIds(child, currentLevel + 1));
      });

      return featureIds;
    };

    // Check if all children of a node are selected
    const areAllChildrenSelected = (node, currentLevel = 0) => {
      const childFeatureIds = getAllFeatureIds(node, currentLevel);
      return childFeatureIds.every((id) => selectedItems.has(id));
    };

    // Check if some (but not all) children of a node are selected
    const areSomeChildrenSelected = (node, currentLevel = 0) => {
      const childFeatureIds = getAllFeatureIds(node, currentLevel);
      const selectedCount = childFeatureIds.filter((id) =>
        selectedItems.has(id)
      ).length;
      return selectedCount > 0 && selectedCount < childFeatureIds.length;
    };

    const handleCheckboxChange = (node, isChecked, currentLevel = 0) => {
      const newSelectedItems = new Set(selectedItems);

      // Get all feature IDs that should be affected
      const featureIds = getAllFeatureIds(node, currentLevel);

      if (isChecked) {
        // Add all feature IDs
        featureIds.forEach((id) => newSelectedItems.add(id));
      } else {
        // Remove all feature IDs
        featureIds.forEach((id) => newSelectedItems.delete(id));
      }

      setSelectedItems(newSelectedItems);

      // Convert Set to Array and pass to parent form (only feature IDs)
      const selectedArray = Array.from(newSelectedItems);
      onChange(name, selectedArray);
    };

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;

      const query = searchQuery.toLowerCase();

      // Recursively clone only matching nodes and their parents
      const filterNodeRecursively = (node, currentLevel) => {
        const nodeName = node.name?.toLowerCase() || "";

        const nextLevelKey = treeLevelsName[`level_${currentLevel}`];
        const childNodes = node[nextLevelKey];

        let matchingChildren = [];

        if (Array.isArray(childNodes)) {
          matchingChildren = childNodes
            .map((child) => filterNodeRecursively(child, currentLevel + 1))
            .filter(Boolean); // Remove nulls
        }

        const isMatchingNode = nodeName.includes(query);

        if (isMatchingNode || matchingChildren.length > 0) {
          return {
            ...node,
            [nextLevelKey]: matchingChildren,
          };
        }

        return null;
      };

      return options
        ?.map((node) => filterNodeRecursively(node, 1))
        .filter(Boolean); // Remove nulls
    }, [options, searchQuery, treeLevelsName]);

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
                placeholder="Search Module"
                value={searchQuery}
                onChange={(_, value) => {
                  setSearchQuery(value);
                }}
              />
            )}
          </div>
          <RenderTreeLevel
            treeNodes={filteredOptions}
            className={"grid grid-cols-1"}
            currentTreeLevel={0}
            treeLevelsName={treeLevelsName}
            treeLevels={treeLevels}
            selectedItems={selectedItems}
            onCheckboxChange={handleCheckboxChange}
            areAllChildrenSelected={areAllChildrenSelected}
            areSomeChildrenSelected={areSomeChildrenSelected}
          />
        </div>
      </FormField>
    );
  }
);

const RenderTreeLevel = ({
  treeNodes = [],
  className = "",
  currentTreeLevel = 0,
  treeLevelsName = {},
  treeLevels = 0,
  selectedItems,
  onCheckboxChange,
  areAllChildrenSelected,
  areSomeChildrenSelected,
}) => {
  if (!treeLevels || currentTreeLevel >= treeLevels) return null;
  const nextLevelKey = treeLevelsName[`level_${currentTreeLevel + 1}`];

  const RenderNode = ({ node, currentTreeLevel }) => {
    const isLeafNode =
      currentTreeLevel === treeLevels - 1 || !node[nextLevelKey];
    const isChecked = isLeafNode
      ? selectedItems.has(node.id)
      : areAllChildrenSelected(node, currentTreeLevel);
    const isIndeterminate =
      !isLeafNode && areSomeChildrenSelected(node, currentTreeLevel);

    return (
      <CheckBoxInput
        name={node.code_name}
        label={node.name}
        value={isChecked}
        indeterminate={isIndeterminate}
        onChange={() => {
          onCheckboxChange(node, !isChecked, currentTreeLevel);
        }}
        className="w-fit mr-3"
        description={node.description}
      />
    );
  };

  return (
    <Accordion type="multiple" className={className}>
      {treeNodes.map((node) => {
        const { name, id, code_name, description } = node;
        const children = node[nextLevelKey];

        if (code_name === "DASHBOARD") return null;

        if (children && children.length > 0)
          return (
            <AccordionItem key={id} value={code_name} className="mb-3">
              <AccordionTrigger className="justify-start rounded-t-sm py-1 px-4 h-fit text-left ">
                <RenderNode node={node} currentTreeLevel={currentTreeLevel} />
              </AccordionTrigger>
              <AccordionContent className="pl-5 ml-3 mt-3">
                {children && (
                  <RenderTreeLevel
                    treeNodes={children}
                    currentTreeLevel={currentTreeLevel + 1}
                    treeLevelsName={treeLevelsName}
                    treeLevels={treeLevels}
                    className={
                      currentTreeLevel === treeLevels - 2
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        : ""
                    }
                    selectedItems={selectedItems}
                    onCheckboxChange={onCheckboxChange}
                    areAllChildrenSelected={areAllChildrenSelected}
                    areSomeChildrenSelected={areSomeChildrenSelected}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        else
          return (
            <div key={id} className="pl-5 ml-3 mt-3">
              <RenderNode node={node} currentTreeLevel={currentTreeLevel} />
            </div>
          );
      })}
    </Accordion>
  );
};

export default CheckBoxInputTree;
