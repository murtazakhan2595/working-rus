import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { RxPlus } from "react-icons/rx";
import { Members } from "../Sections";
import { Formik } from "formik";
import { addProject } from "app/hooks/taskManagment";
import {
  TextInput,
  SelectComponent,
  SelectMultiInputComponent,
} from "components/FormControl";
import { Project } from "app/utils/Types/TaskManagment";
import { useDispatch } from "react-redux";
import { fetchProjects } from "state/slices/CommonSlice";
import { TextAreaInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { ProjectStatusList } from "data/Data";
import { ImageInput } from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { validationProjectFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { PageLoader } from "components";

const ProjectForm = ({
  employees,
  reload,
  isEditMode,
  projectId,
  isOpen,
  setIsOpen,
  editProject,
  userProfile,
}) => {
  const formRef = useRef();
  let dispatch = useDispatch();
  const initialValues = editProject || Project;
  const [membersOpen, setMembersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#f7f7f7");
  const [closeSheet, setCloseSheet] = useState(false);

  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
  };

  useEffect(() => {
    let isMounted = true;
    if (projectId && isEditMode) reload(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

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
      <div open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col ">
          <div className="flex-grow ">
            <div className="p-0">
              {isLoading ? (
                <PageLoader />
              ) : (
                <Formik
                  initialValues={initialValues}
                  innerRef={formRef}
                  enableReinitialize={true}
                  onSubmit={(values, { resetForm }) => {
                    handleSubmit(values, resetForm);
                  }}
                  validate={(values) => {
                    const errors = { ...validationProjectFormSchema(values) };
                    return errors;
                  }}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <div className={`flex w-full flex-col rounded-lg pt-2.5 gap-8`}>
                        <SheetCardExtension title="Project Details">
                          <div className="space-y-2">
                            <ImageInput
                              name={"profile"}
                              error={props.errors.profile}
                              touch={props.touched.profile}
                              value={props.values.profile}
                              label={"Cover Photo"}
                              required={true}
                              onChange={(field, value, error) => {
                                props.setFieldValue(field, value);
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
                              maxRows={3}
                              label="Project Description"
                              required
                              onChange={(field, value) => {
                                props.handleChange(field)(value);
                              }}
                            />
                            <p>
                              Give important details regarding the new project
                            </p>
                          </div>
                        </SheetCardExtension>
                        <SheetCardExtension
                        title={`${
                          isEditMode ? "Update" : "Add"
                        } Project Details`}
                        className="mt-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="label text-sm flex-1">Colors</div>

                          <div className="flex space-x-2 flex-1">
                            {[
                              "#f7f7f7",
                              "#f9e8f7",
                              "#e7f9f7",
                              "#fdf7e7",
                              "#f9f7f9",
                            ].map((color, index) => (
                              <span
                                key={index}
                                className={`w-6 h-6 rounded-full border border-gray-300 cursor-pointer ${
                                  selectedColor === color
                                    ? "ring-2 ring-blue-500"
                                    : ""
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  setSelectedColor(color);
                                  props.setFieldValue("color", color); // Update Formik field
                                }}
                              ></span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="label text-sm flex-1">
                            Team Members
                          </div>

                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center justify-start gap-2 h-100">
                              <SelectMultiInputComponent
                                name="project_members"
                                options={employees}
                                // label={"Assignee"}
                                showLabel={false}
                                value={props.values.project_members || []}
                                onChange={(field, value) => {
                                  props.setFieldValue(field, value);
                                }}
                                error={props.errors.project_members}
                                touch={props.touched.project_members}
                                placeholder="Add Project Members"
                              />
                              {/* {props.values.project_members &&
                                props.values.project_members.length > 0 &&
                                props.values.project_members.map(
                                  (member, index) => (
                                    <div key={index}>
                                      <Members
                                        member={member}
                                        isEditMode={true}
                                        removeMember={removeMember}
                                      />
                                    </div>
                                  )
                                )}
                              <div
                                onClick={() => {
                                  setMembersOpen(!membersOpen);
                                }}
                                className={`w-9 h-9 rounded-full flex justify-center items-center cursor-pointer border-2 transition-all duration-300 ${
                                  membersOpen
                                    ? "bg-red-300 rotate-45"
                                    : "bg-emerald-600"
                                }`}
                              >
                                <div className="flex items-center justify-center text-2xl text-white plus-icon w-9 h-9">
                                  <RxPlus />
                                </div>
                              </div> */}
                            </div>
                          </div>
                        </div>
                        {/* {membersOpen && (
                          <SelectComponent
                            name="project_members"
                            placeholder="Select Members"
                            classes="flex-1 flex flex-col gap-4"
                            options={employees.map((emp) => ({
                              ...emp,
                              isDisabled:
                                props.values.project_members?.includes(
                                  emp.value
                                ),
                            }))}
                            error={props.errors.project_members}
                            touch={props.touched.project_members}
                            label="Project Members"
                            required
                            onChange={(field, value) => {
                              setMembersOpen(false);
                              const members =
                                props.values.project_members || [];
                              if (!members.includes(value)) {
                                members.push(value);
                                props.setFieldValue(field, members);
                              }
                            }}
                            isDisabled={(option) =>
                              props.values.project_members?.includes(
                                option.value
                              )
                            }
                          />
                        )} */}

                        <div className="flex items-center gap-4">
                          <div className="label text-sm mt-4 flex-1">
                            Status
                          </div>
                          <div className="flex-1">
                            <SelectComponent
                              name="status"
                              options={ProjectStatusList}
                              error={props.errors.status}
                              touch={props.touched.status}
                              value={props.values.status}
                              // required
                              onChange={(field, value) => {
                                props.setFieldValue(field, value);
                              }}
                            />
                          </div>
                        </div>
                      </SheetCardExtension>
                      </div>

                      {/* Color Selection */}

                     

                      <div className="p-6 border-t border-gray-200 ">
                        <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                          <Button
                            variant="outline"
                            type="button"
                            size="lg"
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" size="lg">
                            {isEditMode ? "Update" : "Add"}
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
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
