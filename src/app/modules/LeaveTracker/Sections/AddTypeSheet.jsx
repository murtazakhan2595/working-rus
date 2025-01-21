import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Switch } from "src/@/components/ui/switch";
import { Label } from "src/@/components/ui/label";
import { Button } from "components/ui/button";
import { TextInput } from "components/FormControl";
import { saveLeaveComponents } from "app/hooks/leaveTracker";
import { deleteLeaveComponent } from "app/hooks/leaveTracker";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { DetailCard } from "components/SheetCardExtension";
import { DetailBox } from "components/SheetCardExtension";
import { useDispatch } from "react-redux";
import { fetchLeaveComponents } from "state/slices/LeaveManagementSlice";

const AddTypeSheet = ({
  type,
  openSheet,
  setOpenSheet,
  reload,
  triggerText,
  isEmployeeBased,
  employeeId,
}) => {
  const initialType = {
    name: "",
    max_days: "",
    Is_org_based: true,
    paid_leave: true,
    status: true,
  };
  const initialTypeEmployee = {
    name: "",
    max_days: "",
    Is_org_based: false,
    paid_leave: true,
    status: true,
    employee_id: employeeId,
  };

  let dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(openSheet || false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [leaveComponentType, setLeaveComponentType] = useState(
    type || (isEmployeeBased ? initialTypeEmployee : initialType)
  );
  const formSheetData = {
    triggerText: triggerText,
    title: "Leave Type",

    description: null,
    footer: null,
  };
  useEffect(() => {
    if (openSheet || type) {
      setIsOpen(true);
      setIsEdit(false);
    } else {
      setIsOpen(false); // Close the sheet otherwise
    }
    console.log("opensheet value in addtypesheet", openSheet);
  }, [openSheet, type]);

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    const response = await saveLeaveComponents(values);
    if (response) {
      if (values.id) {
        toast.success("Leave Type updated successfully");
      } else {
        toast.success("Leave Type added successfully");
      }
      dispatch(fetchLeaveComponents());
      setIsOpen(false);
      reload();
    }
  };

  const handleTypeDelete = async (type) => {
    console.log("Delete component:", type);
    // const response = await deleteEarnAndDeduction(component.id);
    const response = await deleteLeaveComponent(type.id);
    if (response) {
      toast.success("Leave Type deleted successfully");
      setIsOpen(false);
      reload();
    }
  };

  return (
    <>
      <div>
        <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          width="568px"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          {type && !isEdit ? (
            <ViewComponent
              type={type}
              handleTypeDelete={handleTypeDelete}
              setIsEdit={setIsEdit}
              setIsDelete={setIsDelete}
              isDelete={isDelete}
            />
          ) : (
            <ComponentForm
              leaveComponentType={leaveComponentType}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              editMode={isEdit}
              setOpenSheet={setOpenSheet}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
};

export default AddTypeSheet;

const ComponentForm = ({
  leaveComponentType,
  handleSubmit,
  setIsOpen,
  editMode,
  setOpenSheet,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);

  const handleClose = () => {
    setCloseSheet(true);
    // setOpenSheet(false)
  };
  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

      <Formik
        initialValues={leaveComponentType}
        // validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
            <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Details</div>
                </div>
                <TextInput
                  name={"name"}
                  error={props.errors?.name}
                  touch={props.touched?.name}
                  value={props.values?.name}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  placeholder="Name"
                  label="Leave Name"
                  required="true"
                />
                <TextInput
                  name={"max_days"}
                  error={props.errors?.max_days}
                  touch={props.touched?.max_days}
                  value={props.values?.max_days}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  regEx={/^\d+$/}
                  placeholder=""
                  label="No. of Days"
                  required="true"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={props.values.status}
                onCheckedChange={(value) =>
                  props.setFieldValue("status", value)
                }
              />
              <Label htmlFor="status">Activate</Label>
            </div>
            <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" variant="default">
                {"Save"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

const ViewComponent = ({
  type,
  handleTypeDelete,
  setIsEdit,
  isDelete,
  setIsDelete,
}) => {
  console.log(type, "TYPES");
  const details = [
    { label: "Leave name", value: type.name },
    { label: "No. of days", value: type.max_days },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div class="w-[217px] h-9 py-1.5 justify-start items-start gap-3 inline-flex">
          <div class="text-black text-sm font-semibold  ">{type.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsDelete(true);
            }}
          >
            Delete
          </Button>
          {isDelete && (
            <AlertDialogue
              isOpen={isDelete}
              setIsOpen={setIsDelete}
              handleContinue={() => handleTypeDelete(type)}
              continueText="Delete"
              title="Are you sure you want to delete this component?"
              description="This action cannot be undone. Once deleted, the component data
                  will be permanently removed."
            />
          )}
        </div>
      </div>
      <DetailCard
        detailCardTitle="Details"
        date={type?.created_at}
        dateTitle="Created On"
      >
        {details.map((detail, index) => (
          <DetailBox label={detail?.label} value={detail?.value} />
        ))}
      </DetailCard>
    </>
  );
};
