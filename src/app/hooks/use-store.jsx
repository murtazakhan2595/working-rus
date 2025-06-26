import { useState, useEffect } from "react";
import axios from "axios";
import { HandleLogout, baseUrl, headers } from "./general";
import { renderErrorMessages } from "utils/renderErrors";
import { mapEmployeeInfoData } from "app/utils/MappingObjects/mapEmployeeData";

export const useStore = (store, callback) => {
  const result = store(callback);
  const [data, setData] = useState();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export const getEmployeeInfoData = async (employee_id, key) => {
  // key is used return specific if required fron the employee Info
  try {
    const response = await axios.get(
      `${baseUrl}/employeeInformationlist/${employee_id}`,
      {
        headers: headers(),
      }
    );
    const employeeData = await mapEmployeeInfoData(response.data);
    if (key) return employeeData[key];
    return employeeData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};
