import React from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";

const DetailContent = ({ currentItem = {}, fields = [] }) => {
  return (
    <div>
      {fields.map(
        ({
          field = [],
          title,
          footerField,
          footerTitle,
          customContent = false,
          renderContent = () => {},
        }) =>
          customContent ? (
            renderContent(currentItem)
          ) : (
            <DetailCard
              detailCardTitle={title}
              date={currentItem?.[footerField]}
              dateTitle={footerTitle}
            >
              {field.map(({ key, label, formatter, fallBackText = "N/A" }) => {
                const value =
                  currentItem && currentItem[key] ? currentItem[key] : null;
                return label ? (
                  <DetailBox
                    key={key}
                    label={label}
                    value={formatter ? formatter(value , currentItem) : value ?? fallBackText}
                  />
                ) : (
                  <div>
                    {formatter ? formatter(value , currentItem) : value ?? fallBackText}
                  </div>
                );
              })}
            </DetailCard>
          )
      )}
    </div>
  );
};

export default DetailContent;
