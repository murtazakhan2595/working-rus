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
            }).then((response) => {
                return response.status;
            });

        } catch (error) {
            console.error("Error fetching Personal Info data :", error);
            return false;
        }
    }
}
const getEmployeeVisaDetailsFiles = async (baseUrl, id, token) => {
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const responseArray = await Promise.all([
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"passport_copy"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"enter_permit"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"visa_page"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"medical"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_application"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_front"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"id_back"}`, { headers }),
        axios.get(`${baseUrl}/attachment/?search={"employee_id":${id},"name":"insurance_card"}`, { headers })
    ]);

    // Construct an object mapping document names to their responses
    const documents = {
        passport_copy: responseArray[0].data[0],
        enter_permit: responseArray[1].data[0],
        visa_page: responseArray[2].data[0],
        medical: responseArray[3].data[0],
        id_application: responseArray[4].data[0],
        id_front: responseArray[5].data[0],
        id_back: responseArray[6].data[0],
        insurance_card: responseArray[7].data[0]
    };

    return documents;
}

const getEmployeeVisaDetailData = async (baseUrl, employeeid, token) => {
    if (employeeid) {
        try {
            await axios.get(`${baseUrl}/employeevisadetail/?search={\"employee_id\":${employeeid}}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }).then(async (response) => {
                if (response.status === 200) {
                    if (response.data && response.data.results && response.data.results.length > 0) {
                        const employeeData = getVisaDetails(response.data.results[0]);
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
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    if (employeeid) {
        try {
            if (visaDetail.id) {
                await axios.patch(`${baseUrl}/employeevisadetail/${visaDetail.id}`, visaDetail, { headers })
            } else {
                await axios.post(`${baseUrl}/employeevisadetail/`, visaDetail, { headers, })
            }

            for (const key in visaDetailsFiles) {
                if (visaDetailsFiles.hasOwnProperty(key)) {
                    const file = visaDetailsFiles[key];
                    if (file?.id) {
                        await axios.patch(`${baseUrl}/attachment/${file?.id}`, {
                            employee_id: employeeid,
                            name: file.name,
                            description: `${file.name} file`,
                            document: {
                                name: file.document.name,
                                data: file.document.data,
                            },
                        }, { headers });
                    } else {
                        // Otherwise, post a new attachment
                        await axios.post(`${baseUrl}/attachment/`, {
                            employee_id: employeeid,
                            name: file.name,
                            description: `${file.name} file`,
                            document: file,
                        }, { headers });
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
                    const employeeData = getCVDetails(response.data[0]);
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
            const response = await axios.get(`${baseUrl}/experience/?search={\"employee_id\":${employeeid}}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
            if (response.status === 200) {
                const employeeData = await getProfessionalExperiance(response.data);
                console.log(employeeData);
                return employeeData;
            }

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

const deleteEmployeeProfessionalExperianceData = async (baseUrl, employeeid, token, payload) => {
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
                certification.employee_id = employeeid
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
    getEmployeeVisaDetailsFiles,
    deleteEmployeeProfessionalExperianceData,
}