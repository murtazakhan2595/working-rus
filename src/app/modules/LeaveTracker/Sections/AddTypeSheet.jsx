import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Switch } from "../../../../src/@/components/ui/switch";
import { Label } from "../../../../src/@/components/ui/label";
import { Button } from "../../../../components/ui/button";
import { TextInput, NumberInput } from "components/form-control";
import { saveLeaveComponents } from "app/hooks/leaveTracker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../src/@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../../../../components/ui/card";
import moment from "moment";
import { deleteLeaveComponent } from "app/hooks/leaveTracker";

const initialType = {
  name: "",
  max_days: "",
  Is_org_based: true,
  paid_leave:true,
  status: false,
};


const AddTypeSheet = ({ type, openSheet, reload }) => {
  const [isOpen, setIsOpen] = useState(openSheet || false);
  const [isEdit, setIsEdit] = useState(false);
  console.log("Type:", type);

  const [leaveComponentType, setLeaveComponentType] = useState(
    type || initialType
  );
  const formSheetData = {
    triggerText: type ? "" : "Add Component",
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
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          width="500px"
        >
          {type && !isEdit ? (
            <ViewComponent
              type={type}
              handleTypeDelete={handleTypeDelete}
              setIsEdit={setIsEdit}
            />
          ) : (
            <ComponentForm
              leaveComponentType={leaveComponentType}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              editMode={isEdit}
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
}) => {
  return (
    <Formik
      initialValues={leaveComponentType}
      // validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-inter flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
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
              onCheckedChange={(value) => props.setFieldValue("status", value)}
            />
            <Label htmlFor="status">Activate</Label>
          </div>
          <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel{" "}
            </Button>
            <Button type="submit" size="lg" variant="default">
              {"Save"}
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};




const ViewComponent = ({ type, handleTypeDelete, setIsEdit }) => {
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
            variant="default"
            size="sm"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="" className="">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this component?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Once deleted, the component data
                  will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{handleTypeDelete(type);}}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <section className="flex flex-col pt-14 ">
        <Card className="mt-0">
          <CardContent className="p-6">
            <div className="w-full font-semibold text-gray-900">Details</div>
            <div className="flex items-start mt-3 max-w-full w-[285px]">
              <div className="flex flex-col pr-20 min-w-[240px] w-[285px]">
                {details.map((detail, index) => (
                  <div className="flex gap-4 items-start w-full h-5  mb-4">
                    <div className=" text-sm">{detail.label}</div>
                    <div className="flex flex-col items-start">
                      <div className="text-gray-900 text-sm">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center px-6 pt-3.5 pb-3 w-full text-xs font-medium  border-t  max-md:px-5 ">
            <div className="flex-1 shrink self-stretch my-auto w-full min-w-[240px] ">
              Created on:{" "}
              <time dateTime={moment(type.createdAt).format("YYYY-MM-DD")}>
                {moment(type.createdAt).format("MMMM D, YYYY")}
              </time>
            </div>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};
