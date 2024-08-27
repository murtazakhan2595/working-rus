import React from "react";

function MobileLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="48"
      fill="none"
      viewBox="0 0 24 48"
    >
      <path
        fill="#AB4ABA"
        d="M10.602 38.377c-1.76 0-3.358-.415-4.792-1.245A9.76 9.76 0 012.377 33.7c-.83-1.434-1.245-3.031-1.245-4.792 0-1.76.415-3.345 1.245-4.754a9.55 9.55 0 013.433-3.358c1.434-.855 3.031-1.283 4.792-1.283 1.786 0 3.396.415 4.83 1.245a9.164 9.164 0 013.395 3.396c.855 1.409 1.283 2.993 1.283 4.754 0 1.76-.428 3.358-1.283 4.792a9.453 9.453 0 01-3.396 3.433c-1.433.83-3.043 1.245-4.829 1.245zm0-4c1.031 0 1.937-.226 2.717-.678a4.79 4.79 0 001.848-1.962c.453-.83.68-1.773.68-2.83 0-1.056-.227-1.987-.68-2.792a4.934 4.934 0 00-1.848-1.886c-.78-.478-1.686-.717-2.717-.717-1.006 0-1.912.239-2.716.717a4.934 4.934 0 00-1.85 1.886c-.427.805-.64 1.736-.64 2.792 0 1.056.213 2 .64 2.83a5.141 5.141 0 001.85 1.962c.804.453 1.71.679 2.716.679z"
      ></path>
      <g filter="url(#filter0_d_791_7406)">
        <path
          fill="#953EA3"
          d="M19.507 18.134c-2.198-3.067-9.933-2.17-10.816 2.058 2.275 1.035 4.682 1.482 6.851.852 1.468-.427 1.85-2.223 3.965-2.91z"
        ></path>
      </g>
      <path
        stroke="#9747FF"
        strokeWidth="0.16"
        d="M8.69 20.192c.787-.224 2.932-.864 5.228-1.632 2.295-.768 4.682-.604 5.589-.426"
      ></path>
      <defs>
        <filter
          id="filter0_d_791_7406"
          width="18.816"
          height="13.018"
          x="4.691"
          y="16.316"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          ></feColorMatrix>
          <feOffset dy="4"></feOffset>
          <feGaussianBlur stdDeviation="2"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_791_7406"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_791_7406"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
}

export default MobileLogo;