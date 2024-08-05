import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import {  useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import { connect } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { Collapse, Button, CardBody, Card } from "reactstrap";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineMail } from "react-icons/md";



const MyTeams =({userProfile, employees})=>{
  const [teamMembers, setTeamMembers] = useState([]);
   const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const user  = employees.find((emp) => emp.value === userProfile.id)
      try{
        const response =await getEmployeeCustomList({
          filterData: { department_name: user.department_name },
        });
        if(response){
          setTeamMembers(response);
        }
      }catch(err){
        console.error(err)
      }
    }
    fetchData()
    }, [userProfile, employees]);
     const toggleCollapse = (index) => {
       setOpenIndex(openIndex === index ? null : index);
     };

  return (
    <div>
      <div className="px-[14px] py-6 bg-white rounded-md min-h-[470px]">
        <div className="flex flex-col gap-6">
          <header className="justify-between items-center inline-flex w-full">
            <div className="text-[#323233] text-lg font-normal leading-tight">
              My team
            </div>
            <div className="justify-start items-center gap-1 flex">
              <Link to="/my-team">
                <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
                  <div className="grow my-auto">View All</div>
                  <FaChevronRight size={11} />
                </div>
              </Link>
            </div>
          </header>
          <div className="overflow-y-auto no-scrollbar max-h-[362px]">
            {teamMembers.count > 0 &&
              teamMembers.results.map((member, index) => (
                <RenderTeamMembers
                  key={index}
                  teamMemeber={member}
                  isOpen={openIndex === index}
                  toggle={() => toggleCollapse(index)}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );

}

const RenderTeamMembers = ({ teamMemeber, isOpen, toggle }) => {
  return (
    <div>
      <div
        className="flex items-center justify-between mt-2.5"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center gap-2 text-[#5c5e64] text-sm font-normal">
            <div
              className={`${getRandomColor(
                teamMemeber.first_name?.charAt(0)
              )} text-[#FAFBFC] flex font-semibold text-md items-center justify-center rounded-full w-10 h-10`}
              style={{ minWidth: "40px" }}
            >
              {teamMemeber.first_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-col justify-start items-start gap-[5px] inline-flex">
              <div className="text-[#323233] text-sm font-bold capitalize">{`${teamMemeber.first_name} ${teamMemeber.last_name}`}</div>
              <div className="justify-start items-start gap-[5px] inline-flex">
                <div className="text-[#5c5e64] text-[11px] font-normal ">
                  <DesignationName value={teamMemeber.department_position} />
                </div>
                {/* <div className="text-[#5c5e64] text-[11px] font-normal ">|</div>
            <div className="text-[#5c5e64] text-[11px] font-normal "></div> */}
              </div>
            </div>
          </div>
        </div>
        {isOpen ? (
          <FaChevronUp className="text-sm" />
        ) : (
          <FaChevronDown className="text-sm" />
        )}
      </div>
      {isOpen && (
        <Card className="p-0">
          <CardBody className="p-2 flex items-center justify-end">
            <div className=" p-2 bg-[#fafbfc] rounded-[5px] flex-col justify-start items-start inline-flex">
              <div className="flex items-center gap-2">
                <BsTelephone className="text-[#25a8e0]" />
                <p className="text-[#5c5e64] text-[10px] font-normal  leading-snug">
                  Phone: {teamMemeber.mobile_no}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <MdOutlineMail className="text-[#25a8e0]"/>
                <p className="text-[#5c5e64] text-[10px] font-normal  leading-snug">
                  Email: {teamMemeber.work_email}
                </p>
              </div>
              {/* <div className="flex items-center gap-2">
                <AiOutlineHome />
                <p>home: {}</p>
              </div> */}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    employees: state.emp.employees
  };
};

export default connect(mapStateToProps)(MyTeams);
