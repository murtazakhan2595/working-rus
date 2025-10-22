import React, { useState } from "react";
import { ScrollArea } from "src/@/components/ui/scroll-area";

const TextUI = React.memo(
  ({
    text = null,
    maxLength = null,
    isHTMLText = false,
    className = "text-sm",
    style = {},
    height = "100%",
    showReadmore=false, // show readmore button if the manLength is defined
    fallbackText='N/A',
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
            <TruncatedText text={text} maxLength={maxLength} showReadmore={showReadmore} />
          )}
        </div>
      </ScrollArea>
    ) : fallbackText;
  }
);

function TruncatedText({ text = "", maxLength ,showReadmore}) {
  const [expanded, setExpanded] = useState(false);

  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, "");
  const limit = maxLength;

  const shouldTruncate = plainText.length > limit;
  const displayText =
    expanded || !maxLength
      ? plainText
      : plainText.slice(0, limit) + (shouldTruncate ? "..." : "");

  return (
    <div className="break-words">
      {displayText}
      {showReadmore && shouldTruncate&& (
        <button
          type="button"
          className="ml-1 text-neutral-800 hover:underline text-sm font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default TextUI;
