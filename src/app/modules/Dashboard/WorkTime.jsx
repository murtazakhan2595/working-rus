import React, { useState, useRef, useEffect } from "react";
import { FaPause, FaStop, FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import moment from "moment-timezone";
import { getCountryForTimezone } from "countries-and-timezones";
import Select from "react-select";

const WorkTime = () => {
  // ******************** State Vars ************************ //
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("Africa/Abidjan");
  const [isRunning, setIsRunning] = useState(false);
  const [worldTime, setWorldTime] = useState([{}]);
  const [msg, setMsg] = useState("");
  const [bottomMsg, setBottomMsg] = useState("");
  const [time, setTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const clockLimit = 3;

  // ******************** Stop Watch Start And Reset Functions ************************ //

  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  // const handleReset = () => {
  //   clearInterval(intervalRef.current);
  //   setIsRunning(false);
  //   setTime(0);
  // };

  // *************************** Stop Watch Time And Progress Functions **************************** //

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    // const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")} : ${minutes
      .toString()
      .padStart(2, "0")} 
      `;
    // : ${seconds.toString().padStart(2, "0")}
  };

  const getProgress = () => {
    const progress = (time % 28800000) / 28800000; // Get progress for 8 hours (0 to 1)
    return progress * 360; // Convert to degrees (0 to 360)
  };

  // *************************** Getting Other Cities Lang Code For Flag **************************** //

  const getCountryCodeFromTimezone = (timezone) => {
    const country = getCountryForTimezone(timezone);
    let countryCode = country.id;
    return country ? countryCode.toLocaleLowerCase() : null;
  };

  // *************************** Getting Other Cities and Time **************************** //

  const fetchTimezones = async () => {
    var aryIannaTimeZones = Intl.supportedValuesOf("timeZone");

    let zones = [];
    aryIannaTimeZones.forEach((timeZone) => {
      zones.push(timeZone);
    });
    setTimezones(zones);
  };

  const getTargetTime = (zone) => {
    const targetDate = moment().tz(zone).format("LT");
    return targetDate;
  };

  const deleteTime = (name) => {
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    const indexToRemove = data.filter((item) => item !== name);

    localStorage.setItem("myTimeZones", JSON.stringify(indexToRemove));
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    const existsInArray = data.includes(selectedTimezone);
    if (data.length < clockLimit) {
      if (existsInArray) {
        setBottomMsg("Time Zone Already Exist Choose Another One.");
      } else {
        data.push(selectedTimezone);
        localStorage.setItem("myTimeZones", JSON.stringify(data));
        setModalOpen(false);
        setMsg("");
        setBottomMsg("");
      }
    } else {
      setMsg("You Can Add Only 3 Clocks.");
    }
  };

  // *************************** UseEffect **************************** //

  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = localStorage.getItem("myTimeZones");
      const data = storedData ? JSON.parse(storedData) : [];
      let myZones = [];
      data.map((d) =>
        myZones.push({
          name: d,
          time: getTargetTime(d),
          img: getCountryCodeFromTimezone(d),
        })
      );
      setWorldTime(myZones);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchTimezones();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ml-1 mr-3 md:pr-[25%] md:ml-10">
      <h1 className="font-semibold">Work Time</h1>

      {/* ********************************** Working Time ******************************* */}
      <div
        className="w-56 h-56 drop-shadow-lg shadow-black  z-10 rounded-full border-[12px] border-[#e3e3e3] flex justify-center items-center"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, #25a8e0 ${getProgress()}deg, #fff 0 ${getProgress()}deg, #fff)`,
        }}
      >
        <div className="w-[11.5rem] h-[11.5rem] rounded-full bg-[#e3e3e3] flex  flex-col items-center justify-center text-xl m-0">
          <div>
            <div className="text-xl font-semibold text-[#283b91]">
              {formatTime(time)}
            </div>
            <div className="text-xl tracking-wider  font-semibold text-center mb-5 text-[#283b91]">
              Hrs
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-[0.6rem] py-[0.3rem] bg-[#283b91] text-white rounded-md m-0 text-sm hover:bg-[#283bbf]"
              onClick={handleStartStop}
            >
              {isRunning ? <FaPause /> : <FaStop />}
            </button>
          </div>
        </div>
      </div>
      {/* ********************************** World Times ******************************* */}
      <div className="w-1/4 md:flex hidden">
        <div
          className={`
        ${worldTime.length >= 1 ? "ml-12" : "w-1/2 ml-36"}
          -mt-52  `}
        >
          <div className="flex w-full  h-52 flex-col gap-6 md:mr-0 mr-16">
            {worldTime.map((time, index) => (
              <div key={index} className="z-0">
                <div
                  className={`flex items-center justify-end ${index === 1 ? "" : "pr-4"
                    } rounded-md bg-[#e3e3e3] w-64 py-[0.20rem]`}
                >
                  <img
                    src={`https://flagcdn.com/w320/${time.img}.png`}
                    alt="logo"
                    className="w-8 h-8 border-white border-2 text-xs rounded-full"
                  />
                  <div className="flex items-center flex-col ml-3">
                    <div className="rounded-md font-semibold px-1 w-16 text-center text-xs text-[#283b91] bg-[#f8f8f8]">
                      {time.time}
                    </div>
                    <div className="text-xs mt-0 text-center text-[#283b91]">{`${time.name?.substring(
                      time.name.indexOf("/") + 1
                    )}`}</div>
                  </div>
                  <FaMinus
                    onClick={() => {
                      deleteTime(time.name);
                    }}
                    className="ml-2 mr-2 text-[#283b91] self-start text-sm"
                  />
                </div>
              </div>
            ))}
            <div
              style={{ justifyContent: "right" }}
              className={`${worldTime.length >= 1 ? "w-[70%]" : "w-[180%]"
                } flex items-center`}
            >
              <div
                style={{ justifyContent: "right" }}
                className={`p-1 flex  ${worldTime.length >= 1 ? "w-[21%]" : "w-[51%]"
                  } rounded-md justify-center items-end`}
              >
                <FaPlus
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className="text-[#283b91] p-1 bg-[#e3e3e3] text-center text-xl rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ********************************** Mobile Viwe World Times ******************************* */}
      <div className=" md:hidden flex w-full justify-center h-52 flex-col gap-3">
        {worldTime.map((time, index) => (
          <div key={index} className="z-0">
            <div
              className={`flex items-center justify-center rounded-md bg-[#e3e3e3] py-[0.20rem]`}
            >
              <img
                src={`https://flagcdn.com/w320/${time.img}.png`}
                alt="logo"
                className="w-8 h-8 border-white border-2 text-xs rounded-full"
              />
              <div className="flex items-center flex-col ml-3">
                <div className="rounded-md font-semibold px-1 w-16 text-center text-xs text-[#283b91] bg-[#f8f8f8]">
                  {time.time}
                </div>
                <div className="text-xs mt-0 text-center text-[#283b91]">{`${time.name?.substring(
                  time.name.indexOf("/") + 1
                )}`}</div>
              </div>
              <FaMinus
                onClick={() => {
                  deleteTime(time.name);
                }}
                className="ml-2  text-[#283b91] self-start text-sm"
              />
            </div>
          </div>
        ))}
        <div className="flex justify-center items-center">
          <div className="p-1 flex  w-full rounded-md justify-center items-end">
            <FaPlus
              onClick={() => {
                setModalOpen(true);
              }}
              className="text-[#283b91] p-1 bg-[#e3e3e3] text-center text-xl rounded-md"
            />
          </div>
        </div>
      </div>
      {/* ******************** Model **********************/}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="flex flex-col rounded-lg w-96 h-96 items-center bg-white">
            <div className="flex w-full px-5 my-5 items-center justify-between">
              <h2 className="text-xl font-semibold m-0 justify-self-start">
                Add Time Zone
              </h2>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold px-1 py-1 rounded "
                onClick={() => {
                  setModalOpen(false);
                  setMsg("");
                  setBottomMsg("");
                }}
              >
                <IoClose />
              </button>
            </div>
            {msg ? (
              <div className="flex justify-center items-center p-5 border rounded-lg mt-5">
                {msg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full px-5  mt-5">
                <div className=" mb-3">
                  <label htmlFor="timezone" className="mr-2  mb-3">
                    Select Timezone:
                  </label>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={timezones[0]}
                    isClearable
                    isSearchable
                    onChange={(e) => {
                      setSelectedTimezone(e.value);
                    }}
                    options={timezones.map((timezone) => ({
                      value: timezone,
                      label: timezone,
                    }))}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Time Zone
                </button>
              </form>
            )}
            {bottomMsg && (
              <div className="flex justify-center items-center p-5 border rounded-lg mt-5">
                {bottomMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTime;
