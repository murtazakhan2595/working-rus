import { useEffect, useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../src/@/components/ui/radio-group";
import { Button } from "../../../../components/ui/button";
import { getEarnAndDeduction } from "app/hooks/payroll";
import { Formik } from "formik";
import { RadioGroupInput } from "components/form-control";
import { TextInput } from "components/form-control";
import { DateInput } from "components/form-control";
import { Switch } from "../../../../src/@/components/ui/switch";
import { Label } from "../../../../src/@/components/ui/label";

import { saveEarnAndDeduction } from "app/hooks/payroll";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../../../../components/ui/card";

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
import { deleteEarnAndDeduction } from "app/hooks/payroll";
import moment from "moment";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";

const initialEarningAndDeduction = {
  name: "",
  income_type: "earning",
  amounts_types: "fixed",
  amounts: "",
  is_active: false,
};

const AddComponentSheet = ({
  component,
  openSheet,
  reload,
  isOpen,
  setIsOpen,
  onClose
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false)

  const [earnAndDeduction, setEarnAndDeduction] = useState(
    component || initialEarningAndDeduction
  );
  const formSheetData = {
    triggerText: component ? "" : "Add Component",
    title: component ? "Components" : "Add Component",

    description: null,
    footer: null,
  };


  const handleSubmit = async (values) => {
    const response = await saveEarnAndDeduction(values);
    if (response) {
      if (values.id) {
        toast.success("Component updated successfully");
      } else {
        toast.success("Component added successfully");
      }
      setIsOpen(false);
      setIsEdit(false)
      reload();
    }
  };

  const handleComponentDelete = async () => {
    const response = await deleteEarnAndDeduction(component.id);
    if (response) {
      toast.success("Component deleted successfully");
      setIsOpen(false);
      reload();
    }
  };

  const handleOpenState= ()=>{
    if(isOpen){
        setIsOpen(false);
        setIsEdit(false)
    }
    else{
        setIsOpen(true);
    }
    }

    const handleClose = ()=>{
      setCloseSheet(true)
    }


  return (
    <>
      <div>
    {handleCloseWithConfirmation(closeSheet, setCloseSheet, setIsOpen)}
        <SheetComponent
          {...formSheetData}
          contentClassName="custom-sheet-width"
          isOpen={isOpen}
          setIsOpen={handleOpenState}
         
        >
          {component && !isEdit ? (
            <ViewComponent
              component={component}
              handleComponentDelete={handleComponentDelete}
              setIsEdit={setIsEdit}
            />
          ) : (
            <ComponentForm
              earnAndDeduction={earnAndDeduction}
              handleSubmit={handleSubmit}
              setIsOpen={setIsOpen}
              setIsEdit={setIsEdit}
              onClose={handleClose}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
};

export default AddComponentSheet;

const ComponentForm = ({
  earnAndDeduction,
  handleSubmit,
  setIsOpen,
  setIsEdit,
  onClose
}) => {
  return (
    <Formik
      initialValues={earnAndDeduction}
      // validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
          <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
            <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
              <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                <div className="text-zinc-950">Component</div>
              </div>
              <div className="pt-4">
                <div>Component Type</div>
              </div>
              <RadioGroupInput
                name={"income_type"}
                error={props.errors?.income_type}
                touch={props.touched?.income_type}
                value={props.values?.income_type}
                options={[
                  { value: "earning", label: "Earning" },
                  { value: "deduction", label: "Deduction" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <div className="pt-4">
                <div>Component Name</div>
              </div>
              <TextInput
                name={"name"}
                error={props.errors?.name}
                touch={props.touched?.name}
                value={props.values?.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
                placeholder="Component Name"
              />
            </div>
          </div>

          <>
            <div className={`flex w-full flex-col rounded-lg pt-2.5`}>
              <div className="font-[inter] flex flex-grow flex-col gap-y-[11px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
                <div className="flex h-[7px] flex-shrink-0 items-end px-px">
                  <div className="text-zinc-950">Amount</div>
                </div>
                <div className="pt-4">
                  <div>Amount type</div>
                </div>
                <div>
                  <RadioGroupInput
                    name={"amounts_types"}
                    error={props.errors?.amounts_types}
                    touch={props.touched?.amounts_types}
                    value={props.values?.amounts_types}
                    options={[
                      { value: "fixed", label: "Fixed" },
                      { value: "percentage", label: "Variable" },
                    ]}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </div>
                <div className="pt-4">
                  <div>Amount </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-zinc-900">
                    {props.values.amounts_types === "fixed"
                      ? "Flat Amount"
                      : "% of Gross"}
                  </div>
                  <TextInput
                    value={props.values.amounts}
                    onChange={(field, value) => {
                      console.log("Amount:", value);
                      console.log("Field:", field);
                      props.handleChange(field)(value);
                    }}
                    name={"amounts"}
                    placeholder={
                      props.values.amounts_types === "fixed"
                        ? "Enter amount"
                        : "Enter percentage"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={props.values.is_active}
                onCheckedChange={(value) =>
                  props.setFieldValue("is_active", value)
                }
              />
              <Label htmlFor="is_active">Activate</Label>
            </div>
          </>
          <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={onClose}
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
  );
};

const ViewComponent = ({ component, handleComponentDelete, setIsEdit }) => {
  const details = [
    { label: "Amount Type", value: component.amounts_types },
    { label: "Amount Rate", value: component.amounts },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <div class="w-[217px] h-9 py-1.5 justify-start items-start gap-3 inline-flex">
          <div class="text-black text-sm font-semibold  ">{component.name}</div>
          <div class="px-3 py-[3px] rounded-[999px] border border-[#f0f0f3] justify-center items-center gap-1.5 flex">
            <div class="w-1.5 h-1.5 bg-[#29a385] rounded-full"></div>
            <div class="text-neutral-1200 text-xs font-semibold capitalize leading-3">
              {component.income_type}
            </div>
          </div>
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
                <AlertDialogAction onClick={handleComponentDelete}>
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
            <div className="w-full font-semibold ">Component Details</div>
            <div className="flex items-start mt-3 max-w-full w-[285px]">
              <div className="flex flex-col pr-20 min-w-[240px] w-[285px]">
                {details.map((detail, index) => (
                  <div className="flex items-start w-full h-5 gap-4 mb-4">
                    <div className="text-sm ">{detail.label}</div>
                    <div className="flex flex-col items-start">
                      <div className="text-sm text-gray-900">
                        {detail.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center px-6 pt-3.5 pb-3 w-full text-xs font-medium  border-t  max-md:px-5 ">
            <div>
              <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                Created on:
              </span>
              <span className="text-[#8b8d98] text-xs font-normal  leading-3">
                {` ${moment(component?.created_at).format("MMMM DD, YYYY")}`}
              </span>
            </div>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};
