import React from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { cn } from "src/@/lib/utils";
const DetailContent = ({ currentItem = {}, fields = [] }) => {
  return (
    <div className="mb-4">
      {fields.map(
        ({
          field = [],
          title,
          footerField,
          footerTitle,
          customContent = false,
          renderContent = () => { },
          className = "",
        }) =>
          customContent ? (
            <div className={cn(className)}>{renderContent(currentItem)}</div>
          ) : (
            <DetailCard
              detailCardTitle={title}
              date={currentItem?.[footerField]}
              dateTitle={footerTitle}
            >
              {field.map(
                ({
                  key,
                  label,
                  formatter,
                  fallBackText = "N/A",
                  fieldClassName = "",
                  renderCondition,
                }) => {
                  const value =
                    currentItem && (currentItem[key] !== null && currentItem[key] !== undefined) ? currentItem[key] : null;
                  if (renderCondition && typeof renderCondition === "function") {
                    const renderEnable = renderCondition(value, currentItem);
                    if (!renderEnable) return <></>;
                  }
                  return label ? (
                    <DetailBox
                      key={key}
                      label={label}
                      value={formatter ? formatter(value, currentItem) : value ?? fallBackText}
                    />
                  ) : (
                    <div className={cn("mt-2", fieldClassName)}>
                      {formatter
                        ? formatter(value, currentItem)
                        : value ?? fallBackText}
                    </div>
                  );
                }
              )}
            </DetailCard>
          )
      )}
    </div>
  );
};

export default DetailContent;
