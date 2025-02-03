import React from "react";

const TextUI = React.memo(
  ({
    text = null,
    maxLength = null,
    isHTMLText = false,
    className = "text-neutral-1000 text-sm",
  }) => {
    return text ? (
      <p
        className={`${className} leading-5 truncate-text break-words overflow-hiddden max-w-[100%]`}
      >
        {isHTMLText ? (
          <span
            className="break-words"
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></span>
        ) : (
          <span className="break-words">
            {maxLength
              ? `${text.replace(/<[^>]*>/g, "").slice(0, maxLength)}${
                  text.length > maxLength ? "..." : ""
                }`
              : text}
          </span>
        )}
      </p>
    ) : null;
  }
);

export default TextUI;
