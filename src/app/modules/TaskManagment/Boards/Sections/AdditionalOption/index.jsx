import * as React from "react";
import ArchiveTasks from "./ArchiveTasks";
import MembersBoard from "./MembersBoard";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Archive, Link, ShieldX, LogOut,Users } from "lucide-react";
import { useSelector } from "react-redux";

const AdditionalOption = React.memo(
  ({ projectId = null, reloadData = () => {} }) => {
    const [openArchive, setOpenArchive] = React.useState("");
    const [openMembersBoard, setOpenMembersBoard] = React.useState("");
    const [tooltipOpen, setTooltipOpen] = React.useState(false);
    const navigate = useNavigate();
    const userRole = useSelector((state) => state.user.userProfile)?.role;

    const handleCopyBoardLinkClick = (e) => {
      e.preventDefault();
      console.log(window.location.href);
      const Url = window.location.href;
      navigator.clipboard
        .writeText(Url)
        .then(() => {
          setTooltipOpen(true);
          setTimeout(() => setTooltipOpen(false), 2000);
        })
        .catch((err) => console.error("Failed to copy:", err));
    };
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
      navigate(-1);
    };
    const handleCloseProjectClick = (e) => {
      e.preventDefault();
      setOpenArchive(true);
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
            <DropdownMenuItem onClick={handleCopyBoardLinkClick}>
              <TooltipProvider>
                <Tooltip open={tooltipOpen}>
                  <TooltipTrigger asChild>
                    <span className="flex">
                      <Link size={14} className="mr-2" />
                      Copy Board Link
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchiveCardsClick}>
              <Archive size={14} className="mr-2" /> Archive Cards
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMembersClick}>
              <Users  size={14} className="mr-2" /> Members
            </DropdownMenuItem>
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
            onClose={setOpenArchive}
            isOpen={openArchive}
            projectId={projectId}
            reloadData={reloadData}
          />
        )}
        {openMembersBoard && (
          <MembersBoard
            onClose={setOpenMembersBoard}
            isOpen={openMembersBoard}
            projectId={projectId}
            reloadData={reloadData}
          />
        )}
      </>
    );
  }
);
export default AdditionalOption;
