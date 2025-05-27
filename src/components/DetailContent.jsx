import React from "react";
import { DetailBox, DetailCard } from "components/SheetCardExtension";

const DetailContent = ({ 
  title, 
  currentItem, 
  fields = [],
  dateField = "created_at",
  dateTitle = "Created At"
}) => {
  return (
    <DetailCard 
      detailCardTitle={title} 
      date={currentItem?.[dateField]} 
      dateTitle={dateTitle}
    >
      {fields.map((field) => (
        <DetailBox 
          key={field.key}
          label={field.label} 
          value={field.formatter ? field.formatter(currentItem?.[field.key]) : currentItem?.[field.key]} 
        />
      ))}
    </DetailCard>
  );
};

export default DetailContent; 