import { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getEmployeeAssets } from "app/hooks/assets";
import AssetRequestSheet from "./AssetRequestSheet";
import AssetRequestViewSheet from "./AssetRequestViewSheet";
import CustomTable from "components/CustomTable";
import { MyAssetRequestColumns } from "app/utils/Types/TableColumns";
import { Header, UnauthorizedAccess } from "components";
import { Card, CardContent } from "components/ui/card";
import { HasAccess } from "utils/PermissionUtils";

const MyAssetsPage = ({ userProfile }) => {
  // Permission checks for my assets features
  const canViewMyAssets = HasAccess("VIEW_ASSIGNED_MY_ASSETS");
  const canRequestAsset = HasAccess("ADD_ASSET_REQUEST");

  const [assets, setAssets] = useState([]);
  const [isOpenRequest, setIsOpenRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [ordering, setOrdering] = useState("-id");
  const [tableOptions, setTableOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [openAssetViewSheet, setOpenAssetViewSheet] = useState(false);

  // Function to handle page/size changes
  const onPageChange = (name, value) => {
    setTableOptions((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch employee assets and statuses
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assets for the current employee with pagination
      const response = await getEmployeeAssets({
        options: {
          page: tableOptions.page,
          sizePerPage: tableOptions.sizePerPage,
        },
        filterData: {
          asset_employee_id: userProfile.id,
        },
        ordering: ordering,
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

  useEffect(() => {
    fetchData();
  }, [
    userProfile.id,
    tableOptions.page,
    tableOptions.sizePerPage,
    ordering,
    
  ]);

  const myAssetsTableOptions = {
    page: tableOptions.page,
    sizePerPage: tableOptions.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    onRowClick: (row) => {
      setSelectedAsset(row);
      setOpenAssetViewSheet(true);
    },
  };

  // If user has no my assets permissions at all
  if (!canViewMyAssets) {
    return (
      <UnauthorizedAccess
        title="My Assets Access Denied"
        featureName="your assets"
        message="You don't have permission to view your assigned assets. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          canRequestAsset ? (
            <Button onClick={() => setIsOpenRequest(true)}>Request Asset</Button>
          ) : null
        }
      />
      <Card>
        <CardContent>
          {canViewMyAssets ? (
            <CustomTable
              data={assets}
              columns={MyAssetRequestColumns}
              pagination={true}
              dataTotalSize={totalCount}
              tableOptions={myAssetsTableOptions}
              loading={loading}
            />
          ) : (
            <UnauthorizedAccess
              title="Assets Access Denied"
              featureName="your assets"
              message="You don't have permission to view your assets."
              size="md"
            />
          )}
        </CardContent>
      </Card>

      {/* Asset Request Sheet */}
      {isOpenRequest && canRequestAsset && (
        <AssetRequestSheet
          isOpen={isOpenRequest}
          setIsOpen={setIsOpenRequest}
          reload={fetchData}
          userProfile={userProfile}
          mode="request"
        />
      )}

      {/* Asset View Sheet */}
      {openAssetViewSheet && selectedAsset && (
        <AssetRequestViewSheet
          isOpen={openAssetViewSheet}
          setIsOpen={setOpenAssetViewSheet}
          request={selectedAsset}
          isMyRequest={true}
          reload={fetchData}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyAssetsPage);
