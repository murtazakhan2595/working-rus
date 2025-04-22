import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getPayun } from "app/hooks/payroll.jsx";
import { PayrunPayrollColumns } from "app/modules/Payroll/Sections";
import { TableCustom } from "components";

function PayRunList() {
  const navigate = useNavigate();
  const [PayRunData, setPayRunData] = useState([]);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    const data = await getPayun({ordering,options});
    if (data && isMounted) {
      setPayRunData(data);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [ordering, options]);

  return (
    <>
      <Card>
        <CardContent>
          <TableCustom
            data={PayRunData.results || []}
            columns={PayrunPayrollColumns(fetchData)}
            pagination={true}
            dataTotalSize={PayRunData?.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>
      {/* {cardDataList &&
        cardDataList?.map((data, index) => {
          const processedData = processCardData(data);
          console.log("PROCESSED-DATA", processedData);
          return (
            <Card className="mb-4" key={index}>
              <CardHeader>
                <CardTitle className="text-plum-900 text-lg sm:text-2xl">
                  {processedData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row flex-wrap justify-between w-full items-start gap-4 pt-6">
                <CardValues values={processedData} />
                {processedData.buttonLabel && (
                  <div className="flex">
                    <Button
                      className="bg-black"
                      onClick={processedData.onBtnClick}
                    >
                      {processedData.buttonLabel}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })} */}
    </>
  );
}

export default PayRunList;
