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
  }, [userProfile.id, tableOptions.page, tableOptions.sizePerPage, ordering]);

  // Action handlers for the dropdown menu
  const handleViewAsset = (row) => {
    setSelectedAsset(row);
    setOpenAssetViewSheet(true);
  };


  const handleWithdrawAsset = (row) => {
    // Add your withdraw logic here
    console.log("Withdraw asset request:", row);
    // You can show a confirmation dialog and then withdraw
    toast.info("Withdraw functionality will be implemented here");
  };

  const myAssetsTableOptions = {
    page: tableOptions.page,
    sizePerPage: tableOptions.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    // Remove onRowClick since we're using action buttons now
    // onRowClick: (row) => {
    //   setSelectedAsset(row);
    //   setOpenAssetViewSheet(true);
    // },
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
            <Button onClick={() => setIsOpenRequest(true)}>
              Request Asset
            </Button>
          ) : null
        }
      />
      <Card>
        <CardContent>
          {canViewMyAssets ? (
            <CustomTable
              data={assets}
              columns={MyAssetRequestColumns(
                handleViewAsset,
                // (row) => {
                //   // Check if any approver has approved
                //   const hasAnyApproval = row.approval_details?.some(
                //     (approval) =>
                //       approval.status === "APPROVED" ||
                //       approval.status === "ACCEPTED"
                //   );

                //   if (hasAnyApproval) {
                //     return null; // Don't show edit if approved
                //   }

                //   if (row.asset_request_status !== "Requested") {
                //     return null; // Don't show edit for non-requested status
                //   }

                //   return handleEditAsset(row);
                // },
                handleWithdrawAsset
              )}
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
