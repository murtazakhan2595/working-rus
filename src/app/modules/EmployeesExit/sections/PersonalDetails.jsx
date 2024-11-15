import { DetailBox } from "components/SheetCardExtension";
import Avatar from "components/ui/Avatar";
import { CardContent, Card, CardHeader, CardTitle } from "components/ui/card";

const PersonalInformation = ({
  personalInfo,
  userData,
}) => {
  return (
    <>
      <Card className="border shadow mb-4">
        <CardHeader>
        <CardTitle>
            Employee Information
            </CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
        <div className="flex flex-col lg:flex-row py-4">
          <div className="md:w-[25%] w-full flex flex-col items-start mb-6 lg:mb-0">
            {userData?.profile_picture?.file || userData?.profile_picture ? (
              <Avatar
              src={
                userData?.profile_picture?.file || userData?.profile_picture
              }
              fallbackText={(userData?.first_name)?.charAt(0)}
              alt="profile"
              className="w-24 h-24"
              />
            ) : (
              <Avatar
              fallbackText={(userData?.first_name)?.charAt(0)}
              alt="profile"
              className="w-24 h-24"
              /> 
            )}

            <div className="font-semibold text-lg">
              {userData.personalInformation?.first_name}{" "}
              {userData.personalInformation?.last_name}
            </div>
            <div className="opacity-70">
              ID: TXB-{userData.id?.toString().padStart(4, "0")}
            </div>
          </div>
          {/* Personal Info Sections */}
          <div className="w-full flex flex-col lg:flex-row gap-8 overflow-visible no-scrollbar whitespace-break-spaces">
            {personalInfo.map((infoGroup, index) => (
              <div key={index} className="w-full flex flex-col gap-4">
                {infoGroup.map((info) => (
                  <DetailBox
                    label={info?.title}
                    value={info?.data || "-----"}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PersonalInformation;
