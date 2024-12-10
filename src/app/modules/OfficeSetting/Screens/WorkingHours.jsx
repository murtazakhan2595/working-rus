import { Switch } from 'src/@/components/ui/switch';
import TableCustom from 'components/CustomTable';
import { CardTitle, CardHeader, CardContent, Card } from 'components/ui/card';
import React, { useEffect, useState } from 'react';
import { getWorkingHours } from 'app/hooks/general';
import dayjs from 'dayjs';

const WorkingHours = () => {
  const [data, setData] = useState([]);

  const columns = [
    {
      dataField: "name",
      text: "Shift Name",
    },
    {
      dataField: "type",
      text: "Shift Type",
    },
    {
      dataField: "starttime",
      text: "Start Time",
      formatter: (cell) => (dayjs(cell).isValid() ? dayjs(cell).format("hh:mm A") : "--"),
    },
    {
      dataField: "endtime",
      text: "End Time",
      formatter: (cell) => (dayjs(cell).isValid() ? dayjs(cell).format("hh:mm A") : "--"),
    },
  ];

  const fetchShifts = async () => {
    try {
      const response = await getWorkingHours();
      if (response?.results) {
        const formattedData = response.results.map((item) => ({
          ...item,
          // starttime: dayjs(item.starttime).format("hh:mm A"),
          // endtime: dayjs(item.endtime).format("hh:mm A"),
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.log(error, "ERROR");
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

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
