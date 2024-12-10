import Avatar from 'components/ui/Avatar'
import React from 'react'
import { DesignationName } from 'utils/getValuesFromTables'
import { getRandomColor } from 'utils/renderValues'

const Listview = ({ teamMemeber, handleSelect }) => {
  return (
    <div
      className="flex flex-row items-center justify-start gap-4 py-2 border-b-2 cursor-pointer"
      onClick={()=>{handleSelect(teamMemeber.id)}}
    >
      <Avatar
        src="/placeholder-user.jpg"
        fallbackText={teamMemeber?.first_name?.charAt(0)?.toUpperCase()}
        alt="Avatar"
        className={`${getRandomColor(
          teamMemeber?.first_name?.charAt(0)
        )} h-12 w-12 text-base`}
      />

      <div className="flex flex-col justify-start gap-1">
        <div className="flex justify-start text-base font-medium text-neutral-1100">
          {`${teamMemeber.first_name} ${teamMemeber.last_name}`}
        </div>
        <div className="flex justify-start text-sm text-muted-foreground md:inline">
          <DesignationName
            className="flex justify-start text-sm text-muted-foreground md:inline"
            value={teamMemeber.department_position}
          />
        </div>
      </div>
    </div>
  );
};

export default Listview
