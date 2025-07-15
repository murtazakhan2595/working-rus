import axios from "axios";
import {
  getPersonalInfo,
  getVisaDetails,
  getCVDetails,
  getProfessionalExperiance,
  getAcademicRecord,
  getWorkInformation,
  getBankDetails,
  getCertifications,
  getContactInfo,
  mapEmployeeData,
} from "app/utils/MappingObjects/mapEmployeeData";
import {
  EmployeeCVDetails,
  EmployeeInformation,
  EmployeePersonalInformation,
  EmployeeVisaDetails,
  EmployeeProfessionalExperiance,
  EmployeeDepartmentInfo,
  EmployeeBankDetails,
  EmployeeCertifiation,
  EmployeeContactInformation,
} from "app/utils/Types/Employee";
import { initialState } from "state/slices/UserSlice";
import { toast } from "react-toastify";
import { HandleLogout } from "./general";
import { renderErrorMessages } from "utils/renderErrors";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});

const getEmployeeData = async (employeeId) => {
  try {
    const response = await axios.get(`${baseUrl}/emp/${employeeId}`, {
      headers: headers(),
    });
    const employeeData = await mapEmployeeData(response.data);
    return employeeData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};

const getNewEmployeeCode = async () => {
  try {
    const response = await axios.get(`${baseUrl}/lastemployee`, {
      headers: headers(),
    });
    const value = response.data?.serial_number;
    const [prefix, numericPart] = value?.split("-");
    const incrementedNumber = parseInt(numericPart, 10) + 1;
    const formattedNumber = incrementedNumber.toString().padStart(4, "0");
    const employee = `${prefix}-${formattedNumber}`;
    return employee;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return EmployeeInformation;
};

const getEmployeePersonalInfoData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/emp/${employeeid}`,
        {
          headers: headers(),
        }
      );
      // Assuming response.data is the personal info object
      if (response.status === 200) {
        const employeeData = getPersonalInfo(response.data);
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return EmployeePersonalInformation;
};

const saveEmployeePersonalInfoData = async (employeeId, personalInfo) => {
  if (employeeId) {
    try {
      const response = await axios.patch(
        `${baseUrl}/emp/${employeeId}`,
        personalInfo, // FormData object
        {
          headers: formDataHeader(),
        }
      );

      if (response.status === 200) return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error saving Personal Info data:", error);
      return false;
    }
  }
};

const getEmployeeContactInfo = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/emp/${employeeid}`,
        {
          headers: headers(),
        }
      );
      // Assuming response.data is the personal info object
      if (response.status === 200) {
        const employeeData = getContactInfo(response.data);
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching contact Info data :", error);
    }
  }
  return EmployeeContactInformation;
};

const saveEmployeeContactInfoData = async (employeeid, contactInfo) => {
  if (employeeid) {
    try {
      const response = await axios.patch(
        `${baseUrl}/emp/${employeeid}`,
        contactInfo,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error saving contact Info data :", error);
      return false;
    }
  }
};

const getEmployeeVisaDetailsFiles = async (id) => {
  const responseArray = await Promise.all([
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"passport_copy"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"enter_permit"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"visa_page"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"medical"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_application"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_front"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_back"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"insurance_card"}`,
      { headers: headers() }
    ),
    axios.get(
      `${baseUrl}/attachment/?search={"employee_id":${id},"name":"license_copy"}`,
      { headers: headers() }
    ),
  ]);

  // Construct an object mapping document names to their responses
  const documents = {
    passport_copy: responseArray[0].data?.results[0],
    enter_permit: responseArray[1].data?.results[0],
    visa_page: responseArray[2].data?.results[0],
    medical: responseArray[3].data?.results[0],
    id_application: responseArray[4].data?.results[0],
    id_front: responseArray[5].data?.results[0],
    id_back: responseArray[6].data?.results[0],
    insurance_card: responseArray[7].data?.results[0],
    license_copy: responseArray[8].data?.results[0],
  };

  return documents;
};

export const getEmployeeVisaDetailData = async (employeeid) => {
  if (employeeid) {
    try {
      const documents = await getEmployeeVisaDetailsFiles(employeeid);
      const response = await axios.get(
        `${baseUrl}/employeevisadetail/?search={"employee_id":${employeeid}}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0
        ) {
          const employeeData = getVisaDetails(response.data.results[0]);
          return { ...employeeData, ...documents };
        }
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return {};
};

const saveEmployeeVisaDetailData = async (
  employeeId,
  visaDetail,
  visaDetailsFiles,
  id = null
) => {
  if (employeeId) {
    visaDetail.employee_id = employeeId;

    try {
      // Save or update visa details
      if (id) {
        await axios.patch(`${baseUrl}/employeevisadetail/${id}`, visaDetail, {
          headers: headers(),
        });
      } else {
        await axios.post(`${baseUrl}/employeevisadetail/`, visaDetail, {
          headers: headers(),
        });
      }

      // Process each file in visaDetailsFiles
      for (const key in visaDetailsFiles) {
        if (visaDetailsFiles.hasOwnProperty(key)) {
          const file = visaDetailsFiles[key];
          if (file) {
            const formData = new FormData();
            formData.append("employee_id", employeeId);
            formData.append("name", key);
            formData.append("description", file.description || `${key} file`);
            if (file.document && file.document instanceof File)
              formData.append("document", file.document); // Ensure `file.document` is a `File` or `Blob`

            try {
              // If `id` exists, update the attachment
              if (file?.id) {
                await axios.patch(
                  `${baseUrl}/attachment/${file.id}`,
                  formData,
                  {
                    headers: formDataHeader(),
                  }
                );
              } else {
                // Otherwise, post a new attachment
                await axios.post(`${baseUrl}/attachment/`, formData, {
                  headers: formDataHeader(),
                });
              }
            } catch (error) {
              if (error?.response?.status === 401) {
                HandleLogout();
              }
              console.error(`Error processing attachment '${key}':`, error);
            }
          }
        }
      }
      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error saving visa details:", error);
      return false;
    }
  }
  return false;
};

const getEmployeeCVDetailData = async (employeeid) => {
  if (employeeid) {
    try {
      await axios
        .get(
          `${baseUrl}/attachment/?search={"employee_id":${employeeid},"name":"cv"}`,
          {
            headers: headers(),
          }
        )
        .then((response) => {
          if (
            response.status === 200 &&
            response.data &&
            response.data.length > 0
          ) {
            const employeeData = getCVDetails(response.data[0]);
            return employeeData;
          }
        });
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return EmployeeCVDetails;
};

const saveEmployeeCVDetailData = async (
  baseUrl,
  employeeid,
  token,
  payload
) => {
  if (employeeid) {
    const cv = payload.cv;
    const existingCVId = payload.existingCVId;
    try {
      if (existingCVId) {
        await axios
          .patch(
            `${baseUrl}/attachment/${existingCVId}`,
            { document: cv },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            return true;
          });
      } else {
        await axios
          .post(
            `${baseUrl}/attachment/`,
            {
              employee_id: employeeid,
              name: "cv",
              description: "Curriculum Vitae",
              document: cv,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then(() => {
            return true;
          });
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const getEmployeeProfessionalExperianceData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/experience/?search={"employee_id":${employeeid}}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        const employeeData = await getProfessionalExperiance(
          response?.data?.results
        );
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeProfessionalExperiance];
};

const saveEmployeeProfessionalExperianceData = async (employeeid, payload) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      // Iterate over the experiences and process each as FormData
      await Promise.all(
        payload.map(async (experience, index) => {
          const formData = new FormData();

          // Append fields to FormData
          formData.append("employee_id", employeeid);
          formData.append(
            "exp_organization",
            experience.exp_organization || ""
          );
          formData.append("exp_designation", experience.exp_designation || "");
          formData.append("exp_discription", experience.exp_discription || "");
          formData.append("exp_start_date", experience.exp_start_date || "");
          formData.append("exp_end_date", experience.exp_end_date || "");

          // Append files if present
          if (experience.exp_letter && experience.exp_letter instanceof File) {
            formData.append("exp_letter", experience.exp_letter);
          }
          if (experience.resume && experience.resume instanceof File) {
            formData.append("resume", experience.resume);
          }

          // Call the appropriate API endpoint (PATCH or POST)
          try {
            if (experience?.id) {
              await axios.patch(
                `${baseUrl}/experience/${experience.id}`,
                formData,
                {
                  headers: formDataHeader(),
                }
              );
            } else {
              await axios.post(`${baseUrl}/experience/`, formData, {
                headers: formDataHeader(),
              });
            }

            toast.success(`Experience ${index + 1} updated successfully`, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          } catch (error) {
            if (error?.response?.status === 401) {
              HandleLogout();
            }
            toast.error(`Experience ${index + 1} updated unsuccessfully`, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
            console.error("Error updating experience data:", error);
          }
        })
      );
    } catch (error) {
      console.error("Error processing experiences:", error);
      return false;
    }
  }
  return true;
};

const deleteEmployeeProfessionalExperianceData = async (
  baseUrl,
  employeeid,
  token,
  payload
) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      payload.map(async (experience) => {
        await axios.delete(`${baseUrl}/experience/${experience}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

export const deleteEmployeeCertificateData = async (employeeid, payload) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      payload.map(async (certification) => {
        await axios.delete(`${baseUrl}/certification/${certification}`, {
          headers: formDataHeader(),
        });
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const deleteEmployeeAcademicRecordData = async (
  baseUrl,
  employeeid,
  token,
  payload
) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      payload.map(async (education) => {
        await axios.delete(`${baseUrl}/education/${education}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const getEmployeeAcademicRecordData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/education/?search={"employee_id":${employeeid}}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        const employeeData = getAcademicRecord(response.data?.results);
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeCertifiation];
};

const saveEmployeeAcademicRecordData = async (
  employeeId,
  payloadAttachment
) => {
  if (employeeId && payloadAttachment && payloadAttachment.length > 0) {
    try {
      // Process each education record
      for (const education of payloadAttachment) {
        const formData = new FormData();
        formData.append("employee_id", employeeId);
        formData.append("education_level", education.education_level || "");
        formData.append("program", education.program || "");
        formData.append("institute_name", education.institute_name || "");
        formData.append("edu_start_date", education.edu_start_date || "");
        formData.append("edu_end_date", education.edu_end_date || "");
        // Only append the education_body if it exists
        if (
          education.education_body &&
          education.education_body instanceof File
        ) {
          formData.append("education_body", education.education_body);
        }

        try {
          // If `id` exists, update the record (PATCH)
          if (education?.id) {
            await axios.patch(
              `${baseUrl}/education/${education.id}`,
              formData,
              {
                headers: formDataHeader(),
              }
            );
          }
          // Otherwise, create a new record (POST)
          else {
            await axios.post(`${baseUrl}/education/`, formData, {
              headers: formDataHeader(),
            });
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            HandleLogout();
          }
          toast.error(`Education record update failed`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Error updating education record:", error);
        }
      }

      return true; // All operations completed
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error saving academic records:", error);
    }
  }
  return false; // Return false if no valid data
};

const getEmployeeCerficationData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/certification/?search={"employee_id":${employeeid}}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        const employeeData = getCertifications(response.data?.results);
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeCertifiation];
};

const saveEmployeeCertificationData = async (employeeId, payloadAttachment) => {
  if (employeeId && payloadAttachment && payloadAttachment.length > 0) {
    try {
      // Process each certification record
      for (const certification of payloadAttachment) {
        const formData = new FormData();
        formData.append("employee_id", employeeId);
        formData.append(
          "certification_name",
          certification.certification_name || ""
        );
        formData.append("completion_date", certification.completion_date || "");
        formData.append("expiry_date", certification.expiry_date || "");
        if (
          certification.certification_body &&
          certification.certification_body instanceof File
        ) {
          formData.append(
            "certification_body",
            certification.certification_body || ""
          );
        }
        formData.append(
          "certification_institute",
          certification.certification_institute || ""
        );

        try {
          // If `id` exists, update the record (PATCH)
          if (certification?.id) {
            await axios.patch(
              `${baseUrl}/certification/${certification.id}`,
              formData,
              {
                headers: formDataHeader(),
              }
            );
          }
          // Otherwise, create a new record (POST)
          else {
            await axios.post(`${baseUrl}/certification/`, formData, {
              headers: formDataHeader(),
            });
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            HandleLogout();
          }
          console.error(`Error updating certification:`, error);
          return false;
        }
      }

      return true; // All operations completed
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error saving certifications:", error);
    }
  }
  return false; // Return false if no valid data
};

const getEmployeeWorkInformationData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(`${baseUrl}/emp/${employeeid}`, {
        headers: headers(),
      });
      const employeeData = getWorkInformation(response.data);
      return employeeData;
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching employeee work information data :", error);
    }
  }
  return null;
};

const saveEmployeeWorkInformationData = async (employeeid, payload) => {
  try {
    console.log("payload", payload);
    console.log("employeeid", employeeid);
    if (employeeid) {
      const response = await axios.patch(
        `${baseUrl}/emp/${employeeid}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response?.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/emp/add`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        return response?.data;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

const getEmployeeBankDetailsData = async (baseUrl, employeeid, token) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/employeebanklist/${employeeid}`,
        {
          headers: headers(),
        }
      );

      const employeeData = getBankDetails(response.data);
      return employeeData;
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return EmployeeBankDetails;
};

const saveEmployeeBankDetailsData = async (payload, employeeid) => {
  if (employeeid) {
    try {
      await axios
        .patch(`${baseUrl}/emp/${employeeid}`, payload, {
          headers: headers(),
        })
        .then(() => {
          return true;
        });
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const employeeExit = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/employeeExit`, payload, {
      headers: formDataHeader(),
    });
    if (response.status === 201) {
      return true;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

const getEmployeeExitDataById = async (employeeid) => {
  try {
    let URL = `${baseUrl}/employeeExit`;
    if (employeeid) {
      URL += `?search=${encodeURIComponent(
        JSON.stringify({ employee_id: employeeid })
      )}`;
    }
    const response = await axios.get(URL, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};
const getEmployeeExitData = async (payload) => {
  const filterData = payload?.filterData ?? {};
  try {
    let URL = `${baseUrl}/employeeExit?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    // let URL = `${baseUrl}/employeeExit&?search=${encodeURIComponent(
    //   JSON.stringify(filterData)
    // )}`;
    const response = await axios.get(URL, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};
const updateExitData = async (payload) => {
  if (payload?.id) {
    try {
      let URL = `${baseUrl}/employeeExit/${payload?.id}`;
      const response = await axios.patch(URL, payload, {
        headers: headers(),
      });
      if (response) {
        return response;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }

      console.error("Error fetching Personal Info data :", error);
      return false;
    }
  }
};

const saveEmployeeDocChecklist = async (payload) => {
  // console.log("payload", payload);
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/employeedoclist/${payload.id}`,
        payload,
        {
          headers: {
            ...headers(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/employeedoclist/`,
        payload,
        {
          headers: {
            ...headers(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

const saveEmpoyeeDocBulk = async (payloadArray) => {
  try {
    // Validate input
    if (!Array.isArray(payloadArray)) {
      console.error("Expected an array for saveEmpoyeeDocBulk");
      return false;
    }

    // Use Promise.all to process all documents in parallel
    const results = await Promise.all(
      payloadArray.map((payload) => saveEmployeeDocChecklist(payload))
    );

    // Filter out failed operations (those that returned false)
    const successfulResults = results.filter((result) => result !== false);

    // Return the successful results if there are any
    if (successfulResults.length > 0) {
      return successfulResults;
    } else {
      console.error("No documents were saved successfully");
      return false;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error in bulk document save operation:", error);
    return false;
  }
};
const getDocumentChecklist = async (employeeid) => {
  try {
    const response = await axios.get(
      `${baseUrl}/documentchecklist/?search={"employee_id":${employeeid}}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};

const getDownloadTemplate = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/people/employee-download-template/`,
      {
        headers: headers(),
      }
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};

const uploadEmployeesData = async (formData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/people/employee-upload-file/`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error uploading employees data:", error);
    return error?.response?.data;
  }
};
const updateUploadEmployeesData = async (formData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/people/employee-update-upload-file/`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error uploading employees data:", error);
    return error?.response?.data;
  }
};

const getUserRoles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/userrole`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching user roles:", error);
  }
  return [];
};

const getDepartmentNames = async () => {
  try {
    const response = await axios.get(`${baseUrl}/department`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching department names:", error);
  }
  return [];
};

const getDesignations = async () => {
  try {
    const response = await axios.get(`${baseUrl}/designation`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching designations:", error);
  }
  return [];
};

const getManagerList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/emplistofmanager`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching manager list:", error);
  }
  return [];
};

const getShifts = async () => {
  try {
    const response = await axios.get(`${baseUrl}/shift`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching shifts:", error);
  }
  return [];
};

const getEmployeeDocsChecklist = async (payload) => {
  const filterData = payload?.filterData ?? {};
  try {
    let URL = `${baseUrl}/employeedoclist?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(URL, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};

export const UpdatePassword = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/change-password/ `,
      payload,
      {
        headers: headers(),
      }
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching shifts:", error);
    renderErrorMessages(error?.response?.data);
  }

  return false;
};

const getEmployeeMonthlySummary = async (payload) => {
  const filterData = payload?.filterData ?? {};
  try {
    let URL = `${baseUrl}/emp/monthly-summary/?search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(URL, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
};

export {
  getEmployeeMonthlySummary,
  getDownloadTemplate,
  uploadEmployeesData,
  getDocumentChecklist,
  saveEmployeeDocChecklist,
  getEmployeeData,
  getEmployeePersonalInfoData,
  saveEmployeePersonalInfoData,
  saveEmployeeVisaDetailData,
  saveEmployeeCVDetailData,
  getEmployeeCVDetailData,
  getEmployeeProfessionalExperianceData,
  saveEmployeeProfessionalExperianceData,
  getEmployeeAcademicRecordData,
  saveEmployeeAcademicRecordData,
  saveEmployeeWorkInformationData,
  getEmployeeWorkInformationData,
  getEmployeeBankDetailsData,
  saveEmployeeBankDetailsData,
  getEmployeeCerficationData,
  saveEmployeeCertificationData,
  getEmployeeVisaDetailsFiles,
  deleteEmployeeProfessionalExperianceData,
  deleteEmployeeAcademicRecordData,
  getEmployeeContactInfo,
  saveEmployeeContactInfoData,
  getNewEmployeeCode,
  employeeExit,
  getEmployeeExitData,
  updateExitData,
  getEmployeeExitDataById,
  getUserRoles,
  getDepartmentNames,
  getDesignations,
  getManagerList,
  getShifts,
  getEmployeeDocsChecklist,
  saveEmpoyeeDocBulk,
  updateUploadEmployeesData,
};
