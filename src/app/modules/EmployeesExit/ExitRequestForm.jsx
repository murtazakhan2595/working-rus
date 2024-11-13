import { getEmployeeData } from "app/hooks/employee";
import { PageLoader } from "components";
import { FileInput } from "components/form-control";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { SelectComponent } from "components/form-control";
import { DateInput } from "components/form-control";
import { Formik } from "formik";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";
import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { NoticePeriod } from "data/Data";
import { TextInput } from "components/form-control";
import { getDepartmentName } from "utils/getValuesFromTables";
import { getDesignationName } from "utils/getValuesFromTables";
import { getManagerName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
import { ReasonForLeaving } from "data/Data";

const PersonalInformation = ({
  personalInfo,
  userData,
  isEditable,
  reload,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(personalInfo, "PERSONAL INFO")

  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [visaDetails, setVisaDetails] = useState({});
  const formRef = React.createRef();
  const handleSubmit = async (data, resetForm) => {
    // setIsLoading(true);
    const formData = {
      exit_category: "resignation",
      employee_id: userData.id,
      status_resignation: "pending",
      exit_date: data.exit_date,
      resignation_letter: data.resignation_Letter,
      notice_period: data.notice_period,
      exit_type: data?.reason_for_leaving
    };

    try {
      const response = await employeeExit(formData);
      if (response) {
        toast.success("Request has been successfully submitted");
        reload();
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in handleSubmit:", error);
    }
  };

  console.log("personalInfo,personalInfo", personalInfo);
  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="w-full lg:w-[80%]">
          <div className="flex justify-between">
            <h2 className="text-xl">Employee Information</h2>
            {isEditable && (
              <div
                className="flex items-center gap-4"
                onClick={() => {
                  setShowPersonalDetailCard(true);
                }}
              >
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
              </div>
            )}
          </div>
          <div className="flex flex-col py-2">
            {/* Image Section */}
            <div className="flex justify-center w-full gap-4 mt-2 mb-6 sm:flex-col md:flex-row lg:flex-row lg:items-center">
              {userData?.profile_picture?.file || userData?.profile_picture ? (
                <img
                  src={
                    userData?.profile_picture?.file || userData?.profile_picture
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-24 h-24 text-center align-middle rounded-full opacity-70 bg-slate-100">
                  Profile
                </div>
              )}
              <div className="flex flex-col w-full my-auto">
                <div className="text-lg font-semibold">
                  {userData.first_name} {userData.last_name}
                </div>
                <div className="opacity-70">
                  ID: TXB-{userData.id?.toString().padStart(4, "0")}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 w-full gap-4">
              {/* Personal Info Sections */}
              {personalInfo[0].map((info) => (
                <div className="space-y-2 flex flex-col justify-end">
                  <TextInput
                    value={info.data}
                    name={info.title}
                    label={info.title}
                    disabled={true}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <h2 className="text-xl">Exit Details</h2>
          </div>
          <Formik
            initialValues={visaDetails}
            ref={formRef}
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values, resetForm);
            }}
            validate={(values) => {
              const errors = {};
              console.log(values);

              return errors;
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <div className="grid sm:grid-cols-1 lg:grid-cols-3 w-full gap-4">
                  <DateInput
                    placeholder="Date"
                    label="Exit Date"
                    error={props.errors.exit_date}
                    touch={props.touched.exit_date}
                    value={props.values.exit_date}
                    name="exit_date"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                  <SelectComponent
                    name={"notice_period"}
                    options={NoticePeriod}
                    error={props.errors.notice_period}
                    touch={props.touched.notice_period}
                    value={props.values.notice_period}
                    label={"Notice Period"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                  <SelectComponent
                    name={"reason_for_leaving"}
                    options={ReasonForLeaving}
                    error={props.errors.reason_for_leaving}
                    touch={props.touched.reason_for_leaving}
                    value={props.values.reason_for_leaving}
                    label={"Reason for leaving"}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                  />
                </div>
                <FileInput
                  name={"resignation_Letter"}
                  error={props.errors?.resignation_Letter}
                  touch={props.touched?.resignation_Letter}
                  value={props.values?.resignation_Letter}
                  label={" Resignation Letter or drag it here"}
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                />
                <div className="flex flex-row gap-9 ">
                  <Button variant="outline" type="submit" size="lg">
                    Reset
                  </Button>

                  <Button type="submit" size="lg" variant="default">
                    Submit
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};
export default function ExitRequestForm({
  token,
  baseUrl,
  userProfile,
  departments,
  managers,
  designations,
  profileView,
  reload,
}) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const userId = userProfile?.id;
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      let empData = await getEmployeeData(userId);
      console.log(empData, "EMPT DATA")
      setUserData(empData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const personalInfo = [
    [
      { title: "First Name", data: userData.first_name },
      { title: "Last Name", data: userData?.last_name },
      {
        title: "Department",
        data: getDepartmentName(userData?.department_name, departments),
      },
      {
        title: "Designation",
        data: <DesignationName value={userData?.department_position} />,
        data: getDesignationName(userData?.department_position, departments),
      },
      {
        title: "Work Location",
        data: userData?.employee_location || "",
      },

      { title: "Organization", data: userData?.organization },
      {
        title: "Report to",
        data: getManagerName(userData?.direct_repor, managers),
      },

      {
        title: "Joining date",
        data: moment(userData.date_of_birth, "YYYY-MM-DD").format("DD-MM-YYYY"),
      },
      { title: "Phone number", data: userData?.mobile_no },
    ],
  ];
  return (
    <>
      <div className="px-2 py-4 m-2 mt-0 bg-white rounded-b-md">
        {loading ? (
          <PageLoader />
        ) : (
          <>
            <PersonalInformation
              isEditable={false}
              personalInfo={personalInfo}
              userData={userData}
              getDataByHooks={getDataByHooks}
            />
          </>
        )}
      </div>
    </>
  );
}
