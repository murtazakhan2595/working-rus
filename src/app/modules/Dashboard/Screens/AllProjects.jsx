import { MembersList } from "app/modules/TaskManagment/Sections";
import { useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../src/@/components/ui/button";
import { OverviewCard } from "components";

export default function AllProjects() {
  const [showAll, setShowAll] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);
  const AllProjects = useSelector((state) => state.common.projects);

  const Projects = showAll ? AllProjects || [] : AllProjects.slice(0, 6) || [];

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            {userProfile.role === 4 ? "My Projects" : "All Projects"}
          </div>
          <Button variant="ghost" className="">
            <Link to="/projects">View Details</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {Projects.length > 0 ? (
          Projects.map((project) => (
            <RenderProject key={project.id} project={project} />
          ))
        ) : (
          <div>No Projects available.</div>
        )}
        {AllProjects.length > 6 && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setShowAll((prev) => {
                  return !prev;
                });
              }}
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}

const RenderProject = ({ project }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-4">
      <Link to={`/project-board/${project.id}`}>
        <OverviewCard
          className={"text-sm"}
          avatarProps={{
            src: project?.profile_img,
            fallbackText: project?.name.charAt(0).toUpperCase(),
            text: project?.name,
            //  size: avatarSize,
          }}
          title={project?.name}
          additionalInfo={[
            <span>
              Created by <EmployeeName value={project?.created_by} />
            </span>,
          ]}
        />
      </Link>

      <div className="min-w-[101px]">
        <MembersList members={project?.project_members || []} />
      </div>
    </div>
  );
};
