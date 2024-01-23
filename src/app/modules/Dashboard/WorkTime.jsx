import React, { useState, useRef, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { RxResume } from "react-icons/rx";
import { VscDebugStart } from "react-icons/vsc";
import { CiPause1 } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { LuTimerReset } from "react-icons/lu";
import moment from "moment-timezone";
import { getAllCountries } from "countries-and-timezones";
import Select from "react-select";
import axios from "axios";
import { connect } from "react-redux";

const WorkTime = ({ baseUrl, token, userProfile }) => {
  // ******************** State Vars ************************ //
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [worldTime, setWorldTime] = useState([{}]);
  const [msg, setMsg] = useState("");
  const [bottomMsg, setBottomMsg] = useState("");
  const [time, setTime] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const [clockId, setClockId] = useState(null);
  const [totalWorkedHoursFormatted, setTotalWorkedHoursFormatted] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [status, setStatus] = useState('start');
  const clockLimit = 3;

  // ******************** Stop Watch Start And Reset Functions ************************ //

  // console.log(userProfile);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // const handleStartStop = async () => {
  //   if (isRunning) {
  //     clearInterval(intervalRef.current);
  //     console.log("Time passed:", formatTime(time));
  //     console.log(userProfile);

  //     const currentDate = new Date();
  //     const formattedCurrentDate = moment(currentDate).format("YYYY-MM-DD");

  //     const formattedTime = moment(currentDate).format("HH:mm:ss.SSS");

  //     const combinedDateTime = `${formattedCurrentDate}T${formattedTime}Z`;

  //     console.log("Combined DateTime:", combinedDateTime);

  //     try {
  //       const response = await axios.post(
  //         `${baseUrl}/timetracker/Timetracker/`,
  //         {
  //           start_time: combinedDateTime,
  //           end_date: "",
  //           status: "start",
  //           total_worked_hours: 0,
  //           employee: userProfile.id,
  //         },
  //         {
  //           headers,
  //         }
  //       );

  //       if (response.status === 201) {
  //         // toast.success("Data sent to API successfully!", {
  //         //   position: toast.POSITION.TOP_RIGHT,
  //         // });
  //       }
  //     } catch (error) {
  //       // toast.error("Error sending data to the API. Please try again.", {
  //       //   position: toast.POSITION.TOP_RIGHT,
  //       // });
  //     }

  //   } else {
  //     const startTime = Date.now() - time;
  //     intervalRef.current = setInterval(() => {
  //       setTime(Date.now() - startTime);
  //     }, 10);
  //   }
  //   setIsRunning(!isRunning);
  // };

  // const handleReset = () => {
  //   clearInterval(intervalRef.current);
  //   setIsRunning(false);
  //   setTime(0);
  // };

  // *************************** Stop Watch Time And Progress Functions **************************** //

  const currentDate = new Date();
  const formattedCurrentDate = moment(currentDate).format("YYYY-MM-DD");
  const formattedTime = moment(currentDate).format("HH:mm:ss.SSS");
  const combinedDateTime = `${formattedCurrentDate}T${formattedTime}Z`;

  const startTimer = async () => {
    const startDateTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    try {
      const response = await axios.post(
        `${baseUrl}/timetracker/Timetracker/`,
        {
          start_time: startDateTime,
          end_date: "",
          status: status,
          total_worked_hours: 0,
          employee: userProfile.id,
        },
        {
          headers,
        }
      );

      if (response.status === 201) {
        console.log(response.data);
        setClockId(response.data.id);
        setTotalWorkedHoursFormatted(response.data.total_worked_hours_formatted);
        setStartTime(response.data.start_time)
        setStatus(response.data.start_time)
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Error starting the timer:", error);
    }
  };

  const pauseTimer = async () => {
    const pauseDateTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    try {
      const response = await axios.post(
        `${baseUrl}/timetracker/Timetracker/${clockId}/pause_clock/`,
        {
          start_time: startTime,
          end_date: "",
          status: "pause",
          total_worked_hours: 0,
          employee: userProfile.id,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setClockId(response.data.id);
        setTotalWorkedHoursFormatted(response.data.total_worked_hours_formatted);
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Error pausing the timer:", error);
    }
  };

  const resumeTimer = async () => {
    const resumeDateTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    try {
      const response = await axios.post(
        `${baseUrl}/timetracker/Timetracker/${clockId}/resume_clock/`,
        {
          start_time: startTime,
          end_date: "",
          status: "resume",
          total_worked_hours: 0,
          employee: userProfile.id,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setClockId(response.data.id);
        setTotalWorkedHoursFormatted(response.data.total_worked_hours_formatted);
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Error resuming the timer:", error);
    }
  };

  const resetTimer = async () => {
    const resetDateTime = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

    try {
      const response = await axios.post(
        `${baseUrl}/timetracker/Timetracker/${clockId}/reset_clock/`,
        {
          start_time: startTime,
          end_date: "",
          status: "",
          total_worked_hours: 0,
          employee: userProfile.id,
        },
        {
          headers,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setClockId(response.data.id);
        setTotalWorkedHoursFormatted(response.data.total_worked_hours_formatted);
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Error resetting the timer:", error);
    }
  };

  const fetchTimerData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/timetracker/Timetracker/get_clock_status/`,
        {
          headers,
        }
      );
  
      if (response.status === 200) {
        setClockId(response.data.id);
        setTotalWorkedHoursFormatted(response.data.total_worked_hours_formatted);
        setStartTime(response.data.start_time);
        setStatus(response.data.status);
      }
    } catch (error) {
      console.error("Error fetching timer data:", error);
    }
  };
  

  // useEffect to start the interval when the component mounts
  useEffect(() => {
    fetchTimerData();

    // Start the interval only if the timer is running
    if (isRunning) {
      const intervalId = setInterval(() => {
        fetchTimerData();
      }, 60000);

      // Cleanup function to clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  // Cleanup function to clear the interval when the component is unmounted
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);


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
    const progress = (totalWorkedHoursFormatted % 28800000) / 28800000; // Get progress for 8 hours (0 to 1)
    const scaledProgress = progress * 1000; // Scale the progress

    const degrees = scaledProgress * 360 * 1000; // Convert to degrees (0 to 360)

    console.log("degress", degrees);

    // Ensure the degrees value is within the expected range
    return degrees >= 0 && degrees <= 360 ? degrees : 0;
  };

  // *************************** Getting Other Cities and Time **************************** //

  const fetchTimezones = async () => {
    var getCountries = getAllCountries();

    let zones = [];
    for (const countryId in getCountries) {
      if (getCountries.hasOwnProperty(countryId)) {
        let country = getCountries[countryId];
        if (country.timezones.length === 1) {
          zones.push({
            id: country.id,
            name: `${country.name}`,
            abbreviation: "",
            timezones: country.timezones,
          });
        } else {
          country.timezones.forEach((timezone) => {
            // const timezoneAbbr = moment().tz(timezone).format('z')
            // const timezoneAbbr = moment.tz(timezone).zoneAbbr();
            let abbreviation = timezone.split("/");
            zones.push({
              id: country.id,
              name: country.name,
              abbreviation: abbreviation[2] ? abbreviation[2] : abbreviation[1],
              // abbreviation: timezoneAbbr,
              timezones: [timezone],
            });
          });
        }
      }
    }
    setTimezones(zones);
  };

  const getTargetTime = (zone) => {
    const targetDate = moment().tz(zone).format("LT");
    return targetDate;
  };

  const deleteTime = (timezone) => {
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    const indexToRemove = data.filter((item) => item.name !== timezone.name);
    localStorage.setItem("myTimeZones", JSON.stringify(indexToRemove));
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = localStorage.getItem("myTimeZones");
    const data = storedData ? JSON.parse(storedData) : [];
    if (selectedTimezone.timeZone.length === 1) {
      const existsInArray = data.some(
        (item) =>
          item.name ===
          `${selectedTimezone.name}${
            selectedTimezone.abbreviation &&
            ` - ${selectedTimezone.abbreviation}`
          }`
      );
      if (data.length < clockLimit) {
        if (existsInArray) {
          setBottomMsg("Time Zone Already Exist Choose Another One.");
        } else {
          data.push({
            id: selectedTimezone.id,
            name: `${selectedTimezone.name}${
              selectedTimezone.abbreviation &&
              ` - ${selectedTimezone.abbreviation}`
            }`,
            timeZone: selectedTimezone.timeZone,
          });
          localStorage.setItem("myTimeZones", JSON.stringify(data));
          setModalOpen(false);
          setMsg("");
          setBottomMsg("");
        }
      } else {
        setMsg("You Can Add Only 3 Clocks.");
      }
    } else {
      setBottomMsg("Could not added the timezone please try again later.");
    }
  };

  // *************************** UseEffect **************************** //

  useEffect(() => {
    const interval = setInterval(() => {
      const storedData = localStorage.getItem("myTimeZones");
      const data = storedData ? JSON.parse(storedData) : [];
      let myZones = [];
      data.map((d) => {
        myZones.push({
          name: d.name,
          time: getTargetTime(d.timeZone[0]),
          img: d.id?.toLowerCase(),
        });
      });
      setWorldTime(myZones);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    fetchTimezones();
  }, []);

  const customFilter = (option, searchText) => {
    if (
      option.data.name.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.abbreviation.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex flex-col -mt-5 items-center justify-center ml-1 mr-3 md:pr-[25%] md:ml-10">
      <h1 className="font-semibold">Work Time</h1>

      {/* ********************************** Working Time ******************************* */}
      <div
        className="w-52 h-52 drop-shadow-lg shadow-black z-10 rounded-full border-[12px] border-[#e3e3e3] flex justify-center items-center"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, #25a8e0 ${getProgress()}deg, #fff 0 ${getProgress()}deg, #fff)`,
        }}
      >
        <div className="w-[10.5rem] h-[10.5rem] rounded-full bg-[#e3e3e3] flex flex-col items-center justify-center text-xl m-0">
          <div>
            <div className="text-xl font-semibold text-[#283b91]">
              {totalWorkedHoursFormatted}
            </div>
            <div className="text-xl tracking-wider font-semibold text-center mb-5 text-[#283b91]">
              Hrs
            </div>
          </div>
          <div className="flex gap-3">
            {/* {!isRunning && ( */}
              <button
                className="px-[0.6rem] py-[0.3rem] bg-[#283b91] text-white rounded-md m-0 text-sm hover:bg-[#283bbf]"
                onClick={startTimer}
                title="Start"
              >
                <VscDebugStart />
              </button>
            {/* )} */}
            {/* {isRunning && ( */}
              {/* <> */}
                <button
                  className="px-[0.6rem] py-[0.3rem] bg-[#283b91] text-white rounded-md m-0 text-sm hover:bg-[#283bbf]"
                  onClick={pauseTimer}
                  title="Pause"
                >
                  <CiPause1 />
                </button>
                <button
                  className="px-[0.6rem] py-[0.3rem] bg-[#283b91] text-white rounded-md m-0 text-sm hover:bg-[#283bbf]"
                  onClick={resumeTimer}
                  title="Resume"
                >
                  <RxResume />
                </button>
                <button
                  className="px-[0.6rem] py-[0.3rem] bg-[#283b91] text-white rounded-md m-0 text-sm hover:bg-[#283bbf]"
                  onClick={resetTimer}
                  title="Reset"
                >
                  <LuTimerReset />
                </button>
              {/* </> */}
            {/* )} */}
          </div>
        </div>
      </div>

      {/* ********************************** World Times ******************************* */}
      <div className="w-1/4 md:flex hidden">
        <div
          className={`
        ${worldTime.length >= 1 ? "ml-12" : "w-1/2 ml-36"}
          mt-[-12.5rem]  `}
        >
          <div className="flex w-full  h-52 flex-col gap-6 md:mr-0 mr-16">
            {worldTime.map((time, index) => (
              <div key={index} className="z-0">
                <div
                  className={`flex items-center justify-end ${
                    index === 1 ? "" : "pr-4"
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
                    <div className="text-xs mt-0 w-[5.2rem] text-center text-[#283b91]">{`${time.name?.substring(
                      time.name.indexOf("-") + 1
                    )}`}</div>
                  </div>
                  <FaMinus
                    onClick={() => {
                      deleteTime(time);
                    }}
                    className="ml-2 mr-2 text-[#283b91] self-start text-sm hover:cursor-pointer"
                  />
                </div>
              </div>
            ))}
            {worldTime.length >= 3 ? (
              ""
            ) : (
              <div
                style={{ justifyContent: "right" }}
                className={`${
                  worldTime.length >= 1 ? "w-[70%]" : "w-[180%]"
                } flex items-center`}
              >
                <div
                  style={{ justifyContent: "right" }}
                  className={`p-1 flex  ${
                    worldTime.length >= 1 ? "w-[21%]" : "w-[51%]"
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
            )}
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
                  time.name.indexOf("-") + 1
                )}`}</div>
              </div>
              <FaMinus
                onClick={() => {
                  deleteTime(time);
                }}
                className="ml-2  text-[#283b91] self-start text-sm"
              />
            </div>
          </div>
        ))}
        {worldTime.length >= 3 ? (
          ""
        ) : (
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
        )}
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
                    required
                    className="basic-single"
                    classNamePrefix="select"
                    filterOption={customFilter}
                    isClearable
                    isSearchable
                    onChange={(e) => {
                      if (e) {
                        setSelectedTimezone({
                          id: e.id,
                          abbreviation: e.abbreviation,
                          name: e.name,
                          timeZone: e.timezones,
                        });
                      } else {
                        setSelectedTimezone(null);
                      }
                    }}
                    getOptionLabel={(option) => (
                      <div className="flex gap-2 items-start">
                        {option.name}{" "}
                        <div className="text-sm opacity-60">
                          {option.abbreviation}
                        </div>{" "}
                      </div>
                    )}
                    getOptionValue={(option) => option.timezones}
                    options={timezones}
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

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(WorkTime);
