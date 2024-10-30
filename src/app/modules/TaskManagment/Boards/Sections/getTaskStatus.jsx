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

const getLabelColor = (label="Design")=>{
  if(label="Design"){
    return "#FF9A1F";
  } else if(label ="QA"){
    return "#5C5E64"
  } else {
    return "#fff"
  }
}

const getDarkerTextColor = (bgColor) => {
  switch (bgColor) {
    case "bg-purple-300":
      return "text-purple-700";
    case "bg-purple-500":
      return "text-purple-900";
    case "bg-purple-700":
      return "text-purple-900";
    case "bg-emerald-300":
      return "text-emerald-700";
    case "bg-emerald-500":
      return "text-emerald-900";
    case "bg-teal-700":
      return "text-teal-900";
    case "bg-gray-400":
      return "text-gray-700";
    case "bg-gray-500":
      return "text-gray-800";
    case "bg-gray-900":
      return "text-gray-100"; // Light text for dark bg
    case "bg-pink-500":
      return "text-pink-900";
    case "bg-red-500":
      return "text-red-700";
    case "bg-red-700":
      return "text-red-900";
    case "bg-amber-500":
      return "text-amber-700";
    case "bg-amber-700":
      return "text-amber-900";
    case "bg-brown-700":
      return "text-brown-900"; // Assuming custom brown color
    default:
      return "text-black"; // Fallback color
  }
};


export { getStatusClass, getStatus ,getStatusIconColor, getLabelColor, getDarkerTextColor};


