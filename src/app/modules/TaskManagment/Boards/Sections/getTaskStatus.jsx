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
  if(!bgColor){
    return "text-[#172b4d]"; // Dark text color
  }
  // List of light background colors
  const lightColors = [
    "bg-purple-300",
    "bg-purple-500",
    "bg-white",
    "bg-gray-400",
    "bg-gray-500",
    "bg-pink-300",
    "bg-emerald-300",
    "bg-amber-300",
    "bg-yellow-300",
  ];

  // If the background color is in the list of light colors, return dark text
  if (lightColors?.includes(bgColor)) {
    return "text-[#172b4d]"; // Dark text color
  }
  // If the background color is dark, return white text
  return "text-white";
};



export { getStatusClass, getStatus ,getStatusIconColor, getLabelColor, getDarkerTextColor};


