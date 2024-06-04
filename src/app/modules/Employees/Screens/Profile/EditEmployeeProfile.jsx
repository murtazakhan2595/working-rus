import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { BankInformation, PersonalInformation } from "./index";

const EditEmployeeProfile = () => {
    const { id } = useParams(); // Get the ID from URL params
    const [currentTab, setCurrentTab] = useState(1);


    return (
        <>
            {currentTab === 1 &&
                <PersonalInformation
                    employeeId={id}
                    nextstep={() => {
                        setCurrentTab(2)
                    }}
                    isEditMode={true}
                />
            }
            {currentTab === 1 &&
                <BankInformation
                    employeeId={id}
                    nextstep={() => {
                        setCurrentTab(2)
                    }}
                    isEditMode={true}
                />
            }
        </>
    );
};

export default EditEmployeeProfile;
