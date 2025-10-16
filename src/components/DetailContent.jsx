import React from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import { cn } from "src/@/lib/utils";
const DetailContent = ({ currentItem = {}, fields = [], orientation = "vertical", viewClassName = '' }) => {
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
          renderSectionCondition = () => { return true; },
          className = "",
        }) => {
          const renderSection = renderSectionCondition(currentItem);
          if (!renderSection) return <></>;
          if (customContent) {
            return <div className={cn(className)}>{renderContent(currentItem)}</div>;
          }
          const cardTitle = title && typeof title === "function" ? title(currentItem) : title;
          return (
            <DetailCard
              detailCardTitle={cardTitle}
              date={currentItem?.[footerField]}
              dateTitle={footerTitle}
            >
              <div className={cn(viewClassName)}>
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
                        orientation={orientation}
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
              </div>
            </DetailCard>
          )
        }
      )}
    </div>
  );
};

export default DetailContent;
