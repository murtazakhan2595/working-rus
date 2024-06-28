// Header.js
import React from "react";
import { FilterInput } from "components/form-control";

const Header = ({ title, content }) => {
    const handleFilterChange = (filterName, filterValue) => {
        // setFilterData((prevFilters) => {
        //   //  debugger
        //   const updatedFilters = { ...prevFilters };
        //   if (!filterValue) {
        //     delete updatedFilters[filterName];
        //   } else {
        //     updatedFilters[filterName] = filterValue;
        //   }
        //   return updatedFilters;
        // });
      };
  return (
    <>
      <div className="py-4 px-4 d-flex justify-content-between">
        <div className="">
          <h4 className="fw-700">{title}</h4>
        </div>
        <div className="">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search",
                name: "id_and_Job_Title",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
