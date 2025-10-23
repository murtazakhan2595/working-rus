import { EmployeeOverview } from 'components';
import Avatar from 'components/ui/avatar'
import React from 'react'
import { DesignationName } from 'utils/getValuesFromTables'
import { getRandomColor } from 'utils/renderValues'

const Listview = ({ teamMemeber, handleSelect,activeMember }) => {
  return (
    <div
      className={`flex flex-row items-center justify-start gap-4 py-2 border-b-2  hover:bg-plum-500 hover:text-plum-900 cursor-pointer ${
        activeMember === teamMemeber.id ? "bg-plum-300 text-plum-1100 " : ""
      }`}
      onClick={() => {
        handleSelect(teamMemeber.id);
      }}
    >
      <EmployeeOverview
        id={teamMemeber.id}
        showPosition={true}
        showDepartment={true}
        showBranchName={true}
      />
    </div>
  );
};

export default Listview
