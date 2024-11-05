import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import {
  TextInput,
  SelectComponent,
  DateInput,
} from "components/form-control.jsx";
import { RiAttachment2 } from "react-icons/ri";
import { RxPlus } from "react-icons/rx";
import members from "assets/images/members.svg";
import highpriorityIcon from "assets/images/highpriority.svg";
import lowpriorityIcon from "assets/images/lowpriority.svg";
import mediumpriorityIcon from "assets/images/mediumpriority.svg";
import plus from "assets/images/plus.svg";
import { PriorityList } from "data/Data";
import Members from "../../Sections/Member";
import { FileInput } from "components/form-control";
import { AiOutlineDownload } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaRegImage } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { validationTaskFormSchema } from "app/utils/FormSchema/taskManagementFormSchema";
import { getAllLabels } from "app/hooks/taskManagment";
import { Textarea } from "components/ui/textarea";
import { TextAreaInput } from "components/form-control";
import { Button } from "components/ui/button";
import Labels from "../../Sections/Labels";
import CheckList from "../../Sections/CheckList";
import { getDarkerTextColor } from "./getTaskStatus";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../../src/@/components/ui/popover";
import { Input } from "components/ui/input";
import { relationList } from "data/Data";

const CreateAndEditCardForm = ({
  initialValues,
  employees,
  handleSubmit,
  onClose,
  isEdit,
}) => {
  const formRef = useRef();

  const fileInputRef = useRef(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [newfiles, setNewFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [labelsList, setLabelsList] = useState([]);
  const [labelsAdded, setLabelsAdded] = useState([]);
  const [foreignKeys, setForeignKeys] = useState([]);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleAddItem = () => {
    const newItem = {
      id: Date.now(), // use unique ID
      label: inputValue,
      checked: false,
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setInputValue("");
    setIsPopoverOpen(false); // Close the popover after adding the item
  };

  const handleCheckListChange = (itemIds) => {
    setForeignKeys(itemIds);
    console.log(itemIds, "ITEM IDS");
  };

  const handleRelationSelect = (task) => {
    console.log("Selected task:", task);
  };

  useEffect(() => {
    const fetchLabels = async () => {
      const labelList = await getAllLabels();
      setLabelsList(labelList); // Update this to `labelList`
    };

    fetchLabels();
  }, []);

  const handleSelectedLabelsChange = (selectedLabels) => {
    setLabelsAdded(selectedLabels);
    const selectedLabelObjects = selectedLabels?.map((selectedId) =>
      labelsList?.results?.find((label) => label.id === selectedId)
    );
    console.log(selectedLabelObjects, "OBJECT LABEL");
    setLabels(selectedLabelObjects);
  };

  useEffect(() => {
    setFiles(initialValues.attachment);
  }, [initialValues.attachment]);

  const userProfile = useSelector((state) => state.user.userProfile);
  const formInitialValues = isEdit
    ? initialValues
    : { ...initialValues, assigned_by: userProfile.id };

  const handleAttachmentsChange = (event, props) => {
    const selectedFiles = event.target.files;
    const filesArray = Array.from(selectedFiles);

    Promise.all(
      filesArray.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const fileData = {
              name: file.name,
              file: event.target.result,
            };
            resolve(fileData);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      })
    )
      .then((fileDataArray) => {
        setNewFiles(fileDataArray);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
      });
  };
  const removeFile = (file) => {
    if (file.id) {
      setDeleteFiles([...deleteFiles, file.id]);
      const filteredFiles = files.filter((f) => f.id !== file.id);
      setFiles(filteredFiles);
    } else {
      const filteredFiles = newfiles.filter((f) => f.name !== file.name);
      setNewFiles(filteredFiles);
    }
  };

  const removeMember = (member) => {
    const members = formRef.current.values.assigned_to || [];
    const updatedMembers = members.filter((m) => m !== member);
    formRef.current.setFieldValue("assigned_to", updatedMembers);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      enableReinitialize={true}
      innerRef={formRef}
      onSubmit={(values, { resetForm }) => {
        console.log(values, "VALUES");
        const formValues = {
          ...values,
          label: labelsAdded,
        };
        handleSubmit(formValues, newfiles, files, deleteFiles, resetForm);
      }}
      validate={(values) => {
        // const errors = validationTaskFormSchema(values);
        return {};
      }}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="">
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Card Details</div>
              </div>
              <div className="space-y-2">
                <TextAreaInput
                  name="name"
                  error={props.errors.name}
                  touch={props.touched.name}
                  value={props.values.name}
                  label="Title"
                  required={true}
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
                  required
                  maxRows={3}
                  label="Description"
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-5">
                  <div className="flex items-center gap-2.5 text-lg font-medium leading-4 text-zinc-600">
                    <RiAttachment2 />
                    <div>Attachments ({newfiles?.length + files.length})</div>
                  </div>
                </div>
                <img
                  src={plus}
                  alt=""
                  className="cursor-pointer"
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                />
                <Input
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(event) => handleAttachmentsChange(event, props)}
                  ref={fileInputRef}
                />
                {(files.length > 0 || newfiles?.length > 0) && (
                  <div className="">
                    {[...files, ...newfiles].map((file, index) => (
                      <div className="flex items-center justify-between p-2 mb-2 bg-gray-100 rounded-lg shadow-md w-fit">
                        <div className="flex items-center">
                          <FaRegImage className="w-4 h-4 text-gray-500" />
                          <span className="ml-4 text-sm  text-baseGray">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-2">
                          <a
                            href="/path/to/your/image.jpg"
                            download
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <AiOutlineDownload className="w-5 h-5 " />
                          </a>
                          <MdClose
                            className="w-5 h-5 text-gray-500 cursor-pointer"
                            onClick={() => {
                              removeFile(file);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={`flex w-full flex-col rounded-lg pt-2.5 mt-5`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Add To Card</div>
                </div>
                <div className="space-y-2">
                  <DateInput
                    name="end_date"
                    error={props.errors.start_date}
                    touch={props.touched.start_date}
                    value={props.values.start_date}
                    label="Due Date"
                    required
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <TextInput
                    name="estimated_time"
                    error={props.errors.estimated_time}
                    touch={props.touched.estimated_time}
                    value={props.values.estimated_time}
                    label="Estimated Time (in hours)"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <TextInput
                    name="consumed_time"
                    error={props.errors.consumed_time}
                    touch={props.touched.consumed_time}
                    value={props.values.consumed_time}
                    label="Time Spent (in hours)"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <SelectComponent
                    name="priority"
                    options={PriorityList}
                    error={props.errors.priority}
                    touch={props.touched.priority}
                    value={props.values.priority}
                    required
                    label="Priority"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>

                <div className="space-y-2 flex items-center gap-2">
                  <div>Label</div>

                  <Labels
                    onSelectedLabelsChange={handleSelectedLabelsChange}
                    labelsList={labelsList?.results}
                  />
                </div>
                <div>
                  <ul className="flex gap-2 flex-wrap">
                    {labels?.map((label) => (
                      <li
                        key={label.id}
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          label?.color
                        } ${getDarkerTextColor(label?.color)}`}
                      >
                        {label.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-5">
                  <div className="flex items-center gap-2.5 text-lg font-medium leading-4 text-zinc-600">
                    <img
                      loading="lazy"
                      src={members}
                      className="shrink-0 aspect-[1.06] w-[17px]"
                      alt=""
                    />
                    <div>Assignee</div>
                  </div>
                </div>
                {props.errors.assigned_to &&
                  props.values.assigned_to.length === 0 && (
                    <div className="pt-1 text-xs text-red-500">
                      {props.errors.assigned_to}
                    </div>
                  )}
                <div className="flex items-center justify-start gap-2 h-100">
                  {props.values.assigned_to &&
                    props.values.assigned_to.length > 0 &&
                    props.values.assigned_to.map((member, index) => (
                      <div key={index}>
                        <Members
                          member={member}
                          isEditMode={true}
                          removeMember={removeMember}
                        />
                      </div>
                    ))}
                  <div
                    onClick={() => {
                      setMembersOpen(!membersOpen);
                    }}
                    className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                  >
                    <span className="flex items-center justify-center text-2xl text-white plus-icon w-9 h-9">
                      <RxPlus />
                    </span>
                  </div>
                </div>
                {membersOpen && (
                  <SelectComponent
                    name="assigned_to"
                    options={employees}
                    error={props.errors.assigned_to}
                    touch={props.touched.assigned_to}
                    label="Assign to"
                    required
                    onChange={(field, value) => {
                      setMembersOpen(false);
                      const members = props.values.assigned_to || [];
                      members.push(value);
                      props.setFieldValue(field, members);
                    }}
                  />
                )}

                <div className="space-y-2 flex items-center gap-2">
                  <div>CheckList</div>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setIsPopoverOpen(true)}
                      >
                        +
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Item name"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button onClick={handleAddItem}>Add</Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <div>{/* Pass the items and setItems to CheckList */}</div>
                </div>
                <CheckList items={items} setItems={setItems} />

                <div className="space-y-2">
                  <SelectComponent
                    name="relation"
                    options={relationList}
                    error={props.errors.relation}
                    touch={props.touched.relation}
                    value={props.values.relation}
                    label="Relation"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 flex justify-end gap-2">
              <Button
                type=""
                variant="outline"
                size="lg"
                // onClick={onClose()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {initialValues.id ? "Save" : "Add Card"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default CreateAndEditCardForm;
