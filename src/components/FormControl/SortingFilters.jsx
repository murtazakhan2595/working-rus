import React from "react";
import { CheckBoxInput } from ".";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Card } from "components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "src/@/components/ui/accordion";
import { ScrollArea } from "src/@/components/ui/scroll-area";

const SelectedFiltersSummary = ({ lists }) => {
  // Extract selected filter values from each category
  const selectedFilters = lists
    .map((filter) => {
      // Extract selected values from the available options
      const selectedOptions = filter.options.filter((option) =>
        filter.values.includes(option.value)
      );

      // Return only filters that have selected values
      return selectedOptions.length > 0
        ? {
            title: filter.title,
            selected: selectedOptions.map((option) => option.label),
          }
        : null;
    })
    .filter(Boolean); // Remove null values

  return selectedFilters.length ? (
    <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 w-full overflow-x-hidden text-xs">
      {selectedFilters.map((selectedFilter, index) => (
        <div key={index} className="flex flex-row flex-wrap items-center">
          <span className="font-semibold text-neutral-1200">
            {selectedFilter.title}:
          </span>
          <span className="flex ml-1">
            {selectedFilter.selected.map((filter, i) => (
              <span key={i} className="inline-flex gap-x-1">
                {i > 0 && ","} {/* Add comma between selected values */}
                {filter}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  ) : null;
};

const SortingFilters = ({ lists, onChange, filterButton }) => {
  console.log(lists, "lists");
  return (
    <Popover>
      <PopoverTrigger asChild>{filterButton}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-1">
            <ScrollArea className="[&>div>div[style]]:!block">
              <div className="p-3 space-y-3 max-h-[400px]">
                <SelectedFiltersSummary lists={lists} />
                <Accordion type="single" collapsible>
                  {lists?.map((list) => (
                    <AccordionItem value={list.label} className="py-2 border-b">
                      <AccordionTrigger className="bg-white font-medium text-zinc-800 text-sm py-1">
                        {list.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {list.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <CheckBoxInput
                              name={list.label}
                              label={option.label}
                              value={list.values.includes(option.value)}
                              onChange={(field, value) => {
                                onChange(field, option.value, value);
                              }}
                            />
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollArea>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default SortingFilters;
