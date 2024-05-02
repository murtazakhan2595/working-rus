import axios from "axios";
import {
    mapEmployeeData, getPersonalInfo, getVisaDetails, getCVDetails, getProfessionalExperiance, getAcademicRecord,
    getDepartmentInfo,
    getBankDetails,
} from '../utils/MappingObjects/mapEmployeeData'
import {
    EmployeeCVDetails, Employee, EmployeePersonalInformation, EmployeeVisaDetails, EmployeeProfessionalExperiance, EmployeeAcademicRecord,
    EmployeeDepartmentInfo,
    EmployeeBankDetails,
} from '../utils/Types/Employee'


const getEmployeeData = async (baseUrl, employeeid, headers) => {
    try {
        const response = await axios.get(`${baseUrl}/emp/${employeeid}`, {
            headers,
        });
        const employeeData = mapEmployeeData(response.data);
        return employeeData;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
    return Employee;
}

const getEmployeePersonalInfoData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeeInformationlist/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                const employeeData = getPersonalInfo(response.data);
                console.log(employeeData);
                return employeeData;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeePersonalInformation;
}

const saveEmployeePersonalInfoData = async (baseUrl, employeeid, token, personalInfo) => {
    if (employeeid) {
        try {
            await axios.patch(`${baseUrl}/emp/${employeeid}`, personalInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeVisaDetailData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeevisadetail?employee_id=${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    const employeeData = getVisaDetails(response.data);
                    console.log(employeeData);
                    return employeeData;
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeVisaDetails;
}

const saveEmployeeVisaDetailData = async (baseUrl, employeeid, token, visaDetail) => {
    if (employeeid) {
        try {
            await axios.patch(`${baseUrl}/emp/${employeeid}`, visaDetail, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeCVDetailData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeevisadetail/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    const employeeData = getCVDetails(response.data);
                    console.log(employeeData);
                    return employeeData;
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeCVDetails;
}

const saveEmployeeCVDetailData = async (baseUrl, employeeid, token, cv) => {
    if (employeeid) {
        try {
            await axios.post(`${baseUrl}/attachment/`, {
                employee_id: employeeid,
                name: "cv",
                description: "Curriculum Vitae",
                document: cv,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeProfessionalExperianceData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/experience/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    const employeeData = getProfessionalExperiance(response.data);
                    console.log(employeeData);
                    return employeeData;
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return [EmployeeProfessionalExperiance];
}

const saveEmployeeProfessionalExperianceData = async (baseUrl, employeeid, token, payload) => {
    if (employeeid && payload && payload.length > 0) {
        try {
            payload.map(async (experience) => {
                experience.employee_id = employeeid
                await axios.post(`${baseUrl}/experience/`, experience, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            });
        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeAcademicRecordData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/experience/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    const employeeData = getAcademicRecord(response.data);
                    console.log(employeeData);
                    return employeeData;
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return [EmployeeAcademicRecord];
}

const saveEmployeeAcademicRecordData = async (baseUrl, employeeid, token, payload, payloadAttachment) => {
    let acadmicDoc = {
        employee_id: employeeid,
        name: "acadmicDoc",
        description: "Acadmic Document",
        document: payload.certificate,
    };
    if (employeeid) {
        try {
            await axios.patch(`${baseUrl}/education/${employeeid}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

            await axios.post(`${baseUrl}/attachment/`, acadmicDoc, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

            payloadAttachment.map(async (crt) => {
                let certification = {
                    employee_id: employeeid,
                    certification_name: crt.certification_name,
                    completion_date: crt.completion_date,
                    certification_body: crt.certification_body,
                    expiry_date: crt.expiry_date,
                };
                await axios.post(`${baseUrl}/certification/`, certification, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }).then(() => {
                    return true;
                });
            });

            return false;

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeDepartemtInfoData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeeInformationlist/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                const employeeData = getDepartmentInfo(response.data);
                console.log(employeeData);
                return employeeData;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeDepartmentInfo;
}

const saveEmployeeDepartemtInfoData = async (baseUrl, employeeid, token, payload) => {
    if (employeeid) {
        try {
            await axios.patch(`${baseUrl}/emp/${employeeid}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeBankDetailsData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeebanklist/${employeeid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                const employeeData = getBankDetails(response.data);
                console.log(employeeData);
                return employeeData;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeBankDetails;
}

const saveEmployeeBankDetailsData = async (baseUrl, employeeid, token, payload) => {
    if (employeeid) {
        try {
            await axios.patch(`${baseUrl}/emp/${employeeid}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(() => {
                return true;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
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
    saveEmployeeDepartemtInfoData,
    getEmployeeDepartemtInfoData,
    getEmployeeBankDetailsData,
    saveEmployeeBankDetailsData,
}