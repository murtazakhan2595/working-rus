import moment from "moment";
const getStatus = (date) => {
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  if (moment(date).isSame(moment(currentDate))) {
    return "Due Today";
  } else if (moment(date).isBefore(moment(currentDate))) {
    return "Overdue";
  } else if (moment(date).isAfter(moment(currentDate))) {
    return "Due Soon";
  }
};

const getStatusClass = (date) => {
  const status = getStatus(date);
  if (status === "Due Today") {
    return "text-amber-500 bg-orange-100";
  } else if (status === "Overdue") {
    return "text-white bg-red-600";
  } else {
    return "bg-neutral-200";
  }
};

const getStatusIconColor = (date) => {
  const status = getStatus(date);
  if (status === "Due Today") {
    return "#FF9A1F";
  } else if (status === "Overdue") {
    return "#fff";
  } else {
    return "#5C5E64";
  }
};

export { getStatusClass, getStatus ,getStatusIconColor};
