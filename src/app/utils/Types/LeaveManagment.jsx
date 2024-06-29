import moment from "moment";
const Leave = {
    employee_id: "",
    name: "",
    date: moment(new Date()).format('YYYY-MM-DD'),
    position: "",
    department: "",
    joining_date: "",
    nationality: "",
    start_date: "",
    end_date: "",
    last_work_day: "",
    rejoining_date: "",
    total_leave: "",
    leave_type: "",
    reason: "",
    contact_no: "",
    country_code: "",
    report_to: "",
    address_during_leave: "",
  };

  export {
    Leave,
  }