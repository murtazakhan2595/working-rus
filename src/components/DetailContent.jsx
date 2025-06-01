import React from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";

const DetailContent = ({ currentItem = {}, fields = [] }) => {
  return (
    <div>
      {fields.map(({ field = [], title, footerField, footerTitle }) => (
        <DetailCard
          detailCardTitle={title}
          date={currentItem?.[footerField]}
          dateTitle={footerTitle}
        >
          {field.map(
            ({ key, label, formatter, fallBackText = "N/A" }) => {
              const value =
                currentItem && currentItem[key]
                  ? currentItem[key]
                  : null;
              return (
                <DetailBox
                  key={key}
                  label={label}
                  value={formatter ? formatter(value) : value ?? fallBackText}
                />
              );
            }
          )}
        </DetailCard>
      ))}
    </div>
  );
};

export default DetailContent;
