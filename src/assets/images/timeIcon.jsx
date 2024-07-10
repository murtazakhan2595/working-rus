import React from "react";

function Icon({color}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 12 12"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M6 1.09a4.91 4.91 0 100 9.82 4.91 4.91 0 000-9.82zM0 6a6 6 0 1112 0A6 6 0 010 6zm6-3.818c.301 0 .545.244.545.545v2.936l1.88.94a.545.545 0 11-.487.976L5.756 6.488A.545.545 0 015.455 6V2.727c0-.301.244-.545.545-.545z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
