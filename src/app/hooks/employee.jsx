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
} from "../utils/MappingObjects/mapEmployeeData";
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
} from "../utils/Types/Employee";
import { initialState } from "state/slices/UserSlice";
import { toast } from "react-toastify";
import { handleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getEmployeeData = async (employeeid) => {
  try {
    const response = await axios.get(`${baseUrl}/emp/${employeeid}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
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
    const [prefix, numericPart] = value?.split('-');
    const incrementedNumber = parseInt(numericPart, 10) + 1;
    const formattedNumber = incrementedNumber.toString().padStart(4, '0');
    const employee = `${prefix}-${formattedNumber}`;
    return employee;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return EmployeeInformation;
};

const getEmployeePersonalInfoData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/employeeInformationlist/${employeeid}`,
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
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return EmployeePersonalInformation;
};

const saveEmployeePersonalInfoData = async (employeeid, personalInfo) => {
  if (employeeid) {
    try {
      const response = await axios.patch(
        `${baseUrl}/emp/${employeeid}`,
        personalInfo,
        {
          headers: headers(),
        }
      );

      if (response.status === 200) return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
      return false;
    }
  }
};

const getEmployeeContactInfo = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/employeeInformationlist/${employeeid}`,
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
        handleLogout();
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
        handleLogout();
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
  };

  return documents;
};

const getEmployeeVisaDetailData = async (employeeid) => {
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
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return {};
};

const saveEmployeeVisaDetailData = async (
  employeeid,
  visaDetail,
  visaDetailsFiles
) => {
  if (employeeid) {
    visaDetail.employee_id = employeeid;
    try {
      if (visaDetail.id) {
        await axios.patch(
          `${baseUrl}/employeevisadetail/${visaDetail.id}`,
          visaDetail,
          { headers: headers() }
        );
      } else {
        await axios.post(`${baseUrl}/employeevisadetail/`, visaDetail, {
          headers: headers(),
        });
      }

      for (const key in visaDetailsFiles) {
        if (visaDetailsFiles.hasOwnProperty(key)) {
          const file = visaDetailsFiles[key];
          if (file) {
            if (file?.id) {
              await axios.patch(
                `${baseUrl}/attachment/${file?.id}`,
                {
                  employee_id: employeeid,
                  name: key,
                  description: `${file.name} file`,
                  document: {
                    name: file.document.name,
                    file: file.document.file,
                  },
                },
                { headers: headers() }
              );
            } else {
              // Otherwise, post a new attachment
              await axios.post(
                `${baseUrl}/attachment/`,
                {
                  employee_id: employeeid,
                  name: key,
                  description: `${file.name} file`,
                  document: file,
                },
                { headers: headers() }
              );
            }
          }
        }
      }
      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
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
        handleLogout();
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
        handleLogout();
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
      console.log(response, "HELLO KASHIF")
      if (response.status === 200) {
        const employeeData = await getProfessionalExperiance(response?.data?.results);
        return employeeData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeProfessionalExperiance];
};

const saveEmployeeProfessionalExperianceData = async (employeeid, payload) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      payload.map(async (experience, index) => {
        experience.employee_id = employeeid;
        try {
          if (experience?.id) {
            await axios.patch(
              `${baseUrl}/experience/${experience.id}`,
              experience,
              {
                headers: headers(),
              }
            );
          } else {
            await axios.post(`${baseUrl}/experience/`, experience, {
              headers: headers(),
            });
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            handleLogout();
          }
          toast.error(`Experience ${index + 1} updated unsuccessfully`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          console.error("Error fetching Personal Info data :", error);
        }
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
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
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

// const deleteEmployeeAcademicRecordData = async (
//   baseUrl,
//   employeeid,
//   token,
//   payload
// ) => {
//   if (employeeid && payload && payload.length > 0) {
//     try {
//       payload.map(async (certification) => {
//         await axios.delete(`${baseUrl}/certification/${certification}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//       });
//     } catch (error) {
//       if (error?.response?.status === 401) {
//         handleLogout();
//       }
//       console.error("Error fetching Personal Info data :", error);
//     }
//   }
//   return false;
// };

const deleteEmployeeCertificateData = async (
  baseUrl,
  employeeid,
  token,
  payload
) => {
  if (employeeid && payload && payload.length > 0) {
    try {
      payload.map(async (certification) => {
        await axios.delete(`${baseUrl}/certification/${certification}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
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
        handleLogout();
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
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeCertifiation];
};

const saveEmployeeAcademicRecordData = async (
  employeeid,
  payloadAttachment
) => {
  if (employeeid && payloadAttachment && payloadAttachment.length > 0) {
    try {
      payloadAttachment.map(async (education) => {
        education.employee_id = employeeid;
        if (education?.id) {
          await axios.patch(`${baseUrl}/education/${education.id}`, education, {
            headers: headers(),
          });
        } else {
          await axios.post(`${baseUrl}/education/`, education, {
            headers: headers(),
          });
        }
      });

      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
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
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return [EmployeeCertifiation];
};

const saveEmployeeCertificationData = async (employeeid, payloadAttachment) => {
  if (employeeid && payloadAttachment && payloadAttachment.length > 0) {
    try {
      payloadAttachment.map(async (certification) => {
        certification.employee_id = employeeid;
        try {
          if (certification?.id) {
            await axios.patch(
              `${baseUrl}/certification/${certification.id}`,
              certification,
              {
                headers: headers(),
              }
            );
          } else {
            await axios.post(`${baseUrl}/certification/`, certification, {
              headers: headers(),
            });
          }
        } catch (error) {
          if (error?.response?.status === 401) {
            handleLogout();
          }
          console.error("Error fetching Personal Info data :", error);
          return false;
        }
      });

      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const getEmployeeWorkInformationData = async (employeeid) => {
  if (employeeid) {
    try {
      const response = await axios.get(
        `${baseUrl}/emp/${employeeid}`,
        {
          headers: headers(),
        }
      );
      const employeeData = getWorkInformation(response.data);
      return employeeData;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching employeee work information data :", error);
    }
  }
  return null;
};

const saveEmployeeWorkInformationData = async (employeeid, payload) => {
  try {
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
      handleLogout();
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
          headers: headers()
        }
      );

      const employeeData = getBankDetails(response.data);
      return employeeData;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return EmployeeBankDetails;
};

const saveEmployeeBankDetailsData = async (
  baseUrl,
  employeeid,
  token,
  payload
) => {
  if (employeeid) {
    try {
      await axios
        .patch(`${baseUrl}/emp/${employeeid}`, payload, {
         headers: headers()
        })
        .then(() => {
          return true;
        });
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
  }
  return false;
};

const employeeExit =async(payload)=>{
  console.log(`${baseUrl}/employeeExit/`);
  try{
    const response = await axios.post(`${baseUrl}/employeeExit`, payload, {
      headers: headers(),
    });
    if(response.status===201){
      return true
    }
  }catch(error){
    if(error?.response?.status === 401){
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false
  }
}

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
        return response
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
}
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
        return response
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
    }
}
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
        handleLogout();
      }

      console.error("Error fetching Personal Info data :", error);
      return false;
    }
  }
}

export {
  getEmployeeData,
  getEmployeePersonalInfoData,
  saveEmployeePersonalInfoData,
  getEmployeeVisaDetailData,
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
  deleteEmployeeCertificateData,
  employeeExit,
  getEmployeeExitData,
  updateExitData,
  getEmployeeExitDataById,
};
