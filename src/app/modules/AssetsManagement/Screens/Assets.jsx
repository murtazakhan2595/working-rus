import React, { useEffect, useState } from "react";
import { Button } from "components/ui/button";
import { Header } from "components";
import CustomTable from "components/CustomTable";
import { Card, CardContent } from "components/ui/card";
import { useSelector } from "react-redux";
import { PageLoader } from "components";
import AddUpdateAsset from "./AddUpdateAsset";
import { getAssetList, getAssetById, deleteAsset } from "app/hooks/assets";
import { AssetsColumns } from "app/utils/Types/TableColumns";

const Assets = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: async (row) => {
      try {
        setIsLoading(true);
        // Fetch the complete asset details for viewing
        const assetDetails = await getAssetById(row.id);
        if (assetDetails) {
          setAssetToEdit(assetDetails);
          setOpenAddAssetModal(true);
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
      } finally {
        setIsLoading(false);
      }
    },
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetList({
          options: options,
          filterData: filterData,
        });
        

        if (response) {
          setAssetsList(response.results || []);
          setTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Assets", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options.page, options.sizePerPage]);

  const handleAddOrEditAsset = () => {
    setAssetToEdit(null); // Clear any previously selected asset
    setOpenAddAssetModal(true);
  };

  const handleCloseModal = () => {
    setAssetToEdit(null);
    setOpenAddAssetModal(false);
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      setIsLoading(true);
      const success = await deleteAsset(assetId);
      if (success) {
        fetchData(true);
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !assetsList.length) return <PageLoader />;

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={<Button onClick={handleAddOrEditAsset}>Add Asset</Button>}
      />

      <Card>
        <CardContent>
          <CustomTable
            columns={AssetsColumns}
            data={assetsList}
            pagination={true}
            dataTotalSize={totalCount}
            tableOptions={tableOptions}
            loading={isLoading}
          />
        </CardContent>
      </Card>

      {openAddAssetModal && (
        <AddUpdateAsset
          setIsOpen={handleCloseModal}
          isOpen={openAddAssetModal}
          assetToEdit={assetToEdit}
          viewMode={assetToEdit !== null} // Use view mode when clicking on a row
          reload={() => {
            fetchData(true);
          }}
        />
      )}
    </div>
  );
};

export default Assets;
