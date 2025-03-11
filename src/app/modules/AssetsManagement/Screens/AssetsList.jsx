import { Button } from "components/ui/button";
import { Card, CardHeader, CardContent } from "components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  Computer,
  Calendar,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import CustomTable from "components/CustomTable";
import { toast } from "react-toastify";
import moment from "moment";
// import { getAssetDetails, deleteAsset } from "app/hooks/assets";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "utils/renderValues";
import { AssetsColumns } from "app/utils/Types/TableColumns";

const AssetsList = ({ assetsList, reload }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);

  if (!assetsList || assetsList.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6 min-h-96">
          <Computer className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg font-semibold text-gray-700">No Assets Found</p>
          <p className="text-sm text-gray-500 mt-1">
            Add assets to start tracking them
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleRowClick = (row) => {
    // Here you can implement what happens when a row is clicked
    console.log("Row clicked:", row);
  };

  return (
    <Card>
      <CardContent>
        <CustomTable
          columns={AssetsColumns}
          data={assetsList}
          totalSize={assetsList.length}
          onRowClick={handleRowClick}
          rowSelection={{
            selectedRowIds: selectedAssets,
            onChange: setSelectedAssets,
          }}
          actions={[
            {
              icon: <Eye size={16} />,
              label: "View",
              onClick: (row) => {
                toast.info(`View Asset: ${row.asset_name}`);
                // Implement view functionality
              },
            },
            {
              icon: <Edit size={16} />,
              label: "Edit",
              onClick: (row) => {
                toast.info(`Edit Asset: ${row.asset_name}`);
                // Implement edit functionality
              },
            },
            {
              icon: <Trash2 size={16} color="red" />,
              label: "Delete",
              onClick: async (row) => {
                if (
                  window.confirm(
                    `Are you sure you want to delete ${row.asset_name}?`
                  )
                ) {
                  try {
                    // await deleteAsset(row.id);
                    toast.success(
                      `Asset ${row.asset_name} deleted successfully`
                    );
                    reload();
                  } catch (error) {
                    toast.error(`Failed to delete asset: ${error.message}`);
                  }
                }
              },
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

const AssetDetailsBox = ({
  assetId,
  toggleDetails,
  isDetailsVisible,
  reload,
}) => {
  const navigate = useNavigate();
  const [assetDetails, setAssetDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // const response = await getAssetDetails(assetId);
      // if (response) {
      //   setAssetDetails(response);
      // }
    };
    fetchData();
  }, [assetId]);

  if (!assetDetails) {
    return <div className="p-4">Loading asset details...</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Asset ID</h3>
          <p>{assetDetails.asset_id}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Serial Number/IMEI
          </h3>
          <p>{assetDetails.serial_number}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Model & Specifications
          </h3>
          <p>{assetDetails.specifications}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Purchase Date</h3>
          <p>{moment(assetDetails.purchase_date).format("MMM D, YYYY")}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Warranty Expiry</h3>
          <p>{moment(assetDetails.warranty_expiry).format("MMM D, YYYY")}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Purchase Cost</h3>
          <p>AED {formatNumber(assetDetails.purchase_cost)}</p>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500">Remarks/Notes</h3>
          <p>{assetDetails.notes}</p>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div
          className="h-8 px-2 py-1 flex items-center gap-2 cursor-pointer"
          onClick={toggleDetails}
        >
          <div className="text-[#7f838d] text-base font-semibold">
            {isDetailsVisible ? "Hide Details" : "View Details"}
          </div>
          {isDetailsVisible ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={async () => {
              try {
                // await deleteAsset(assetId);
                toast.success("Asset deleted successfully");
                reload();
              } catch (error) {
                toast.error(`Failed to delete asset: ${error.message}`);
              }
            }}
            variant="destructive"
          >
            Delete Asset
          </Button>
          <Button
            onClick={() => {
              // Implement edit functionality
              toast.info("Edit asset functionality");
            }}
          >
            Edit Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssetsList;
