import axios from "axios";
import {
    mapEmployeeData, getPersonalInfo, getVisaDetails, getCVDetails, getProfessionalExperiance, getAcademicRecord,
    getDepartmentInfo,
    getBankDetails,
    getCertifications,
} from '../utils/MappingObjects/mapEmployeeData'
import {
    EmployeeCVDetails, Employee, EmployeePersonalInformation, EmployeeVisaDetails, EmployeeProfessionalExperiance, EmployeeAcademicRecord,
    EmployeeDepartmentInfo,
    EmployeeBankDetails,
    EmployeeCertifiation,
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
            await axios.get(`${baseUrl}/employeevisadetail/?search={\"employee_id\":${employeeid}}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    if (response.data && response.data.result && response.data.result[0]) {
                        const employeeData = getVisaDetails(response.data.result[0]);
                        console.log(employeeData);
                        return employeeData;
                    }
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeVisaDetails;
}

const saveEmployeeVisaDetailData = async (baseUrl, employeeid, token, visaDetail, visaDetailsFiles) => {
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

            for (const key in visaDetailsFiles) {
                if (visaDetailsFiles.hasOwnProperty(key)) {
                    const files = visaDetailsFiles[key];
                    for (const file of files) {
                        await axios.post(`${baseUrl}/attachment/`, {
                            employee_id: employeeid,
                            name: key,
                            description: `${key} File`,
                            document: {
                                name: file.name,
                                data: file.data,
                            },
                        }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }).then(() => {
                            return true;
                        });
                    }

                }
            }

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeCVDetailData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/attachment/?search={"employee_id":${employeeid},"name":"cv"}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200 && response.data && response.data.length > 0) {
                    const employeeData = getCVDetails(response.data[1]);
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

const saveEmployeeCVDetailData = async (baseUrl, employeeid, token, payload) => {
    if (employeeid) {
        const cv = payload.cv;
        const existingCVId = payload.existingCVId
        try {
            if (existingCVId) {
                await axios.patch(`${baseUrl}/attachment/${existingCVId}`, { document: cv, }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }).then(() => {
                    return true;
                });
            } else {
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
            }

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeProfessionalExperianceData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/experience/?search={\"employee_id\":${employeeid}}`, {
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
                if (experience.hasOwnProperty("id")) {
                    await axios.patch(`${baseUrl}/experience/${experience.id}`, experience, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                } else {
                    await axios.post(`${baseUrl}/experience/`, experience, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                }
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
            await axios.get(`${baseUrl}/education/?search={\"employee_id\":${employeeid}}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(async (response) => {
                if (response.status === 200 && response.data && response.data.length > 0) {
                    await axios.get(`${baseUrl}/attachment/?search={"employee_id":${employeeid},"name":"acadmicDoc"}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }).then(res => {
                        const academicRecord = response.data[0]
                        if (res.status === 200 && res.data && res.data.length > 0)
                            academicRecord.certificate = res.data[0]
                        const employeeData = getAcademicRecord(academicRecord);
                        console.log(employeeData);
                        return employeeData;
                    });
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return EmployeeAcademicRecord;
}

const saveEmployeeAcademicRecordData = async (baseUrl, employeeid, token, payload, academicDoc) => {

    if (employeeid) {
        try {
            if (payload.id) {
                await axios.patch(`${baseUrl}/education/${payload.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
            } else {
                delete payload.id
                await axios.post(`${baseUrl}/education/`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
            }
            if (academicDoc) {
                if (payload.certificate?.hasOwnProperty("id")) {
                    await axios.patch(`${baseUrl}/attachment/${payload.certificate.id}`, academicDoc, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                }
                else {
                    await axios.post(`${baseUrl}/attachment/`, academicDoc, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                }
            }

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return false;
}

const getEmployeeCerficationData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/certification/?search={\"employee_id\":${employeeid}}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.status === 200) {
                    const employeeData = getCertifications(response.data);
                    console.log(employeeData);
                    return employeeData;
                }
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
        }
    }
    return [EmployeeCertifiation];
}

const saveEmployeeCertificationData = async (baseUrl, employeeid, token, payloadAttachment) => {
    if (employeeid) {
        try {
            payloadAttachment.map(async (certification) => {
                certification.employee_id=employeeid
                if (certification.hasOwnProperty("id")) {
                    await axios.patch(
                        `${baseUrl}/certification/${certification.id}`,
                        certification,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                   
                } else {
                    await axios.post(`${baseUrl}/certification/`, certification, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                }
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
    getEmployeeCerficationData,
    saveEmployeeCertificationData,
}