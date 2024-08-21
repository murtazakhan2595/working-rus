import { getEmployeeData } from "app/hooks/employee";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { useSelector } from "react-redux";

const ProfileManagement = () => {
  const [profileData, setProfileData] = useState({});
  const userProfile = useSelector((state) => state.user.userProfile);
  console.log(userProfile);

  const fetchData = async () => {
    try {
      const response = await getEmployeeData(userProfile.id);
      console.log(response)
      setProfileData({
        name: `${response?.first_name} ${response?.last_name}`,
        id: userProfile.id,
        contactNumber: `${response?.country_code} ${response?.mobile_no}`,
        emailAddress: response?.email,
        image: response?.profile_picture?.file || response?.profile_picture,
      });
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    if (userProfile && userProfile.id) {
      fetchData();
    }
  }, [userProfile]);

  return (
    <section className="flex flex-col p-[18px] text-sm bg-white rounded-md">
      <header className="flex gap-5 justify-between text-lg text-zinc-800">
        <div className="text-[#323233] text-lg font-normal ">
          Profile Management
        </div>

        <button>
          <CiEdit className="text-2xl cursor-pointer opacity-80" />
        </button>
      </header>

      <div className="flex flex-col mt-6">
        <div className="flex flex-col pb-4 border-b border-zinc-300 ">
          <div className="flex gap-4">
            <img
              loading="lazy"
              src={profileData?.image}
              className="shrink-0 aspect-square w-[76px] rounded-full"
              alt="Profile"
            />
            <div className="flex flex-col my-auto">
              <div className="font-bold text-zinc-800">{profileData?.name}</div>
              <div className="mt-1.5 font-medium text-zinc-600 text-opacity-80">
                ID: TXB-{profileData?.id?.toString().padStart(4, "0")}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-sm ">
          <div className="flex self-start mt-1 h-10">
            <div className="  text-zinc-600 w-1/2">Contact Number</div>
            <div className="my-auto  text-zinc-800 w-1/2">
              {profileData?.contactNumber}
            </div>
          </div>
          <div className="flex self-start mt-1 h-10">
            <div className=" text-zinc-600 w-1/2">Email Address</div>
            <div className="my-auto  text-zinc-800 w-1/2">
              {profileData?.emailAddress}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileManagement;
