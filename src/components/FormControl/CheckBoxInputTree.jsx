import React, { useState, useEffect, useMemo } from "react";
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
    error,
    onChange = () => {},
    touch,
    required = false,
    label,
    disabled,
    className,
    options,
    searchFeature = false,
    treeLevels = 2,
    treeLevelsName = {},
    value = [],
  }) => {
    const [searchQuery, setSearchQuery] = useState(null);
    const selectedLeafIds = React.useMemo(
      () => (value && Array.isArray(value) ? value : []),
      [value]
    );
    // console.log(selectedLeafIds, value, "Selected LEave Ids");

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;

      const query = searchQuery.toLowerCase();

      const filterNodeRecursively = (node, currentTreeLevel) => {
        const nodeName = node.name?.toLowerCase() || "";
        const nextLevelKey = treeLevelsName[`level_${currentTreeLevel}`];
        const childNodes = node[nextLevelKey];
        let matchingChildren = [];

        if (Array.isArray(childNodes)) {
          matchingChildren = childNodes
            .map((child) => filterNodeRecursively(child, currentTreeLevel + 1))
            .filter(Boolean);
        }

        const isMatchingNode = nodeName.includes(query);

        if (isMatchingNode || matchingChildren.length > 0) {
          return { ...node, [nextLevelKey]: matchingChildren };
        }

        return null;
      };

      return options
        ?.map((node) => filterNodeRecursively(node, 1))
        .filter(Boolean);
    }, [options, searchQuery, treeLevelsName]);

    // Recursive function to collect all leaf IDs from a node
    const getAllLeafIds = (node, level) => {
      const nextLevelKey = treeLevelsName[`level_${level + 1}`];
      const children = node[nextLevelKey];
      if (!children || children.length === 0) return [node.id];

      return children.flatMap((child) => getAllLeafIds(child, level + 1));
    };

    // onChange Handler
    const handleCheckChange = (node, isChecked, currentTreeLevel) => {
      const leafIds = getAllLeafIds(node, currentTreeLevel);
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
                placeholder="Search Module"
                value={searchQuery}
                onChange={(_, value) => setSearchQuery(value)}
              />
            )}
          </div>
          <RenderTreeLevel
            treeNodes={filteredOptions}
            className="grid grid-cols-1"
            currentTreeLevel={0}
            treeLevelsName={treeLevelsName}
            treeLevels={treeLevels}
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
  currentTreeLevel = 0,
  treeLevelsName = {},
  treeLevels = 0,
  onCheckChange = () => {},
  selectedLeafIds = [],
}) => {
  if (!treeLevels || currentTreeLevel >= treeLevels) return null;
  const nextLevelKey = treeLevelsName[`level_${currentTreeLevel + 1}`];

  const RenderNode = ({ node, selected }) => {
    const { name, id, code_name, description } = node;
    return (
      <CheckBoxInput
        name={code_name}
        label={name}
        description={description}
        value={selected}
        onChange={(_, checked) => {
          onCheckChange(node, checked, currentTreeLevel);
        }}
        className="w-fit mr-3"
      />
    );
  };

  return (
    <Accordion type="multiple" className={className}>
      {treeNodes.map((node) => {
        const { name, id, code_name } = node;
        const children = node[nextLevelKey];

        if (code_name === "DASHBOARD") return null;

        return children && children.length > 0 ? (
          <AccordionItem key={id} value={code_name} className="mb-3">
            <AccordionTrigger className="justify-start rounded-t-sm py-1 px-4 h-fit text-left">
              <RenderNode node={node} />
            </AccordionTrigger>
            <AccordionContent className="pl-5 ml-3 mt-3">
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
                onCheckChange={onCheckChange}
                selectedLeafIds={selectedLeafIds}
              />
            </AccordionContent>
          </AccordionItem>
        ) : (
          <div key={id} className="pl-5 ml-3 mt-3">
            <RenderNode node={node} selected={selectedLeafIds.includes(id)} />
          </div>
        );
      })}
    </Accordion>
  );
};

export default CheckBoxInputTree;
