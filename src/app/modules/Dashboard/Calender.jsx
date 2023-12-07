import React, { useEffect, useState } from "react";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import axios from "axios";
import { connect } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment";
dayjs.locale("en"); 

const Calendar = ({ baseUrl, token }) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [allMeetings, setAllMeetings] = useState([]);
  const [allFilterdMeetings, setFilterdMeetings] = useState([]);


  const fetchMeetings = async () => {
    try {
      setLoading(true)
      let response = await axios.get(`${baseUrl}/calender`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        if (response.data?.length === 0) {
          setMsg("No Meetings");
        } else {
          setMsg("");
          setAllMeetings(response.data);
          let m = getMeetingsForDateAndDay(selectedDate, response.data);
          setFilterdMeetings(m);
        }
      }
    } catch (error) {
      setMsg("Could not fetch meetings");
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchMeetings();
  }, []);
  const getLocalTime = (meeting_time)=>{
  let meeting_start_time = moment.utc(meeting_time).local()
    return meeting_start_time.format('h:mm a')
  }
  const getMeetingsForDateAndDay = (selectedDate, myMeetings) => {
    let day = selectedDate.format("dddd").toLowerCase();
    return myMeetings.filter((meeting) => {
      const startDate = dayjs(meeting.recurrence.range.startDate);
      const userDate = selectedDate.format("YYYY-MM-DD");
      return (
        meeting.recurrence.pattern.daysOfWeek.includes(day) &&
        startDate.isBefore(userDate, "day")
      );
    });
  };
  const handleDateClick = (clickedDate) => {
    setSelectedDate(clickedDate);
    let res = getMeetingsForDateAndDay(clickedDate, allMeetings);
    if (res.length === 0) {
      setMsg("No Meetings");
    } else {
      setMsg("");
      setFilterdMeetings(res);
    }
    return res;
  };

  function ServerDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;

    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        sx={{
          bgcolor: day.day() === 0 ? "#FECACA" : "",
          color: day.day() === 0 ? "#A82822" : "",
        }}
      />
    );
  }

  return (
    <>
      <LocalizationProvider  dateAdapter={AdapterDayjs} locale="en">
        <div className="h-[21rem]">
          <DateCalendar
          sx={{width:"18rem"}}
            slots={{
              day: ServerDay,
            }}
            dayOfWeekFormatter={(_day, weekday) => `${weekday.format("ddd")}`}
            showDaysOutsideCurrentMonth
            value={selectedDate}
            onChange={(newValue) => {
              handleDateClick(newValue);
            }}
          />
        </div>
      </LocalizationProvider>

      <div className="flex flex-col mb-3 w-[95%] px-3 shadow-lg py-3 bg-white rounded-lg mx-auto justify-center">
        <div className="flex justify-between">
          <div className="mb-5 text-sm  font-semibold">Meetings Scheduled</div>
          <div className="text-xs opacity-60">
            {selectedDate?.format("MMMM D, YYYY")}
          </div>
        </div>
        {loading ? (
          <div className="block m-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) :
        <div className="divide-y scroll max-h-56 overflow-y-auto">
          {allFilterdMeetings.length > 0 && !msg ? (
            allFilterdMeetings?.map((meeting, index) => (
              <div key={index} className="flex py-2 my-1  items-center gap-4">
                <div className="flex flex-col border-l-8 border-[#25A8E0] rounded-s-md pl-2 gap-1 py-2">
                  <div className="text-xs font-medium">{meeting.subject}</div>
                  <div className="text-xs opacity-60">
                    {getLocalTime(meeting?.start_time_utc)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center opacity-50 text-sm">
              {msg}
            </div>
          )}
        </div>
}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(Calendar);
