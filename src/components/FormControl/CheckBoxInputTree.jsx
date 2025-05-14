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

    const handleCheckboxChange = (id, isChecked) => {
      const newSelectedItems = new Set(selectedItems);

      if (isChecked) {
        newSelectedItems.add(id);
      } else {
        newSelectedItems.delete(id);
      }

      setSelectedItems(newSelectedItems);

      // Convert Set to Array and pass to parent form
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
}) => {
  if (!treeLevels || currentTreeLevel >= treeLevels) return null;
  const nextLevelKey = treeLevelsName[`level_${currentTreeLevel + 1}`];

  const RenderNode = ({ name, label, id, code_name, description }) => {
    return (
      <CheckBoxInput
        name={name}
        label={label}
        value={selectedItems.has(id)}
        onChange={() => {
          onCheckboxChange(id, !selectedItems.has(id));
        }}
        className="w-fit mr-3"
        description={description}
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
                <RenderNode
                  name={code_name}
                  label={name}
                  id={id}
                  code_name={code_name}
                />
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
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        else
          return (
            <div key={id} className="pl-5 ml-3 mt-3">
              <RenderNode
                name={code_name}
                label={name}
                id={id}
                code_name={code_name}
                onChange={() => {}}
                description={description}
              />
            </div>
          );
      })}
    </Accordion>
  );
};

export default CheckBoxInputTree;
