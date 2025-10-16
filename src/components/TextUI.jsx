import React, { useState } from "react";
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
            <TruncatedText text={text} maxLength={maxLength} />
          )}
        </div>
      </ScrollArea>
    ) : null;
  }
);

function TruncatedText({ text = "", maxLength }) {
  const [expanded, setExpanded] = useState(false);

  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, "");
  const limit = maxLength || 100;

  const shouldTruncate = plainText.length > limit;
  const displayText =
    expanded || maxLength
      ? plainText
      : plainText.slice(0, limit) + (shouldTruncate ? "..." : "");

  return (
    <div className="break-words">
      {displayText}
      {!maxLength && shouldTruncate && (
        <button
          type="button"
          className="ml-1 text-blue-600 hover:underline text-sm font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default TextUI;
