import { getEmployeeData } from "app/hooks/employee";
import { PageLoader } from "components";
import { FileInput } from "components/form-control";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { Row, Col, Form } from "reactstrap";
import { SelectComponent } from "components/form-control";
import { DateInput } from "components/form-control";
import { Formik } from "formik";
import { DepartmentName } from "utils/getValuesFromTables";
import { DesignationName } from "utils/getValuesFromTables";
import { ManagerName } from "utils/getValuesFromTables";
import { getAllCountries } from "countries-and-timezones";
import { employeeExit } from "app/hooks/employee";
import { toast } from "react-toastify";
import { NoticePeriod } from "data/Data";

const PersonalInformation = ({
  personalInfo,
  userData,
  isEditable,
  reload,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
    };

    try {
      console.log("employee exit form", formData, data);
       const response = await employeeExit(formData);
      if (response) {
        toast.success("Request has been successfully submitted");
        reload()
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in handleSubmit:", error);
    }
  };
  return (
    <>
      {isLoading ? (
        <Row>
          <Col lg={12}>
            <PageLoader />
          </Col>
        </Row>
      ) : (
        <div className="w-full lg:w-[80%]">
          <div className="w-full p-6 px-8 mb-6 bg-white rounded-lg">
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
                {userData?.profile_picture?.file ||
                userData?.profile_picture ? (
                  <img
                    src={
                      userData?.profile_picture?.file ||
                      userData?.profile_picture
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
              {/* Personal Info Sections */}
              <div className="flex flex-col gap-8 overflow-visible lg:flex-row no-scrollbar whitespace-break-spaces">
                {personalInfo.map((infoGroup, index) => (
                  <div
                    key={index}
                    className="grid w-full gap-4 sm:grid-cols-1 lg:grid-cols-2"
                  >
                    {infoGroup.map((info) => (
                      <div
                        className="flex flex-col w-full gap-2 p-2 px-3 border rounded-md"
                        key={info.title}
                      >
                        <div className="w-full opacity-60 ">{info.title}</div>

                        <div className="w-full">{info.data || "-----"}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full p-6 mb-6 bg-white rounded-lg">
            <div className="flex justify-between">
              <h2 className="text-xl">Exit Details</h2>
            </div>

            {/* IdentificationInformation reference for form submit and form actiones dinesh */}

            <Row>
              <Col lg={12}>
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
                    <form onSubmit={props.handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <DateInput
                            name={"exit_date"}
                            error={props.errors.exit_date}
                            touch={props.touched.exit_date}
                            value={props.values.exit_date}
                            label={"Exit Date"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={6}>
                          <SelectComponent
                            name={"notice_period"}
                            options={NoticePeriod}
                            error={props.errors.reason_for_leaving}
                            touch={props.touched.reason_for_leaving}
                            value={props.values.reason_for_leaving}
                            label={"Notice Period"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md={12} className="z-0">
                          <SelectComponent
                            name={"reason_for_leaving"}
                            options={[
                              { value: "voluntary", label: "Voluntary" },
                              { value: "involuntary", label: "Involuntary" },
                              {
                                value: "end-of-contract",
                                label: "End of Contract",
                              },
                              { value: "retirement", label: "Retirement" },
                              { value: "layoff", label: "Layoff" },
                              { value: "dismissal", label: "Dismissal" },
                              {
                                value: "mutual-agreement",
                                label: "Mutual Agreement",
                              },
                              {
                                value: "career-advance",
                                label: "Career Advancement",
                              },
                              { value: "relocation", label: "Relocation" },
                              {
                                value: "health-reasons",
                                label: "Health Reasons",
                              },
                              {
                                value: "family-reasons",
                                label: "Family Reasons",
                              },
                              { value: "education", label: "Education" },
                              {
                                value: "better-opportunity",
                                label: "Better Opportunity",
                              },
                            ]}
                            error={props.errors.reason_for_leaving}
                            touch={props.touched.reason_for_leaving}
                            value={props.values.reason_for_leaving}
                            label={"Reason for leaving"}
                            onChange={(field, value) => {
                              props.setFieldValue(field, value);
                            }}
                          />
                        </Col>
                        <Col md="12">
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
                        </Col>
                        <Col md="12">
                          <div className="flex flex-row gap-9 ">
                            <button
                              type="submit"
                              className="flex items-center justify-center w-48 h-12 mt-4 text-base text-black bg-white border-2 border-black rounded-lg gap-x-2 font-lato"
                            >
                              Reset
                            </button>

                            <button
                              type="submit"
                              className="flex items-center justify-center w-48 h-12 mt-4 text-base text-white bg-black rounded-lg gap-x-2 font-lato"
                            >
                              Submit
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};
export default function ExitRequestForm({ token, baseUrl, userProfile, profileView, reload }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const userId = userProfile?.id;
  const getDataByHooks = async () => {
    setLoading(true);
    try {
      let empData = await getEmployeeData(userId);

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
        data: <DepartmentName value={userData?.department_name} />,
      },
      {
        title: "Designation",
        data: <DesignationName value={userData?.department_position} />,
      },
      {
        title: "Work Location",
        data: getAllCountries()[userData?.employee_location]?.name || "",
      },

      { title: "Organization", data: userData?.organization },
      {
        title: "Report to",
        data: <ManagerName value={userData?.direct_report} />,
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
