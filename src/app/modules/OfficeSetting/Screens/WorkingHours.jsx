import { Switch } from 'src/@/components/ui/switch';
import TableCustom from 'components/CustomTable';
import { CardTitle, CardHeader, CardContent, Card } from 'components/ui/card';
import React, { useState } from 'react';

const WorkingHours = () => {
  const [data, setData] = useState([
    {
      day: "Monday",
      is_active: true,
      time_range: "9:00 AM - 6:00 PM GST",
    },
    {
      day: "Tuesday",
      is_active: true,
      time_range: "9:00 AM - 6:00 PM GST",
    },
    {
      day: "Wednesday",
      is_active: true,
      time_range: "9:00 AM - 6:00 PM GST",
    },
    {
      day: "Thursday",
      is_active: true,
      time_range: "9:00 AM - 6:00 PM GST",
    },
    {
      day: "Friday",
      is_active: true,
      time_range: "9:00 AM - 6:00 PM GST",
    },
    {
      day: "Saturday",
      is_active: false,
      time_range: "--:--",
    },
    {
      day: "Sunday",
      is_active: false,
      time_range: "--:--",
    },
  ]);

  const columns = [
    {
      dataField: "is_active",
      text: "Day",
      formatter: (cell, row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Switch
            id={`activate-${row.day}`}
            checked={cell}
            onCheckedChange={(value) => {
              const updatedData = data.map((item) =>
                item.day === row.day ? { ...item, is_active: value } : item
              );
              setData(updatedData);
            }}
          />
        </div>
      ),
    },
    {
      dataField: "day",
      text: "Day",
    },
    {
      dataField: "time_range",
      text: "Time Range",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Working Hours</CardTitle>
      </CardHeader>
      <CardContent>
        <TableCustom
          columns={columns}
          data={data}
          pagination={false}
          itemsPerPage={100}
          className="organization-table"
        />
      </CardContent>
    </Card>
  );
};

export default WorkingHours;
