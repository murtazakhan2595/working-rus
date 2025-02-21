import React from "react";
import { ScrollArea } from "src/@/components/ui/scroll-area";

const TextUI = React.memo(
  ({
    text = null,
    maxLength = null,
    isHTMLText = false,
    className = "text-neutral-1000 text-sm",
    style = {},
    height = "100%",
  }) => {
    return text ? (
      <ScrollArea className="[&>div>div[style]]:!block">
        <div
          className={`${className} leading-5 h-[${height}] break-words max-w-[100%] pr-3`}
          style={style}
        >
          {isHTMLText ? (
            <div
              className="break-words"
              dangerouslySetInnerHTML={{
                __html: text,
              }}
            ></div>
          ) : (
            <div className="break-words">
              {maxLength
                ? `${text.replace(/<[^>]*>/g, "").slice(0, maxLength)}${
                    text.length > maxLength ? "..." : ""
                  }`
                : text}
            </div>
          )}
        </div>
      </ScrollArea>
    ) : null;
  }
);

export default TextUI;
