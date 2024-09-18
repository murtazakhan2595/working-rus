import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getEmployeePayroll, getEmployeePayrollById } from "../../../hooks/payroll";
import { useNavigate } from "react-router-dom";



const MyPayroll = ({userProfile})=>{
  const [payroll, setPayroll] = useState({})
     const navigate = useNavigate();
  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await getEmployeePayroll({filterData:{employee_id: userProfile.id}});
        setPayroll(response?.results[0])
        console.log("response", response);
        if(response){
          navigate(
            `/payroll/${response.results[0].id}?employeeID=${userProfile.id}&fromMyPayroll=true`
          );
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      }
    };
    fetchPayroll();
  },[])
  return <div> 
  {
    (!payroll ||  !payroll.id) && <div> No payroll data found</div>
  }
  
  </div>
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyPayroll);
