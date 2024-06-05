import React, { useState, useEffect } from "react";
import {
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from "reactstrap";
import { Formik } from "formik";
import { connect } from "react-redux";
import {
  getEmployeeAcademicRecordData,
  saveEmployeeAcademicRecordData,
} from "../../../../hooks/employee.jsx";
import PageLoader from "../../../../../components/PageLoader.jsx";
import { EmployeeAcademicRecord } from "../../../../utils/Types/Employee";
import {
  DateInput,
  SelectComponent,
  TextInput,
} from "../../../../../components/form-control";
import { educationTypeOptions } from "../../../../../data/Data.js";

// Helper function to format dates
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Utility function to convert file to base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const EducationInformation = ({
  nextstep,
  baseUrl,
  token,
  employeeId,
  isEditMode,
}) => {
  const formRef = React.createRef();
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEmployeeAcademicRecordData(baseUrl, employeeId, token)
      .then((response) => {
        setEducations(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseUrl, employeeId, token]);

  const handleSubmit = async (data) => {
    const formattedData = {
      ...data,
      educations: await Promise.all(
        data.educations.map(async (education) => {
          const formattedEducation = {
            ...education,
            edu_start_date: formatDate(education.edu_start_date),
            edu_end_date: formatDate(education.edu_end_date),
          };
          if (education.education_body && education.education_body.name) {
            formattedEducation.education_body = await convertFileToBase64(
              education.education_body
            );
          }
          return formattedEducation;
        })
      ),
    };

    const response = await saveEmployeeAcademicRecordData(
      baseUrl,
      employeeId,
      token,
      formattedData.educations
    );
    if (response && isEditMode) nextstep();
  };

  return (
    <div className="screen">
      <Row>
        <Col lg={8} className="mx-auto">
          <CardHeader>
            <Row>
              <Col lg={12}>
                <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
                  Academics
                </h2>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <Row>
                <Col lg={12}>
                  <PageLoader />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col lg={12}>
                  <Formik
                    initialValues={{ educations: educations }}
                    ref={formRef}
                    onSubmit={(values, { resetForm }) => {
                      handleSubmit(values);
                    }}
                    validate={(values) => {
                      const errors = {};
                      if (values.educations) {
                        values.educations.forEach((value, index) => {
                          const educationErrors = {};
                          Object.keys(value).forEach((field) => {
                            if (!value[field]) {
                              educationErrors[field] = "This field is required";
                            }
                          });
                          if (Object.keys(educationErrors).length > 0) {
                            errors.educations = errors.educations || [];
                            errors.educations[index] = educationErrors;
                          }
                        });
                      }
                      return errors;
                    }}
                  >
                    {(props) => (
                      <Form onSubmit={props.handleSubmit}>
                        <Row>
                          {props.values?.educations &&
                            props.values.educations.length > 0 &&
                            props.values.educations.map(
                              (education, index) => (
                                <React.Fragment key={index}>
                                  <Col md="12">
                                    <h5 className="fw-700 mb-3 mt-4">
                                      Education {index + 1}
                                    </h5>
                                  </Col>
                                  <div className="flex flex-wrap gap-x-3">
                                    <div className="w-full md:w-[48%]">
                                      <SelectComponent
                                        options={educationTypeOptions}
                                        name={`educations[${index}].education_level`}
                                        value={education.education_level}
                                        onChange={(field, value) => {
                                          props.setFieldValue(field, value);
                                        }}
                                        label={"Educational Level"}
                                        required
                                        error={
                                          props.errors.educations &&
                                          props.errors.educations[index]
                                            ?.education_level
                                        }
                                        touched={
                                          props.touched.educations &&
                                          props.touched.educations[index]
                                            ?.education_level
                                        }
                                      />
                                    </div>
                                    <div className="w-full md:w-[48%]">
                                      <TextInput
                                        name={`educations[${index}].program`}
                                        value={education.program}
                                        onChange={(field, value) => {
                                          props.setFieldValue(field, value);
                                        }}
                                        label={"Program"}
                                        required
                                        error={
                                          props.errors.educations &&
                                          props.errors.educations[index]
                                            ?.program
                                        }
                                        touched={
                                          props.touched.educations &&
                                          props.touched.educations[index]
                                            ?.program
                                        }
                                      />
                                    </div>
                                    <div className="w-full md:w-[48%]">
                                      <TextInput
                                        name={`educations[${index}].institute_name`}
                                        value={education.institute_name}
                                        onChange={(field, value) => {
                                          props.setFieldValue(field, value);
                                        }}
                                        label={"Institute"}
                                        required
                                        error={
                                          props.errors.educations &&
                                          props.errors.educations[index]
                                            ?.institute_name
                                        }
                                        touched={
                                          props.touched.educations &&
                                          props.touched.educations[index]
                                            ?.institute_name
                                        }
                                      />
                                    </div>
                                    <div className="w-full md:w-[48%]">
                                      <DateInput
                                        name={`educations[${index}].edu_start_date`}
                                        value={education.edu_start_date}
                                        onChange={(field, value) => {
                                          props.setFieldValue(field, value);
                                        }}
                                        label={"Start Date"}
                                        required
                                        error={
                                          props.errors.educations &&
                                          props.errors.educations[index]
                                            ?.edu_start_date
                                        }
                                        touched={
                                          props.touched.educations &&
                                          props.touched.educations[index]
                                            ?.edu_start_date
                                        }
                                      />
                                    </div>
                                    <div className="w-full md:w-[48%]">
                                      <DateInput
                                        name={`educations[${index}].edu_end_date`}
                                        value={education.edu_end_date}
                                        onChange={(field, value) => {
                                          props.setFieldValue(field, value);
                                        }}
                                        label={"End Date"}
                                        required
                                        error={
                                          props.errors.educations &&
                                          props.errors.educations[index]
                                            ?.edu_end_date
                                        }
                                        touched={
                                          props.touched.educations &&
                                          props.touched.educations[index]
                                            ?.edu_end_date
                                        }
                                      />
                                    </div>
                                    <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40">
                                      <input
                                        type="file"
                                        name={`educations[${index}].education_body`}
                                        onChange={async (e) => {
                                          const file =
                                            e.currentTarget.files[0];
                                          const base64 =
                                            await convertFileToBase64(file);
                                          props.setFieldValue(
                                            `educations[${index}].education_body`,
                                            base64
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </React.Fragment>
                              )
                            )}
                          <Col md="12" className="text-left">
                            <Button
                              type="button"
                              className="btn btn-outline-dark my-3 bg-white"
                              onClick={() => {
                                const length =
                                  props.values?.educations?.length;
                                const index = length ? length : 0;
                                props.setFieldValue(
                                  `educations[${index}]`,
                                  EmployeeAcademicRecord
                                );
                              }}
                            >
                              + Add Another
                            </Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <FormGroup className="text-right">
                              <Button type="submit" className="btn btn-dark">
                                Next
                              </Button>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            )}
          </CardBody>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(EducationInformation);


// import React, { useState, useEffect } from "react";
// import {
//   CardHeader,
//   CardBody,
//   Row,
//   Col,
//   Button,
//   Form,
//   FormGroup,
// } from "reactstrap";
// import { Formik } from "formik";
// import { connect } from "react-redux";
// import {
//   getEmployeeAcademicRecordData,
//   saveEmployeeAcademicRecordData,
// } from "../../../../hooks/employee.jsx";
// import PageLoader from "../../../../../components/PageLoader.jsx";
// import { EmployeeAcademicRecord } from "../../../../utils/Types/Employee";
// import {
//   DateInput,
//   SelectComponent,
//   TextInput,
// } from "../../../../../components/form-control";
// import { educationTypeOptions } from "../../../../../data/Data.js";

// // Helper function to format dates
// const formatDate = (date) => {
//   const d = new Date(date);
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, '0');
//   const day = String(d.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const EducationInformation = ({
//   nextstep,
//   baseUrl,
//   token,
//   employeeId,
//   isEditMode,
// }) => {
//   const formRef = React.createRef();
//   const [educations, setEducations] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     getEmployeeAcademicRecordData(baseUrl, employeeId, token)
//       .then((response) => {
//         setEducations(response);
//         setIsLoading(false);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [baseUrl, employeeId, token]);

//   const handleSubmit = (data) => {
//     // Format dates before submitting
//     const formattedData = {
//       ...data,
//       educations: data.educations.map(education => ({
//         ...education,
//         edu_start_date: formatDate(education.edu_start_date),
//         edu_end_date: formatDate(education.edu_end_date),
//       }))
//     };

//     const response = saveEmployeeAcademicRecordData(
//       baseUrl,
//       employeeId,
//       token,
//       formattedData.educations
//     );
//     if (response && isEditMode) nextstep();
//   };

//   return (
//     <div className="screen">
//       <Row>
//         <Col lg={8} className="mx-auto">
//           <CardHeader>
//             <Row>
//               <Col lg={12}>
//                 <h2 className="text-2xl font-lato font-bold text-[#323333] text-left">
//                   Academics
//                 </h2>
//               </Col>
//             </Row>
//           </CardHeader>
//           <CardBody>
//             {isLoading ? (
//               <Row>
//                 <Col lg={12}>
//                   <PageLoader />
//                 </Col>
//               </Row>
//             ) : (
//               <Row>
//                 <Col lg={12}>
//                   <Formik
//                     initialValues={{ educations: educations }}
//                     ref={formRef}
//                     onSubmit={(values, { resetForm }) => {
//                       handleSubmit(values);
//                     }}
//                     validate={(values) => {
//                       const errors = {};
//                       if (values.educations) {
//                         values.educations.forEach((value, index) => {
//                           const educationErrors = {};
//                           Object.keys(value).forEach((field) => {
//                             if (!value[field]) {
//                               educationErrors[field] = "This field is required";
//                             }
//                           });
//                           if (Object.keys(educationErrors).length > 0) {
//                             errors.educations = errors.educations || [];
//                             errors.educations[index] = educationErrors;
//                           }
//                         });
//                       }
//                       return errors;
//                     }}
//                   >
//                     {(props) => (
//                       <Form onSubmit={props.handleSubmit}>
//                         <Row>
//                           {props.values?.educations &&
//                             props.values.educations.length > 0 &&
//                             props.values.educations.map(
//                               (education, index) => (
//                                 <React.Fragment key={index}>
//                                   <Col md="12">
//                                     <h5 className="fw-700 mb-3 mt-4">
//                                       Education {index + 1}
//                                     </h5>
//                                   </Col>
//                                   <div className="flex flex-wrap gap-x-3">
//                                     <div className="w-full md:w-[48%]">
//                                       <SelectComponent
//                                         options={educationTypeOptions}
//                                         name={`educations[${index}].education_level`}
//                                         value={education.education_level}
//                                         onChange={(field, value) => {
//                                           props.setFieldValue(field, value);
//                                         }}
//                                         label={'Educational Level'}
//                                         required
//                                         error={props.errors.educations && props.errors.educations[index]?.education_level}
//                                         touched={props.touched.educations && props.touched.educations[index]?.education_level}
//                                       />
//                                     </div>
//                                     <div className="w-full md:w-[48%]">
//                                       <TextInput
//                                         name={`educations[${index}].program`}
//                                         value={education.program}
//                                         onChange={(field, value) => {
//                                           props.setFieldValue(field, value);
//                                         }}
//                                         label={'Program'}
//                                         required
//                                         error={props.errors.educations && props.errors.educations[index]?.program}
//                                         touched={props.touched.educations && props.touched.educations[index]?.program}
//                                       />
//                                     </div>
//                                     <div className="w-full md:w-[48%]">
//                                       <TextInput
//                                         name={`educations[${index}].institute_name`}
//                                         value={education.institute_name}
//                                         onChange={(field, value) => {
//                                           props.setFieldValue(field, value);
//                                         }}
//                                         label={'Institute'}
//                                         required
//                                         error={props.errors.educations && props.errors.educations[index]?.institute_name}
//                                         touched={props.touched.educations && props.touched.educations[index]?.institute_name}
//                                       />
//                                     </div>
//                                     <div className="w-full md:w-[48%]">
//                                       <DateInput
//                                         name={`educations[${index}].edu_start_date`}
//                                         value={education.edu_start_date}
//                                         onChange={(field, value) => {
//                                           props.setFieldValue(field, value);
//                                         }}
//                                         label={'Start Date'}
//                                         required
//                                         error={props.errors.educations && props.errors.educations[index]?.edu_start_date}
//                                         touched={props.touched.educations && props.touched.educations[index]?.edu_start_date}
//                                       />
//                                     </div>
//                                     <div className="w-full md:w-[48%]">
//                                       <DateInput
//                                         name={`educations[${index}].edu_end_date`}
//                                         value={education.edu_end_date}
//                                         onChange={(field, value) => {
//                                           props.setFieldValue(field, value);
//                                         }}
//                                         label={'End Date'}
//                                         required
//                                         error={props.errors.educations && props.errors.educations[index]?.edu_end_date}
//                                         touched={props.touched.educations && props.touched.educations[index]?.edu_end_date}
//                                       />
//                                     </div>
//                                     <div className="w-full md:w-[97.5%] bg-[#E5E5F0] flex justify-center items-center h-40">
//                                       <input
//                                         type="file"
//                                         name={`educations[${index}].education_body`}
//                                         onChange={(e) => {
//                                           props.setFieldValue(
//                                             `educations[${index}].education_body`,
//                                             e.currentTarget.files[0]
//                                           );
//                                         }}
//                                       />
//                                     </div>
//                                   </div>
//                                 </React.Fragment>
//                               )
//                             )}
//                           <Col md="12" className="text-left">
//                             <Button
//                               type="button"
//                               className="btn btn-outline-dark my-3 bg-white"
//                               onClick={() => {
//                                 const length = props.values?.educations?.length;
//                                 const index = length ? length : 0;
//                                 props.setFieldValue(
//                                   `educations[${index}]`,
//                                   EmployeeAcademicRecord
//                                 );
//                               }}
//                             >
//                               + Add Another
//                             </Button>
//                           </Col>
//                         </Row>
//                         <Row>
//                           <Col md="12">
//                             <FormGroup className="text-right">
//                               <Button type="submit" className="btn btn-dark">
//                                 Next
//                               </Button>
//                             </FormGroup>
//                           </Col>
//                         </Row>
//                       </Form>
//                     )}
//                   </Formik>
//                 </Col>
//               </Row>
//             )}
//           </CardBody>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     userProfile: state.user.userProfile,
//     token: state.user.token,
//     baseUrl: state.user.baseUrl,
//   };
// };

// export default connect(mapStateToProps)(EducationInformation);
