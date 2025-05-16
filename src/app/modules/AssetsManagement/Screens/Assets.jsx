import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header, PageLoader } from "components";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { Card, CardContent } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { toast } from "react-toastify";
import AddUpdateAsset from "./AddUpdateAsset";
import AddUpdateAssetCategory from "./AddUpdateAssetCategory";
import ViewCategory from "./ViewCategory";
import {
  getAssetList,
  getAssetById,
  getAssetCategories,
} from "app/hooks/assets";
import { AssetsColumns } from "app/utils/Types/TableColumns";
import AssetView from "./AssetView";

const Assets = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState("assets"); // "assets" or "categories"

  // Assets state
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [createAsset, setCreateAsset] = useState(false);
  const [viewAsset, setViewAsset] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [selectedAssetType, setSelectedAssetType] = useState("");

  // Asset Categories state
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesTotalCount, setCategoriesTotalCount] = useState(0);
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryToView, setCategoryToView] = useState(null);
  const [categoriesFilterData, setCategoriesFilterData] = useState({});

  // NEW: Categories for filter dropdown
  const [filterCategories, setFilterCategories] = useState([]);

  // Pagination options
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Reset filter states when tab changes
  useEffect(() => {
    if (activeTab === "assets") {
      setFilterData({});
      setSelectedAssetType("");
    } else {
      setCategoriesFilterData({});
    }
    setOptions({ page: 1, sizePerPage: 10 });
  }, [activeTab]);

  const fetchCategoriesForFilter = async () => {
    try {
      // const response = await getAssetCategories({
      //   options: { page: 1, sizePerPage: 100 },
      //   filterData: { is_active: true }, // Only active categories for filtering
      // });
      // if (response?.results) {
      //   const formattedCategories = response.results.map((category) => ({
      //     value: category.id,
      //     label: category.name,
      //   }));
      //   setFilterCategories(formattedCategories);
      // }
    } catch (error) {
      console.error("Error fetching categories for filter:", error);
    }
  };

  // Fetch categories for filter when component mounts or when categories tab data is updated
  useEffect(() => {
    // fetchCategoriesForFilter();
  }, [categoriesList]); // Refetch when categories list changes

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

  const fetchCategoriesData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetCategories({
          options,
          filterData: categoriesFilterData,
        });

        if (response) {
          setCategoriesList(response.results || []);
          setCategoriesTotalCount(response.count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching Asset Categories", error);
      toast.error("Failed to load asset categories");
    } finally {
      if (isMounted) setIsLoading(false);
    }
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

  const handleCategoriesFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    setCategoriesFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // TABLE OPTIONS for Assets
  const assetsTableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: async (row) => {
      try {
        setIsLoading(true);
        const assetDetails = await getAssetById(row.id);
        if (assetDetails) {
          setViewAsset(assetDetails);
        }
      } catch (error) {
        console.error("Error fetching asset details:", error);
        toast.error("Failed to load asset details");
      } finally {
        setIsLoading(false);
      }
    },
  };

  const categoriesTableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setCategoryToView(row);
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (activeTab === "assets") {
      fetchAssetsData(isMounted);
    } else {
      fetchCategoriesData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, options, filterData, categoriesFilterData]);

  const tabsData = [
    { value: "assets", label: "Assets" },
    { value: "categories", label: "Asset Category" },
  ];

  const assetsFilters = [
    {
      type: "search",
      placeholder: "Asset Name",
      name: "asset_name",
    },
    {
      type: "select-one",
      option: filterCategories, // NOW using dynamic categories from backend
      name: "category_id", // Changed from asset_type to category_id to match backend
      placeholder: "Category",
      values: selectedAssetType,
    },
  ];

  const categoriesFilters = [
    {
      type: "search",
      placeholder: "Category Name",
      name: "category_name",
    },
  ];

  // Updated columns for Asset Categories
  const categoriesColumns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "name",
      text: "Category Name",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    {
      dataField: "is_active",
      text: "Status",
      sort: true,
      formatter: (cell) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            cell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {cell ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      dataField: "created_at",
      text: "Created Date",
      sort: true,
      formatter: (cell) => {
        if (!cell) return "N/A";
        return new Date(cell).toLocaleDateString();
      },
    },
  ];

  const getActionButton = () => {
    if (activeTab === "assets") {
      return <Button onClick={()=>{setCreateAsset(true)}}>Add Asset</Button>;
    } else {
      return (
        <Button onClick={() => setCreateCategory(true)}>Create Category</Button>
      );
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header content={getActionButton()} />

      <Tabs
        value={activeTab}
        onValueChange={(newTab) => {
          setIsLoading(false);
          setActiveTab(newTab);
        }}
        defaultValue="assets"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-40 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 lg:mt-0 md:mt-0 xl:mt-0"
          >
            <FilterInput
              filters={
                activeTab === "assets" ? assetsFilters : categoriesFilters
              }
              onChange={
                activeTab === "assets"
                  ? handleAssetsFilterChange
                  : handleCategoriesFilterChange
              }
            />
          </div>
        </div>

        <Card>
          <CardContent>
            <TabsContent value="assets">
              <CustomTable
                columns={AssetsColumns}
                data={isLoading ? [] : assetsList}
                pagination={true}
                dataTotalSize={totalCount}
                tableOptions={assetsTableOptions}
                loading={isLoading}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CustomTable
                columns={categoriesColumns}
                data={isLoading ? [] : categoriesList}
                pagination={true}
                dataTotalSize={categoriesTotalCount}
                tableOptions={categoriesTableOptions}
                loading={isLoading}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {createAsset && (
        <AddUpdateAsset
          isOpen={createAsset}
          setIsOpen={setCreateAsset}
          reload={() => fetchAssetsData(true)}
        />
      )}
      {viewAsset && (
        <AssetView
          isOpen={viewAsset}
          setIsOpen={() => setViewAsset(null)}
          reload={() => fetchAssetsData(true)}
          data={viewAsset}
        />
      )}

      {createCategory && (
        <AddUpdateAssetCategory
          isOpen={createCategory}
          setIsOpen={setCreateCategory}
          reload={() => fetchCategoriesData(true)}
        />
      )}

      {/* Category View Modal - Simple pattern */}
      {categoryToView && (
        <ViewCategory
          isOpen={categoryToView}
          setIsOpen={() => setCategoryToView(null)}
          data={categoryToView}
          reload={() => fetchCategoriesData(true)}
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

export default connect(mapStateToProps)(Assets);
