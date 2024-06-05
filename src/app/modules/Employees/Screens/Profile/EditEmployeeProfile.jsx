import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { BankInformation, PersonalInformation, ExperienceInformation } from "./index";


const EditEmployeeProfile = () => {
    const { id } = useParams(); // Get the ID from URL params
    const [currentTab, setCurrentTab] = useState(4);


    return (
        <>
            {currentTab === 1 &&
                <PersonalInformation
                    employeeId={id}
                    nextstep={() => {
                        setCurrentTab(currentTab + 1)
                    }}
                    isEditMode={true}
                />
            }
            {currentTab === 3 &&
                <BankInformation
                    employeeId={id}
                    nextstep={() => {
                        setCurrentTab(currentTab + 1)
                    }}
                    isEditMode={true}
                />
            }
            {
                currentTab === 4 &&
                <ExperienceInformation
                    employeeId={id}
                    nextstep={() => {
                        setCurrentTab(currentTab + 1)
                    }}
                    isEditMode={true} />
            }
        </>
    );
};

export default EditEmployeeProfile;
