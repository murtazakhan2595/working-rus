import { useEffect, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { Formik } from "formik";
import { addProject, deleteProject } from "app/hooks/taskManagment";
import {
  TextInput,
  SelectInputComponent,
  SelectMultiInputComponent,
} from "components/FormControl";
import { Project } from "app/utils/Types/TaskManagment";
import { useDispatch } from "react-redux";
import { fetchProjects } from "state/slices/CommonSlice";
import { TextAreaInput, DateInput, ColorInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { ProjectStatusList } from "data/Data";
import { ImageInput } from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { validationProjectFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { PageLoader } from "components";
import { ScrollArea, ScrollBar } from "src/@/components/ui/scroll-area";
import { DEFAULT_PROJECT_COLOR_OPTIONS } from "app/utils/Types/TaskManagment";
import { EmployeeName, FormatID } from "utils/getValuesFromTables";
import { renderDate } from "utils/renderValues";

const ProjectForm = ({
  employees,
  reload = () => {},
  isEditMode,
  // projectId,
  isOpen = false,
  setIsOpen = () => {},
  editProject = Project,
  userProfile,
}) => {
  const formRef = useRef();
  let dispatch = useDispatch();
  const initialValues = editProject || Project;
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlertDialogue, setOpenAlertDialogue] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);

  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  // useEffect(async () => {
  //   let isMounted = true;
  //   if (projectId && isEditMode) {
  //     const response = await getAttachmentById(isMounted);

  //   }
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [projectId]);

  const handleSubmit = async (payload) => {
    setIsLoading(true);
    try {
      const response = await addProject(
        payload,
        isEditMode ? editProject.id : null
      );
      if (response) {
        if (response.status === 201) {
          toast.success("Project Added!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else if (response.status === 200 && isEditMode) {
          toast.success("Project Updated!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        dispatch(fetchProjects(userProfile));
        reload(true);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProjectClick = (e) => {
    e.preventDefault();
    setOpenAlertDialogue(true);
  };
  const confirmDelete = async () => {
    const response = await deleteProject(editProject.id);
    if (response) {
      reload(true);
      setIsOpen(false);
    }
    setOpenAlertDialogue(false);
  };
  const removeMember = (member) => {
    const members = formRef.current.values.project_members || [];
    const updatedMembers = members.filter((m) => m !== member);
    formRef.current.setFieldValue("project_members", updatedMembers);
  };
  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Dialog open={isOpen} onOpenChange={setIsOpen} className="z-[999]">
        <DialogContent className="max-w-[738px] w-[90vw]">
          <DialogHeader>
            <DialogTitle className={""}>Project Details</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <PageLoader />
          ) : (
            <ScrollArea className="[&>div>div[style]]:!block">
              <div className="h-[85vh] pr-3">
                <Formik
                  initialValues={initialValues}
                  innerRef={formRef}
                  enableReinitialize={true}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                  }}
                  validate={(values) => {
                    const errors = { ...validationProjectFormSchema(values) };
                    if (profilePictureError)
                      errors.profile_img = profilePictureError;
                    return errors;
                  }}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <div
                        className={`flex w-full flex-col rounded-lg pt-2.5 px-2 gap-8`}
                      >
                        <div className="space-y-2">
                          <ImageInput
                            name={"profile_img"}
                            error={props.errors.profile_img}
                            touch={props.touched.profile_img}
                            value={props.values.profile_img}
                            required={true}
                            onChange={(field, value, error) => {
                              props.setFieldValue(field, value);
                              if (error) {
                                setProfilePictureError(error);
                              }
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextInput
                            name="name"
                            error={props.errors.name}
                            touch={props.touched.name}
                            value={props.values.name}
                            label="Title"
                            required
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <TextAreaInput
                            name="description"
                            error={props.errors.description}
                            touch={props.touched.description}
                            value={props.values.description}
                            maxRows={5}
                            label="Project Description"
                            required
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                          <p className="text-xs text-neutral-800 font-normal">
                            Give important details regarding the new project
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <DateInput
                            name="end_date"
                            label="Aspected Completion Date"
                            error={props.errors.end_date}
                            touch={props.touched.end_date}
                            value={props.values.end_date}
                            onChange={(field, value) => {
                              props.handleChange(field)(value);
                            }}
                          />
                          <SelectInputComponent
                            name="status"
                            options={ProjectStatusList}
                            error={props.errors.status}
                            touch={props.touched.status}
                            value={props.values.status}
                            label={"Status"}
                            // required
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                          <div className="space-y-2">
                            <SelectMultiInputComponent
                              name="project_members"
                              options={employees}
                              label={"Members"}
                              value={props.values.project_members || []}
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                              showSelectedValuesBelow={true}
                              error={props.errors.project_members}
                              touch={props.touched.project_members}
                              placeholder="Select Project Members"
                              selectedOptionListClassName={
                                "z-[2] mt-3 w-[80vw] max-w-[700px]"
                              }
                            />
                          </div>
                          <ColorInput
                            name="color"
                            COLOR_OPTIONS={DEFAULT_PROJECT_COLOR_OPTIONS}
                            label={"Color"}
                            selectedColor={props.values.color}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                            error={props.errors.color}
                            touch={props.touched.color}
                            variant="preset-custom"
                          />
                        </div>
                        {editProject.id && (
                          <div className="grid grid-cols-2 grid-cols-[100px_auto] gap-x-1 gap-y-1 text-sm">
                            <div className="text-neutral-1100">Project Id:</div>
                            <div className="text-plum-1100 font-semibold">
                              <FormatID value={editProject.id} prefix={"PI-"} />
                            </div>
                            <div className="text-neutral-1100">Created On:</div>
                            <div className="text-plum-1100 font-semibold">
                              {renderDate(editProject.created_at)}
                            </div>
                            <div className="text-neutral-1100">Created By:</div>
                            <div className="text-plum-1100 font-semibold">
                              <EmployeeName value={editProject.created_by} />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 pl-0 border-t border-gray-200 flex flex-row justify-between w-full">
                        <div>
                          {isEditMode && (
                            <Button
                              variant="continue"
                              type="button"
                              onClick={handleDeleteProjectClick}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                          <Button
                            variant="outline"
                            type="button"
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {`${isEditMode ? "Update" : "Save"} Changes`}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
              <ScrollBar />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      {openAlertDialogue && (
        <AlertDialogue
          isOpen={openAlertDialogue}
          setIsOpen={setOpenAlertDialogue}
          handleContinue={confirmDelete}
          continueText="Delete"
          title="Are you Sure?"
          description="Are you sure you want to delete this Project? This action is irreversible and will delete all tasks within."
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employees: state.emp.employees,
    userProfile: state.user.userProfile,
  };
};
export default connect(mapStateToProps)(ProjectForm);
