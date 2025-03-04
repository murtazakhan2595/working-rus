import React, { useEffect, useState } from "react";
import "../index.css"; // Ensure this path is correct and necessary

const PageLoader = ({ height = "full" }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activate the animation after the component mounts
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 100); // Delay to ensure the component is fully mounted

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex items-center justify-center h-full max-h-[${height}]`}
    >
      <div className="text-center">
        <svg
          className={isActive ? "active" : ""}
          width="42"
          height="48"
          viewBox="0 0 42 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="mask0_3214_94519"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="42"
            height="48"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M42 13.741C42 12.6644 41.4231 11.6704 40.4884 11.1362L22.9895 1.13685C21.8149 0.465643 20.3362 0.674678 19.3465 1.59697C12.2124 8.24486 6.29576 10.6445 2.95388 11.5107C1.35002 11.9264 0 13.3431 0 15V34.259C0 35.3356 0.576857 36.3296 1.51158 36.8638L19.5116 47.1495C20.4339 47.6765 21.5661 47.6765 22.4884 47.1495L40.4884 36.8638C41.4231 36.3296 42 35.3356 42 34.259V13.741Z"
              fill="black"
              className="svg-elem-1"
            ></path>
          </mask>
          <g mask="url(#mask0_3214_94519)">
            <path
              d="M0 12V36L7.875 31.5V16.5L0 12Z"
              fill="#BB66CC"
              className="svg-elem-2"
            ></path>
            <path
              d="M21 0C9 12 0 12 0 12L7.875 16.5C10.5 16.5 19.25 11.5 21 9V0Z"
              fill="#BB66CC"
              className="svg-elem-3"
            ></path>
            <path
              d="M42 12L21 0V9L34.125 16.5L42 12Z"
              fill="#BB66CC"
              className="svg-elem-4"
            ></path>
            <path
              d="M21 48L42 36L34.125 31.5L27.5625 35.25L21 39V48Z"
              fill="#BB66CC"
              className="svg-elem-5"
            ></path>
            <path
              d="M0 36L21 48V39L7.875 31.5L0 36Z"
              fill="url(#paint0_linear_3214_94519)"
              className="svg-elem-6"
            ></path>
            <path
              d="M42 12L34.125 16.5L21 24V30L42 12Z"
              fill="url(#paint1_linear_3214_94519)"
              className="svg-elem-7"
            ></path>
            <path
              d="M21 24L13.125 19.5L21 30V24Z"
              fill="#BB66CC"
              className="svg-elem-8"
            ></path>
            <path
              d="M0 12C0 12 12 9 21 0V9C19.25 11.5 10.5 16.5 7.875 16.5L0 12Z"
              fill="url(#paint2_linear_3214_94519)"
              className="svg-elem-9"
            ></path>
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_3214_94519"
              x1="7.91602"
              y1="31.5"
              x2="21"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BB66CC"></stop>
              <stop offset="1" stopColor="#9853A6"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_3214_94519"
              x1="42"
              y1="18"
              x2="19.7986"
              y2="21.2221"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#C357D9"></stop>
              <stop offset="0.5" stopColor="#BB66CC"></stop>
              <stop offset="1" stopColor="#9853A6"></stop>
            </linearGradient>
            <linearGradient
              id="paint2_linear_3214_94519"
              x1="21"
              y1="4.64063"
              x2="5.09949"
              y2="14.942"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#DA61F2"></stop>
              <stop offset="0.5" stopColor="#BB66CC"></stop>
              <stop offset="1" stopColor="#9853A6"></stop>
            </linearGradient>
          </defs>
        </svg>

        <p className="mt-4 text-gray-600">Loading ...</p>
      </div>
    </div>
  );
};

export default PageLoader;
