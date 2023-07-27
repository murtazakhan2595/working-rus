import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStop, FaPlus, FaMinus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import moment from "moment-timezone";
import { getCountryForTimezone } from 'countries-and-timezones'

const WorkTime = () => {
  // ******************** State Vars ************************ //
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [worldTime, setWorldTime] = useState([{}]);
  const [msg, setMsg] = useState("");
  const [time, setTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const clockLimit = 3 

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

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
  };

  // *************************** Stop Watch Time And Progress Functions **************************** //

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    return `${hours.toString().padStart(2, "0")} : ${minutes
      .toString()
      .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    const progress = (time % 28800000) / 28800000; // Get progress for 8 hours (0 to 1)
    return progress * 360; // Convert to degrees (0 to 360)
  };

  // *************************** Getting Other Cities Lang Code For Flag **************************** //


  const getCountryCodeFromTimezone = (timezone) => {
    const country = getCountryForTimezone(timezone);
    let countryCode = country.id
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
    const targetDate = moment().tz(zone).format("LTS");
    return targetDate;
  };

  const deleteTime = (name) => {
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    const indexToRemove = data.filter((item) => item !== name);

    localStorage.setItem("myTimeZones", JSON.stringify(indexToRemove));
    setMsg("")
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    if (data.length < clockLimit){
      data.push(selectedTimezone);
      localStorage.setItem("myTimeZones", JSON.stringify(data));
      setModalOpen(false);
    }
    else{
      setMsg("You Can Add Only 3 Clocks.")
    }
  };

  // *************************** UseEffect **************************** //

  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = localStorage.getItem("myTimeZones");
      const data = storedData ? JSON.parse(storedData) : [];
      let myZones = [];
      data.map((d) => myZones.push({ name: d, time: getTargetTime(d) ,img : getCountryCodeFromTimezone(d)}));
      setWorldTime(myZones);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchTimezones();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center ml-1 mr-3">
      <div
        className="w-64 drop-shadow-lg shadow-black xl h-64 z-10 rounded-full border-[10px] border-[#e3e3e3] flex justify-center items-center"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, #25a8e0 ${getProgress()}deg, #fff 0 ${getProgress()}deg, #fff)`,
        }}
      >
        <div className="w-56 h-56 rounded-full bg-[#e3e3e3] flex  flex-col items-center justify-center text-xl m-0">
          <div>
            <div className="text-2xl font-semibold text-[#283b91]">
              {formatTime(time)}
            </div>
            <div className="text-xl font-semibold text-center mb-8 text-[#283b91]">
              Hrs
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              className="px-3 py-2 bg-[#283b91] text-white rounded-md text-sm hover:bg-[#283bbf]"
              onClick={handleStartStop}
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </button>
            <button
              className="px-3 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              onClick={handleReset}
            >
              <FaStop />
            </button>
          </div>
        </div>
      </div>

      <div className=" absolute mb-40  p-10  top-[7rem] left-[56rem]">
        <div className="flex overflow-y-auto w-full roundScroll h-52 flex-col gap-5">
          {worldTime.map((time, index) => (
            <div key={index} className="z-0">
              <div className="flex items-center justify-end pl-14 rounded-md bg-[#e3e3e3] w-72 py-1">
                <img src={`https://flagcdn.com/w320/${time.img}.png`} alt="logo" className="w-9 rounded-full h-9" />
                <div className="flex items-center flex-col ml-3">
                  <div className="rounded-md px-1 w-28 text-center bg-[#f8f8f8]">
                    {time.time}
                  </div>
                  <div className="text-xs mt-1 text-center">{`${time.name?.substring(time.name.indexOf("/") + 1)}`}</div>
                </div>
                <FaMinus
                  onClick={() => {
                    deleteTime(time.name);
                  }}
                  className="ml-2 mr-4 text-[#283b91] text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute ml-96 mt-48 z-0">
        <div
          onClick={() => {
            setModalOpen(true);
          }}
          className="flex items-center justify-end p-1 rounded-md bg-[#e3e3e3]  py-1"
        >
          <FaPlus className="text-[#283b91] text-sm" />
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
                }}
              >
                <IoClose />
              </button>
            </div>
            {
msg ?
<div className="flex justify-center items-center p-5 border rounded-lg mt-5">{msg}</div>
:
              <form onSubmit={handleSubmit} className="w-full px-5  mt-5">
              <div className=" mb-3">
                <label htmlFor="timezone" className="mr-2  mb-3">
                  Select Timezone:
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={selectedTimezone}
                  onChange={(e) => {
                    setSelectedTimezone(e.target.value);
                  }}
                  className="w-full py-2 px-3 border rounded focus:outline-none"
                >
                  {timezones.map((timezone) => (
                    <option key={timezone} value={timezone}>
                      {timezone}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Time Zone
              </button>
            </form>
        }
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTime;
