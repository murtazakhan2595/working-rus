import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header, PageLoader } from "components";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { Card, CardContent } from "components/ui/card";
import { toast } from "react-toastify";
import AddUpdateAsset from "./AddUpdateAsset";
import { getAssetList, getAssetById } from "app/hooks/assets";
import { AssetsColumns } from "app/utils/Types/TableColumns";
import { AssetCategories } from "data/Data";

const Assets = ({ userProfile }) => {
  // Assets state
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [openAddAssetModal, setOpenAddAssetModal] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [selectedAssetType, setSelectedAssetType] = useState("");

  // Pagination options
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const fetchAssetsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetList({
          options,
          filterData,
        });

        if (response) {
          setAssetsList(response.results || []);
          setTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Assets", error);
      toast.error("Failed to load assets");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const handleAddOrEditAsset = () => {
    setAssetToEdit(null);
    setOpenAddAssetModal(true);
  };

  const handleCloseModal = () => {
    setAssetToEdit(null);
    setOpenAddAssetModal(false);
  };

  const handleAssetsFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    // Update selected values for UI display
    if (filterName === "asset_type") {
      setSelectedAssetType(filterValue);
    }

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // TABLE OPTIONS
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: async (row) => {
      try {
        setIsLoading(true);
        const assetDetails = await getAssetById(row.id);
        if (assetDetails) {
          setAssetToEdit(assetDetails);
          setOpenAddAssetModal(true);
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
        toast.error("Failed to load asset details");
      } finally {
        setIsLoading(false);
      }
    },
  };

  // Load data on component mount and when options/filters change
  useEffect(() => {
    let isMounted = true;
    fetchAssetsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData]);

  // Filters configuration
  const filters = [
    {
      type: "search",
      placeholder: "Asset Name",
      name: "asset_name",
    },
    {
      type: "select-one",
      option: AssetCategories,
      name: "asset_type",
      placeholder: "Asset Type",
      values: selectedAssetType,
    },
  ];

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={<Button onClick={handleAddOrEditAsset}>Add Asset</Button>}
      />

      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2 lg:mt-0 md:mt-0 xl:mt-0 ml-auto"
        >
          <FilterInput filters={filters} onChange={handleAssetsFilterChange} />
        </div>
      </div>

      <Card>
        <CardContent>
          <CustomTable
            columns={AssetsColumns}
            data={isLoading ? [] : assetsList}
            pagination={true}
            dataTotalSize={totalCount}
            tableOptions={tableOptions}
            loading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Asset Add/Edit Modal */}
      {openAddAssetModal && (
        <AddUpdateAsset
          isOpen={openAddAssetModal}
          setIsOpen={handleCloseModal}
          assetToEdit={assetToEdit}
          viewMode={assetToEdit !== null}
          reload={() => fetchAssetsData(true)}
        />
      )}
    </div>
  );
};

// Connect to Redux to get user profile
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Assets);
