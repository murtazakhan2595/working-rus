import noWifi from "../../../assets/images/no-wifi.png";

const OfflinePopUp = ({ onClose }) => {
  // handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-white shadow-md lg:px-10 lg:py-8 w-[100%] h-[63%] px-10 py-6 flex flex-col
            items-center justify-between absolute md:w-[50%] md:h-[66%] lg:w-[42%] lg:h-[60%] xl:w-[30%] xl:h-[59%] mt-6"
      >
        <div className="flex flex-col justify-center items-center">
        <img src={noWifi} alt="wifi here" className="w-[100px] h-[100px]" />
        <p className="text-base text-center lg:text-xl font-semibold">
          It looks like you're not connected to the internet.
        </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-center font-semibold my-4">
            Or you're just temporarily disconnected.
          </p>
          <button
            className="bg-baseBlue tracking-widest text-white px-4 py-1.5 rounded-md"
            onClick={handleRefresh}
          >
            Refresh Now
          </button>
        </div>
        {/* <div
          className="absolute top-4 right-4 text-white bg-[#ECECEC] rounded-full p-[2px] cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 className="text-sm" />
        </div> */}
      </div>
    </div>
  );
};

export default OfflinePopUp;
