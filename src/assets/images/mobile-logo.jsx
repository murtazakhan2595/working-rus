import React from "react";

function MobileLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="48"
      fill="none"
      viewBox="0 0 42 48"
    >
      <mask
        id="mask0_3215_94547"
        style={{ maskType: "alpha" }}
        width="42"
        height="48"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
      >
        <path
          fill="#000"
          fillRule="evenodd"
          d="M42 13.741a3 3 0 00-1.512-2.605l-17.498-10c-1.175-.67-2.654-.461-3.643.461-7.135 6.648-13.051 9.047-16.393 9.914C1.35 11.926 0 13.343 0 15v19.259a3 3 0 001.512 2.605l18 10.286a3 3 0 002.976 0l18-10.286A3 3 0 0042 34.259V13.741z"
          clipRule="evenodd"
        ></path>
      </mask>
      <g mask="url(#mask0_3215_94547)">
        <path fill="#B6C" d="M0 12v24l7.875-4.5v-15L0 12z"></path>
        <path
          fill="#B6C"
          d="M21 0C9 12 0 12 0 12l7.875 4.5C10.5 16.5 19.25 11.5 21 9V0zM42 12L21 0v9l13.125 7.5L42 12zM21 48l21-12-7.875-4.5-6.563 3.75L21 39v9z"
        ></path>
        <path
          fill="url(#paint0_linear_3215_94547)"
          d="M0 36l21 12v-9L7.875 31.5 0 36z"
        ></path>
        <path
          fill="url(#paint1_linear_3215_94547)"
          d="M42 12l-7.875 4.5L21 24v6l21-18z"
        ></path>
        <path fill="#B6C" d="M21 24l-7.875-4.5L21 30v-6z"></path>
        <path
          fill="url(#paint2_linear_3215_94547)"
          d="M0 12S12 9 21 0v9c-1.75 2.5-10.5 7.5-13.125 7.5L0 12z"
        ></path>
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_3215_94547"
          x1="7.916"
          x2="21"
          y1="31.5"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B6C"></stop>
          <stop offset="1" stopColor="#9853A6"></stop>
        </linearGradient>
        <linearGradient
          id="paint1_linear_3215_94547"
          x1="42"
          x2="19.799"
          y1="18"
          y2="21.222"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C357D9"></stop>
          <stop offset="0.5" stopColor="#B6C"></stop>
          <stop offset="1" stopColor="#9853A6"></stop>
        </linearGradient>
        <linearGradient
          id="paint2_linear_3215_94547"
          x1="21"
          x2="5.099"
          y1="4.641"
          y2="14.942"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA61F2"></stop>
          <stop offset="0.5" stopColor="#B6C"></stop>
          <stop offset="1" stopColor="#9853A6"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default MobileLogo;