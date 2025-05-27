import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Button } from "components/ui/button";
import { Header, PageLoader, UnauthorizedAccess } from "components";
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
  deleteAsset,
  getCategoryById,
} from "app/hooks/assets";
import { deleteRecord } from "app/hooks/general";
import { AssetsColumns as BaseAssetsColumns } from "app/utils/Types/TableColumns";
import AssetView from "./AssetView";
import AlertDialogue from "components/ui/AlertDialogue";
import DropdownActionMenu from "components/DropdownActionMenu";
import { assetStatus } from "data/Data";
import { CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { HasAccess } from "utils/PermissionUtils";
import { useSelector } from "react-redux";

const Assets = ({ userProfile }) => {
  // Permission checks for asset management features
  const canViewAssets = HasAccess("VIEW_ASSET");
  const canCreateAsset = HasAccess("ADD_ASSET");
  const canUpdateAsset = HasAccess("EDIT_ASSET");
  const canDeleteAsset = HasAccess("DELETE_ASSET");
  const canExportAssets = HasAccess("EXPORT_ASSETS");
  
  // Permission checks for asset category features
  const canViewCategories = HasAccess("VIEW_ASSET_CATEGORY");
  const canCreateCategory = HasAccess("ADD_ASSET_CATEGORY");
  const canUpdateCategory = HasAccess("EDIT_ASSET_CATEGORY");
  const canDeleteCategory = HasAccess("DELETE_ASSET_CATEGORY");



  const [activeTab, setActiveTab] = useState("assets");

  // Assets state
  const [isLoading, setIsLoading] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [createAsset, setCreateAsset] = useState(false);
  const [viewAsset, setViewAsset] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Asset Categories state
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesTotalCount, setCategoriesTotalCount] = useState(0);
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryToView, setCategoryToView] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoriesFilterData, setCategoriesFilterData] = useState({});
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [openCategoryDeleteAlert, setOpenCategoryDeleteAlert] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [selectedAssetStatus, setSelectedAssetStatus] = useState("");
  const [ordering, setOrdering] = useState("-id");

  const [filterCategories, setFilterCategories] = useState([]);

  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  useEffect(() => {
    if (activeTab === "assets") {
      setFilterData({});
      setSelectedAssetType("");
      setSelectedAssetStatus("");
    } else {
      setCategoriesFilterData({});
    }
    setOptions({ page: 1, sizePerPage: 10 });
  }, [activeTab]);

  const fetchCategoriesForFilter = async () => {
    try {
      const response = await getAssetCategories({
        options: { page: 1, sizePerPage: 100 },
      });
      if (response?.results) {
        const formattedCategories = response.results.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setFilterCategories(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories for filter:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "assets") {
      fetchCategoriesForFilter();
    }
  }, [categoriesList, activeTab]); 

  const fetchAssetsData = async (isMounted = true) => {
    setIsLoading(true);
    try {
      if (isMounted) {
        const response = await getAssetList({
          options,
          filterData,
          ordering,
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
          ordering,
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
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    if (filterName === "asset_category") {
      setSelectedAssetType(filterValue);
    } else if (filterName === "asset_status") {
      setSelectedAssetStatus(filterValue);
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

  // Handle asset deletion
  const confirmDeleteAsset = async () => {
    if (!assetToDelete?.id) return;

    setIsDeleting(true);
    try {
      const success = await deleteAsset(assetToDelete.id);
      if (success) {
        toast.success(`Asset "${assetToDelete.asset_name}" deleted successfully`);
        fetchAssetsData(true);
      } else {
        toast.error("Failed to delete asset");
      }
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("An error occurred while deleting the asset");
    } finally {
      setIsDeleting(false);
      setOpenDeleteAlert(false);
      setAssetToDelete(null);
    }
  };

  // Function to view asset details
  const viewAssetDetails = async (row) => {
    console.log("Viewing asset details for:", row);
    try {
      const assetDetails = await getAssetById(row.id);
      if (assetDetails) {
        setViewAsset(assetDetails);
      }
    } catch (error) {
      console.error("Error fetching asset details:", error);
      toast.error("Failed to load asset details");
    }
  };

  const reloadAssets = async (force = true) => {
    if (force) {
      setAssetsList([]);
      setTimeout(() => {
        fetchAssetsData(true);
      }, 100);
    } else {
      fetchAssetsData(true);
    }
  };

  const assetsTableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    onRowClick: (row) => {
      viewAssetDetails(row);
    },
    formatExtraData: {
      onRowClick: (row) => {
        viewAssetDetails(row);
      },
      setViewAsset,
      setCreateAsset,
      setAssetToDelete,
      setOpenDeleteAlert,
      toast,
    },
  };

  const categoriesTableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
    onRowClick: (row) => {
      setCategoryToView(row);
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (isLoading) return;
    if (activeTab === "assets") {
      fetchAssetsData(isMounted);
    } else {
      fetchCategoriesData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, options, filterData, categoriesFilterData, ordering]);

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
      option: filterCategories,
      name: "asset_category",
      placeholder: "Category",
      values: selectedAssetType,
    },
    {
      type: "select-two", 
      option: assetStatus,
      name: "asset_status",
      placeholder: "Status",
      values: selectedAssetStatus,
    },
  ];

  const categoriesFilters = [
    {
      type: "search",
      placeholder: "Category Name",
      name: "category_name",
    },
  ];

  const categoriesColumns = [
    {
      dataField: "id",
      text: "ID",
      hidden: true,
      dataSort: true,
      formatter: (cell) => <span>CAT-{String(cell).padStart(4, "0")}</span>,
    },
    {
      dataField: "name",
      text: "Category Name",
      sort: true,
      dataSort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
      dataSort: true,
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
      dataField: "",
      text: "Actions",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        // Function to view category details
        const openCategoryView = () => {
          const viewModule = window.AssetsModule;

          if (viewModule) {
            viewModule.setCategoryToView(row);
          }
        };

        // Function to open the edit category form
        const openCategoryEdit = async () => {
          try {
            const viewModule = window.AssetsModule;

            if (viewModule) {
              // This sets categoryToView = row
              viewModule.setCategoryToView(row);
              // This sets createCategory = true
              viewModule.setCreateCategory(true);
            }
          } catch (error) {
            console.error("Error preparing category for edit:", error);
            toast.error("Failed to prepare category for editing");
          }
        };

        // Function to open delete confirmation
        const openDeleteConfirm = () => {
          const viewModule = window.AssetsModule;

          if (viewModule) {
            viewModule.setCategoryToDelete(row);
            viewModule.setOpenCategoryDeleteAlert(true);
          }
        };

        const handleView = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openCategoryView();
        };

        const handleEdit = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openCategoryEdit();
        };

        const handleDelete = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDeleteConfirm();
        };

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownActionMenu
              onView={canViewCategories ? handleView : null}
              onEdit={canUpdateCategory ? handleEdit : null}
              onDelete={canDeleteCategory ? handleDelete : null}
              viewText="View Category"
              editText="Edit Category"
              deleteText="Delete Category"
              menuTooltip="Category Actions"
              showEdit={canUpdateCategory}
              showDelete={canDeleteCategory}
              showView={canViewCategories}
            />
          </div>
        );
      },
    },
  ];

  // Create permission-aware assets columns
  const AssetsColumns = [
    ...BaseAssetsColumns.slice(0, -1), // All columns except the last one (Actions)
    {
      dataField: "",
      text: "Actions",
      formatter: (cell, row, rowIndex, formatExtraData) => {
        // Function to open the view sheet for an asset
        const openAssetView = async () => {
          try {
            const viewModule = window.AssetsModule;
            if (viewModule) {
              const assetDetails = await getAssetById(row.id);
              if (assetDetails) {
                viewModule.setViewAsset(assetDetails);
              }
            }
          } catch (error) {
            console.error("Error fetching asset details:", error);
            toast.error("Failed to load asset details");
          }
        };

        // Function to open the edit sheet
        const openAssetEdit = async () => {
          try {
            const viewModule = window.AssetsModule;
            if (viewModule) {
              const assetDetails = await getAssetById(row.id);
              if (assetDetails) {
                viewModule.setViewAsset(assetDetails);
                viewModule.setCreateAsset(true);
              }
            }
          } catch (error) {
            console.error("Error fetching asset details:", error);
            toast.error("Failed to load asset details");
          }
        };

        // Function to open delete confirmation
        const openDeleteConfirm = () => {
          const viewModule = window.AssetsModule;
          if (viewModule) {
            viewModule.setAssetToDelete(row);
            viewModule.setOpenDeleteAlert(true);
          }
        };

        const handleView = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAssetView();
        };

        const handleEdit = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openAssetEdit();
        };

        const handleDelete = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openDeleteConfirm();
        };

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownActionMenu
              onView={canViewAssets ? handleView : null}
              onEdit={canUpdateAsset ? handleEdit : null}
              onDelete={canDeleteAsset ? handleDelete : null}
              viewText="View Asset"
              editText="Edit Asset"
              deleteText="Delete Asset"
              menuTooltip="Asset Actions"
              showView={canViewAssets}
              showEdit={canUpdateAsset}
              showDelete={canDeleteAsset}
            />
          </div>
        );
      },
    },
  ];

  const getActionButton = () => {
    if (activeTab === "assets" && canCreateAsset) {
      return <Button onClick={()=>{setCreateAsset(true)}}>Add Asset</Button>;
    } else if (activeTab === "categories" && canCreateCategory) {
      return (
        <Button onClick={() => setCreateCategory(true)}>Add Category</Button>
      );
    }
    return null;
  };

  // Expose state setters for dropdown actions to access
  useEffect(() => {
    window.AssetsModule = {
      setViewAsset,
      setCreateAsset,
      setAssetToDelete,
      setOpenDeleteAlert,
      // Add category-related functions
      setCategoryToView,
      setCreateCategory,
      setCategoryToDelete,
      setOpenCategoryDeleteAlert,
      setCategoryToEdit
    };

    // Cleanup function
    return () => {
      delete window.AssetsModule;
    };
  }, []);

  // Confirm and execute category deletion
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete?.id) return;

    setIsDeletingCategory(true);
    try {
      const success = await deleteRecord(`/asset-categories/${categoryToDelete.id}`, categoryToDelete.name);
      
      if (success) {
        toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
        fetchCategoriesData(true);
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("An error occurred while deleting the category");
    } finally {
      setIsDeletingCategory(false);
      setOpenCategoryDeleteAlert(false);
      setCategoryToDelete(null);
    }
  };

  // If user has no asset management permissions at all
  if (!canViewAssets && !canViewCategories) {
    return (
      <UnauthorizedAccess
        title="Asset Management Access Denied"
        featureName="asset management features"
        message="You don't have permission to view or manage assets. Please contact your administrator to request access."
        showButtons={true}
        size="lg"
      />
    );
  }

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
        <div className="flex flex-col items-start justify-between mb-4 lg:flex-row md:flex-row xl:flex-row">
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
         
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              {activeTab === "assets" ? "Assets" : "Asset Categories"}
            </CardTitle>
            <CardDescription className="text-neutral-1100">
              {activeTab === "assets" ? "Here you can manage your assets. Add, edit, or delete assets as needed." : "Here you can manage your asset categories. Add, edit, or delete categories as needed."}
            </CardDescription>
            <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-end mt-2 lg:mt-0 md:mt-0 xl:mt-0"
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
          </CardHeader>
          <CardContent>
            <TabsContent value="assets">
              {canViewAssets ? (
                <CustomTable
                  columns={AssetsColumns}
                  data={isLoading ? [] : assetsList}
                  pagination={true}
                  dataTotalSize={totalCount}
                  tableOptions={assetsTableOptions}
                  loading={isLoading}
                />
              ) : (
                <UnauthorizedAccess
                  title="Assets Access Denied"
                  featureName="assets"
                  message="You don't have permission to view assets."
                  size="md"
                />
              )}
            </TabsContent>

            <TabsContent value="categories">
              {canViewCategories ? (
                <CustomTable
                  columns={categoriesColumns}
                  data={isLoading ? [] : categoriesList}
                  pagination={true}
                  dataTotalSize={categoriesTotalCount}
                  tableOptions={categoriesTableOptions}
                  loading={isLoading}
                />
              ) : (
                <UnauthorizedAccess
                  title="Categories Access Denied"
                  featureName="asset categories"
                  message="You don't have permission to view asset categories."
                  size="md"
                />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {createAsset && (
        <AddUpdateAsset
          isOpen={createAsset}
          setIsOpen={(isOpen) => {
            setCreateAsset(isOpen);
            if (!isOpen) {
              // Clear the viewAsset when closing the form if it was opened for editing
              setViewAsset(null);
              // Reload assets data after closing the form
              reloadAssets(true);
            }
          }}
          reload={() => reloadAssets(true)}
          assetToEdit={viewAsset}
        />
      )}
      {viewAsset && !createAsset && (
        <AssetView
          isOpen={!!viewAsset}
          setIsOpen={() => setViewAsset(null)}
          reload={() => reloadAssets(true)}
          data={viewAsset}
          canEdit={canUpdateAsset}
          canDelete={canDeleteAsset}
        />
      )}

      {createCategory && (
        <AddUpdateAssetCategory
          isOpen={createCategory}
          setIsOpen={(isOpen) => {
            setCreateCategory(isOpen);
            if (!isOpen) {
              // Clear the categoryToView when closing the form if it was opened for editing
              setCategoryToView(null);
            }
          }}
          reload={() => fetchCategoriesData(true)}
          categoryToEdit={categoryToView}
        />
      )}

      {/* Category View Modal - Only show when not in edit mode */}
      {categoryToView && !createCategory && (
        <ViewCategory
          isOpen={!!categoryToView}
          setIsOpen={() => setCategoryToView(null)}
          data={categoryToView}
          reload={() => fetchCategoriesData(true)}
          canEdit={canUpdateCategory}
          canDelete={canDeleteCategory}
        />
      )}

      {/* Delete Asset Confirmation Dialog */}
      {openDeleteAlert && assetToDelete && (
        <AlertDialogue
          title="Confirm Delete?"
          description={
            <div className="space-y-3">
              <p>
                This action will permanently delete the asset{" "}
                <strong>"{assetToDelete?.asset_name}"</strong>.
              </p>
              <p className="font-medium text-red-600">
                This action cannot be undone. All information associated with
                this asset will be permanently removed.
              </p>
            </div>
          }
          isOpen={openDeleteAlert}
          setIsOpen={setOpenDeleteAlert}
          handleContinue={confirmDeleteAsset}
          continueText={isDeleting ? "Deleting..." : "Delete Asset"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeleting}
        />
      )}

      {/* Delete Category Confirmation Dialog */}
      {openCategoryDeleteAlert && categoryToDelete && (
        <AlertDialogue
          title="Confirm Delete?"
          description={
            <div className="space-y-3">
              <p>
                This action will permanently delete the category{" "}
                <strong>"{categoryToDelete?.name}"</strong>.
              </p>
              <p className="font-medium text-red-600">
                This action cannot be undone. All assets associated with
                this category may be affected.
              </p>
            </div>
          }
          isOpen={openCategoryDeleteAlert}
          setIsOpen={setOpenCategoryDeleteAlert}
          handleContinue={confirmDeleteCategory}
          continueText={isDeletingCategory ? "Deleting..." : "Delete Category"}
          cancelText="Cancel"
          variant="destructive"
          disabled={isDeletingCategory}
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
