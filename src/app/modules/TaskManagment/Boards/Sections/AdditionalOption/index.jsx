import * as React from "react";
import ArchiveTasks from "./ArchiveTasks";
import MembersBoard from "./MembersBoard";
import { Button } from "components/ui/button";
import CopyLink from "components/ui/CopyLink";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  Archive,
  Link,
  ShieldX,
  LogOut,
  Users,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addProject } from "app/hooks/taskManagment";
import { fetchProjects } from "state/slices/CommonSlice";

const AdditionalOption = React.memo(
  ({ projectId = null, reloadData = () => {} }) => {
    const [openArchive, setOpenArchive] = React.useState("");
    const [openMembersBoard, setOpenMembersBoard] = React.useState("");
    const navigate = useNavigate();
    const userRole = useSelector((state) => state.user.userProfile)?.role;
    const userProfile = useSelector((state) => state.user.userProfile);
    const dispatch = useDispatch();

    const handleArchiveCardsClick = (e) => {
      e.preventDefault();
      setOpenArchive(true);
    };
    const handleMembersClick = (e) => {
      e.preventDefault();
      setOpenMembersBoard(true);
    };
    const handleLeaveBoardClick = (e) => {
      e.preventDefault();
      navigate("/projects");
    };
    const handleCloseProjectClick = async (e) => {
      e.preventDefault();
      try {
        const response = await addProject({ status: "closed" }, projectId);
        if (response && response.status === 200) {
          dispatch(fetchProjects(userProfile));
          navigate("/projects");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    const handleOnClose = () => {
      setOpenMembersBoard(false);
      setOpenArchive(false);
      reloadData(true);
    };
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="bg-white font-normal">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <CopyLink
                link={`/project-board/${projectId}`}
                text={"Copy Board Link"}
              />
            </DropdownMenuItem>
            {userRole !== 4 && (
              <DropdownMenuItem onClick={handleArchiveCardsClick}>
                <Archive size={14} className="mr-2" /> Archive Cards
              </DropdownMenuItem>
            )}
            {userRole !== 4 && (
              <DropdownMenuItem onClick={handleMembersClick}>
                <Users size={14} className="mr-2" /> Members
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className={`bg-neutral-600`} />
            <DropdownMenuItem onClick={handleLeaveBoardClick}>
              <LogOut size={14} className="mr-2" /> Leave Board
            </DropdownMenuItem>
            {userRole !== 4 && (
              <DropdownMenuItem onClick={handleCloseProjectClick}>
                <ShieldX size={14} className="mr-2" /> Close Project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {openArchive && (
          <ArchiveTasks
            onClose={handleOnClose}
            isOpen={openArchive}
            projectId={projectId}
            reloadData={reloadData}
          />
        )}
        {openMembersBoard && (
          <MembersBoard
            onClose={handleOnClose}
            isOpen={openMembersBoard}
            projectId={projectId}
          />
        )}
      </>
    );
  }
);
export default AdditionalOption;
