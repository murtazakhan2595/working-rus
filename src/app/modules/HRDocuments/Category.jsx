import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card, CardContent, CardTitle, CardDescription, CardHeader } from "components/ui/card";
import { getDocumentCategoryList } from "app/hooks/hrDocuments";
import { PageLoader } from "components";
import { DocCategoryColumns } from "app/modules/HRDocuments/Sections";
import { FilterInput } from "components/FormControl";

const Category = ({ reload }) => {
  const [CategoryData, setCategoryData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const response = await getDocumentCategoryList({
        options,
        ordering,
      });
      if (isMounted && response) {
        setCategoryData(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [ordering, options, reload]);

  return (
    <>
      <CardHeader>
        <CardTitle>Document Category</CardTitle>
        <CardDescription>Here you can view and manage document categories.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={DocCategoryColumns(fetchData)}
            data={CategoryData?.results || []}
            tableOptions={tableOptions}
            dataTotalSize={CategoryData?.count || 0}
            pagination={true}
            className="organization-table"
          />
        )}
      </CardContent>
    </>
  );
};

export default Category;
