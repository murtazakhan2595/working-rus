import React, { useEffect, useMemo, useState } from "react";
import SheetComponent from "components/ui/CustomSheet";
import { Plus, Trash2, Link } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { SelectMultiInputComponent } from "components/FormControl";
import { getProjectById, addProject } from "app/hooks/taskManagment";
import { Button } from "components/ui/button";
import { EmployeeOverview } from "components";
import { fetchProjects } from "state/slices/CommonSlice";
import AlertDialogue from "components/ui/AlertDialogue";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import CopyLink from "components/ui/CopyLink";

const TabsData = [
  { value: "board_members", label: "Board Members" },
  { value: "join_request", label: "Join Request" },
];

const MembersBoard = ({ onClose, isOpen, projectId }) => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.emp.employees);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [membersSelected, setMembersSelected] = useState([]);
  const [joiningRequest, setJoiningRequest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("board_members");

  const Employees = useMemo(() => {
    return employees?.filter(
      (employee) => !projectMembers.includes(employee.value)
    );
  }, [employees, projectMembers]);

  const fetchProject = async (isMounted) => {
    if (projectId) {
      try {
        const projectDetails = await getProjectById(projectId);
        if (isMounted && projectDetails) {
          setProjectMembers(projectDetails?.project_members || []);
          setJoiningRequest(projectDetails?.joining_request || []);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (projectId) {
      fetchProject(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const formSheetData = {
    triggerText: null,
    title: "Share Board",
    description: null,
    footer: null,
  };

  const handleAddRemoveMembers = async (payload) => {
    setIsLoading(true);
    try {
      const response = await addProject(payload, projectId);
      if (response) {
        dispatch(fetchProjects(userProfile));
        fetchProject(true);
        setMembersSelected([]);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    handleAddRemoveMembers({ project_members: membersSelected || [] });
  };

  return (
    <>
      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={onClose}
        width="550px"
        contentClassName="custom-sheet-width"
      >
        <div className="flex flex-col w-full overflow-hidden max-w-full gap-8 pr-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between gap-3">
              <SelectMultiInputComponent
                name="project_members"
                options={Employees}
                showLabel={false}
                value={membersSelected || []}
                onChange={(field, value) => {
                  setMembersSelected(value);
                }}
                placeholder="Add Members"
              />
              <Button
                variant="outline"
                disabled={isLoading && !membersSelected.length ? true : false}
                onClick={handleAddMember}
              >
                Add Memebers
              </Button>
            </div>
            <div className="">
              <div className="flex justify start flex-row w-full max-w-full overflow-hidden items-center text-neutral-1100 gap-3">
                <Link size={16} />
                <div className="flex flex-col gap-1">
                  <p>Anyone with the link can join as a member</p>
                  <div className="flex flex-row text-sm">
                    <CopyLink
                      link={`/project-board/${projectId}`}
                      text={"Copy Link"}
                      linkIcon={' '}
                      textClassName={"text-plum-1100"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="offices"
          >
            <div className="flex justify-start border border-neutral-500 rounded-sm">
              <TabsList className="flex justify-center">
                {TabsData?.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-neutral-1100 data-[state=active]:bg-primary-200 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="board_members">
              <BoardMembers
                members={projectMembers}
                handleAddRemoveMembers={handleAddRemoveMembers}
                joiningRequest={joiningRequest}
              />
            </TabsContent>
            <TabsContent value="join_request">
              <BoardMembers
                members={joiningRequest}
                request={true}
                projectMembers={projectMembers}
                handleAddRemoveMembers={handleAddRemoveMembers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetComponent>
    </>
  );
};

const BoardMembers = React.memo(
  ({
    members = [56, 33, 134],
    request = false,
    handleAddRemoveMembers = () => {},
    projectMembers = [],
    joiningRequest = [],
  }) => {
    const [openAlertDialogue, setOpenAlertDialogue] = useState(false);
    const [memberSelected, setMemberSelected] = useState(null);
    const handleSubmitRemoveMember = () => {
      const updatedMembers = members.filter(
        (member) => member !== memberSelected
      );
      handleAddRemoveMembers({
        project_members: updatedMembers || [],
        joining_request: [...joiningRequest, memberSelected],
      });
      setMemberSelected(null);
    };
    return (
      <div className="mt-4">
        {members && members.length ? (
          members.map((member) => {
            const handleRemoveMember = (e) => {
              setOpenAlertDialogue(true);
              setMemberSelected(member);
            };
            const handleAddMember = (e) => {
              e.preventDefault();
              const updatedMembers = [...projectMembers, member];
              const updatedRemainingMembers = members.filter(
                (obj) => obj !== member
              );
              handleAddRemoveMembers({
                project_members: updatedMembers,
                joining_request: updatedRemainingMembers || [],
              });
            };
            const handleDeclineMember = (e) => {
              e.preventDefault();
              const updatedRemainingMembers = members.filter(
                (obj) => obj !== member
              );
              handleAddRemoveMembers({
                joining_request: updatedRemainingMembers || [],
              });
            };

            return (
              <div
                className="grid grid-cols-5 gap-4 p-3 hover:bg-neutral-100 rounded-sm items-center"
                key={member}
              >
                <div className="col-span-3">
                  <EmployeeOverview
                    showPosition={true}
                    id={member}
                    showEmail={true}
                  />
                </div>
                {!request && <div className=""></div>}
                {!request && (
                  <Button
                    variant="ghost"
                    className="text-red-400"
                    onClick={handleRemoveMember}
                  >
                    Remove
                  </Button>
                )}
                {request && (
                  <Button
                    variant="ghost"
                    className="text-success-400"
                    onClick={handleAddMember}
                  >
                    Accept
                  </Button>
                )}
                {request && (
                  <Button
                    variant="ghost"
                    className="text-red-400"
                    onClick={handleDeclineMember}
                  >
                    Decline
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <div className="w-full flex justify-center text-neutral-1000">{`There are no ${
            request ? "pending joining requests" : "board members added"
          }`}</div>
        )}
        {openAlertDialogue && (
          <AlertDialogue
            isOpen={openAlertDialogue}
            setIsOpen={setOpenAlertDialogue}
            handleContinue={handleSubmitRemoveMember}
            continueText="Remove"
            title="Are you sure you want to remove this member?"
            description="The member will be removed from project, but you can add the member again."
          />
        )}
      </div>
    );
  }
);

export default MembersBoard;
