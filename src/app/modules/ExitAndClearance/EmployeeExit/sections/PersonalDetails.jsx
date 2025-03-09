import { DetailBox } from "components/SheetCardExtension";
import Avatar from "components/ui/Avatar";
import { CardContent, Card, CardHeader, CardTitle } from "components/ui/card";
import { useSelector } from "react-redux";
import {
  DepartmentName,
  DesignationName,
  ManagerName,
  getCountryFullName,
  getWorkPlaceType,
} from "utils/getValuesFromTables";

const PersonalInformation = () => {
  const {
    profile_picture,
    name_initials,
    name,
    serial_number,
    department_name,
    department_position,
    direct_report,
    employee_work_type,
    phone_no,
  } = useSelector((state) => state.emp.user_details);

  const personalInfo = [
    { title: "Name", data: name },
    { title: "Department", data: <DepartmentName value={department_name} /> },
    {
      title: "Designation",
      data: <DesignationName value={department_position} />,
    },
    { title: "Report To", data: <ManagerName value={direct_report} /> },
    {
      title: "Work Type",
      data: getWorkPlaceType(employee_work_type),
    },
    {
      title: "Contact No",
      data: phone_no,
    },
  ];
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle>
          <div className="text-lg text-neutral-1100">Employee Information</div>
        </CardTitle>
      </CardHeader>
      <hr />
      <CardContent>
        <div className="flex flex-col lg:flex-row py-4">
          <div className="md:w-[25%] w-full flex flex-col items-start mb-6 lg:mb-0">
            {profile_picture ? (
              <Avatar
                src={profile_picture}
                fallbackText={name_initials}
                alt="profile"
                className="w-24 h-24"
              />
            ) : (
              <Avatar
                fallbackText={name_initials}
                alt="profile"
                className="w-24 h-24"
              />
            )}

            <div className="text-sm text-neutral-900">ID: {serial_number}</div>
          </div>
          {/* Personal Info Sections */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-visible no-scrollbar whitespace-break-spaces">
            {personalInfo.map((info, index) => (
              <DetailBox
                label={info?.title}
                value={info?.data || "-----"}
                orientation="horizontal"
                key={index}
                className=""
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
