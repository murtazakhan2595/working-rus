import React from "react";
import { CheckBoxInput } from "./form-control";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/@/components/ui/popover";
import { Card } from "components/ui/card";
const SortingFilters = ({
  lists,
  onChange,
  filterButton,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {filterButton}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Card className="border-0 shadow-none">
          <div className="p-4 space-y-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto scroll-smooth">
              {lists?.map((list, index) => (
                <div key={index} className="border-b pb-2 ">
                  <div className="font-medium text-zinc-800">{list.title}</div>
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
                </div>
              ))}
            </div>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default SortingFilters;
