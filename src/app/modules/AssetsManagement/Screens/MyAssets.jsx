import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getEmployeeAssets } from "app/hooks/assets";
import AssetRequestSheet from "./AssetRequestSheet";
import CustomTable from "components/CustomTable";
import { MyAssetRequestColumns } from "app/utils/Types/TableColumns";
import { Header } from "components";
import { Card, CardContent } from "components/ui/card";

const MyAssetsPage = ({ userProfile }) => {
  const [assets, setAssets] = useState([]);
  const [isOpenRequest, setIsOpenRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [tableOptions, setTableOptions] = useState({
    page: 1,
    sizePerPage: 10,
    sortField: "created_at",
    sortOrder: "desc",
  });


  // Fetch employee assets and statuses
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assets for the current employee with pagination
      const response = await getEmployeeAssets({
        filterData: {
          employee_id: userProfile.id,
          page: tableOptions.page,
          limit: tableOptions.sizePerPage,
          sort_by: tableOptions.sortField,
          sort_order: tableOptions.sortOrder,
        },
      });

      if (response) {
        setAssets(response.results || []);
        setTotalCount(response.count || 0);
      }
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to load your assets");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data when table options change
  useEffect(() => {
    fetchData();
  }, [
    userProfile.id,
    tableOptions.page,
    tableOptions.sizePerPage,
    tableOptions.sortField,
    tableOptions.sortOrder,
  ]);

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button onClick={() => setIsOpenRequest(true)}>Request Asset</Button>
        }
      />
       <Card>
      <CardContent>
        <CustomTable
          data={assets}
          columns={MyAssetRequestColumns}
          pagination={true}
          dataTotalSize={totalCount}
          tableOptions={tableOptions}
          loading={loading}
        />
        </CardContent>
      </Card>
     {isOpenRequest && <AssetRequestSheet
        isOpen={isOpenRequest}
        setIsOpen={setIsOpenRequest}
        reload={fetchData}
        userProfile={userProfile}
      />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyAssetsPage);
