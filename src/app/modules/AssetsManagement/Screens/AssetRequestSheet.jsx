import { useState, useEffect } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  TextAreaInput,
  SelectInputComponent,
  DateInput,
} from "components/FormControl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import { connect } from "react-redux";
import {
  getAssetList,
  requestAsset,
  getAssetCategories,
  updateAsset,
} from "app/hooks/assets";
import { toast } from "react-toastify";
import { SheetCardExtension, DetailCard } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { validateAssetRequestForm } from "app/utils/FormSchema/AssetsFormSchema";
import { StatusButtons, StatusList } from "components";
import { handleRequest } from "app/hooks/general";

const AssetRequestSheet = ({
  userProfile,
  employees,
  reload,
  isOpen,
  setIsOpen,
  mode = "request", // "request" or "assign"
  departments = [],
  editData,
}) => {
  const isEdit = editData ? true : false;
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    isEdit ? editData?.category?.id || editData?.category_id : ""
  );
  const [initialValues, setInitialValues] = useState({
    category_id: "",
    asset_name: "",
    reason: "",
    additional_notes: "",
    employee: "",
    assign_date: new Date().toISOString().split("T")[0],
    return_date: null,
  });
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  const formSheetData = {
    title: mode === "request" ? "Asset Request" : "Assign Asset to Employee",
    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      setAssetsLoading(true);
      try {
        const categoriesResponse = await getAssetCategories({
          options: { page: 1, sizePerPage: 100 },
          filterData: { is_active: true },
        });

        if (categoriesResponse?.results) {
          const formattedCategories = categoriesResponse.results.map(
            (category) => ({
              value: category.id,
              label: category.name,
              dynamic_fields: category.dynamic_fields,
            })
          );
          setCategories(formattedCategories);
        }

        if (isEdit) {
          console.log("Asset request edit data", editData);
          setInitialValues({
            employee: editData?.employee?.id || editData?.asset_employee_id,
            assign_date:
              editData?.asset_assigned_date ||
              new Date().toISOString().split("T")[0],
            return_date: editData?.asset_returned_date || null,
            reason: editData?.reason || "",
            additional_notes: editData?.additional_notes || "",
            category_id: editData?.category?.id || editData?.category_id || "",
            asset_name: editData?.asset?.id || editData?.asset_name || "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setAssetsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, mode, editData]);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "assign" && selectedCategory) {
        try {
          const assetsResponse = await getAssetList({
            options: { page: 1, sizePerPage: 100 },
            filterData: {
              asset_status: "Unassigned",
              asset_category: selectedCategory,
            },
          });

          if (assetsResponse && assetsResponse.results) {
            const formattedAssets = assetsResponse.results.map((asset) => ({
              value: asset.id,
              label: asset.asset_name,
              category_id: asset.category_id,
            }));
            setAvailableAssets(formattedAssets);
          }
        } catch (error) {
          console.error("Error fetching assets:", error);
        }
      }
    };
    fetchData();
  }, [selectedCategory, mode]);

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      const payload = {
        id: isEdit ? editData.id : null,
        reason: values.reason,
        additional_notes: values.additional_notes,
        ...(mode === "request"
          ? {
              category_id: values.category_id,
              preferred_specifications: values.preferred_specifications || {},
              asset_employee_id: userProfile.id,
              asset_request_status: "Requested",
            }
          : {
              // Fixed assign mode payload structure
              asset_name: values.asset_name,
              asset_employee_id:
                typeof values.employee === "object"
                  ? values.employee.value
                  : values.employee,
              asset_assigned_date: values.assign_date,
              asset_assigned_by: userProfile.id,
              ...(values.return_date && {
                asset_returned_date: values.return_date,
              }),
              asset_request_status: isEdit
                ? editData?.asset_request_status
                : "Assigned",
              // Include category_id for consistency
              category_id: values.category_id,
            }),
      };

      // Remove null or undefined values from payload
      Object.keys(payload).forEach(
        (key) =>
          (payload[key] === null || payload[key] === undefined) &&
          delete payload[key]
      );

      console.log("Submitting payload:", payload);

      const response = await requestAsset(payload);
      console.log("Asset request response:", response);

      // Update asset status when assigning (only for new assignments)
      if (response && mode === "assign" && !isEdit && values.asset_name) {
        try {
          const assetManagementPayload = {
            id: values.asset_name,
            asset_status: "Assigned",
          };
          await updateAsset(assetManagementPayload);
        } catch (assetError) {
          console.error("Error updating asset status:", assetError);
          toast.warning("Request submitted but asset status update failed");
        }
      }

      if (response) {
        toast.success(
          mode === "request"
            ? "Asset request submitted successfully"
            : isEdit
            ? "Asset request updated successfully"
            : "Asset assigned successfully"
        );
        setIsOpen(false);
        reload();
      } else {
        toast.error(
          mode === "request"
            ? "Failed to submit asset request"
            : isEdit
            ? "Failed to update asset request"
            : "Failed to assign asset"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

 const handleApproveRequest = async () => {
   // Validation checks
   if (!editData?.category?.id && !editData?.category_id) {
     toast.error("Cannot approve: Please assign an asset category first");
     return;
   }

   // For assign mode, check if specific asset is assigned
   if (mode === "assign" && !editData?.asset?.id && !editData?.asset_name) {
     toast.error(
       "Cannot approve: Please assign a specific asset before approving this request"
     );
     return;
   }

   setLoading(true);
   try {
     // Step 1: Call the approval hierarchy API
     const hierarchyId =
       editData?.hierarchy_request || editData?.request || editData?.id;
     console.log("Calling approval API with hierarchy ID:", hierarchyId);

     const approvalResponse = await handleRequest(hierarchyId, true); // true = approve

     if (approvalResponse) {
       // Step 2: If asset is assigned, update its status to "Assigned"
       if (editData?.asset?.id || editData?.asset_name) {
         try {
           const assetId = editData.asset?.id || editData.asset_name;
           const assetStatusUpdatePayload = {
             id: assetId,
             asset_status: "Assigned",
           };
           await updateAsset(assetStatusUpdatePayload);
           console.log("Asset status updated to Assigned");
         } catch (assetError) {
           console.error("Error updating asset status:", assetError);
           toast.warning("Request approved but asset status update failed");
         }
       }

       toast.success("Request approved successfully!");
     } else {
       toast.warning(
         "Request status updated but approval hierarchy API failed"
       );
     }

     setIsOpen(false);
     reload();
   } catch (error) {
     console.error("Error in approval process:", error);
     toast.error("Error approving request: " + error.message);
   } finally {
     setLoading(false);
   }
 };

  // Show rejection reason modal
  const handleCustomReject = () => {
    setShowRejectReason(true);
  };

  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    setIsSubmittingRejection(true);
    try {
      // Step 1: Update request with rejection reason
      const updatedRequest = {
        id: editData.id,
        asset_status: "Rejected",
        rejection_reason: rejectionReason,
        asset_request_status: editData?.asset_request_status || "",
        asset_employee_id: editData?.asset_employee_id || "",
      };

      const response = await requestAsset(updatedRequest);
      if (!response) {
        toast.error("Failed to update request status");
        return;
      }

      // Step 2: Call rejection hierarchy API
      const hierarchyId =
        editData?.hierarchy_request || editData?.request || editData?.id;
      const rejectionResponse = await handleRequest(hierarchyId, false);

      if (rejectionResponse) {
        // ✅ ADD THIS: Step 3 - Revert asset status if asset was assigned
        if (editData?.asset?.id || editData?.asset_name) {
          try {
            const assetId = editData.asset?.id || editData.asset_name;
            const assetStatusRevertPayload = {
              id: assetId,
              asset_status: "Unassigned",
            };
            await updateAsset(assetStatusRevertPayload);
            console.log("Asset status reverted to Unassigned");
          } catch (assetError) {
            console.error("Error reverting asset status:", assetError);
            toast.warning("Request rejected but failed to revert asset status");
          }
        }

        toast.success("Request rejected successfully!");
      } else {
        toast.warning(
          "Request status updated but approval hierarchy API failed"
        );
      }

      setShowRejectReason(false);
      setRejectionReason("");
      setIsOpen(false);
      reload();
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Error rejecting request: " + error.message);
    } finally {
      setIsSubmittingRejection(false);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <div>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
        width="568px"
      >
        <Formik
          initialValues={initialValues}
          validate={(values) => validateAssetRequestForm(values, mode)}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {/* Employee Selection (only for assign mode) */}
              {mode === "assign" && (
                <SheetCardExtension title="Employee Information">
                  <SelectInputComponent
                    name="employee"
                    error={props.errors?.employee}
                    touch={props.touched?.employee}
                    value={props.values.employee}
                    label="Select Employee"
                    required={true}
                    options={employees}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    placeholder="Select an employee"
                    disabled={isEdit}
                  />
                </SheetCardExtension>
              )}

              {/* Asset Selection - Different for request vs assign */}
              <SheetCardExtension
                title={
                  mode === "request" ? "Asset Request Details" : "Asset Details"
                }
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2 mb-6">
                    <SelectInputComponent
                      name="category_id"
                      error={props.errors?.category_id}
                      touch={props.touched?.category_id}
                      value={props.values?.category_id}
                      label="Asset Category"
                      required={true}
                      options={categories}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                        setSelectedCategory(value);
                      }}
                      placeholder={
                        assetsLoading
                          ? "Loading categories..."
                          : "Select a category"
                      }
                      isLoading={assetsLoading}
                      disabled={isEdit}
                    />
                  </div>
                  <div className="flex-1 space-y-2 mb-6">
                    {mode === "assign" && (
                      <SelectInputComponent
                        name="asset_name"
                        error={props.errors?.asset_name}
                        touch={props.touched?.asset_name}
                        value={props.values?.asset_name}
                        label="Asset Name"
                        required={true}
                        options={availableAssets}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder={
                          assetsLoading
                            ? "Loading assets..."
                            : "Select an asset"
                        }
                        isLoading={assetsLoading}
                      />
                    )}
                  </div>
                </div>
                {/* Additional fields for assign mode */}
                <div className="flex items-center gap-4">
                  {mode === "assign" && (
                    <>
                      <div className="flex-1 space-y-2 mb-6">
                        <DateInput
                          name="assign_date"
                          error={props.errors?.assign_date}
                          touch={props.touched?.assign_date}
                          value={props.values.assign_date}
                          label="Assign Date"
                          required={true}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                          placeholder="Select assign date"
                        />
                        <DateInput
                          name="return_date"
                          error={props.errors?.return_date}
                          touch={props.touched?.return_date}
                          value={props.values.return_date}
                          label="Return Date (if applicable)"
                          required={false}
                          onChange={(field, value) => {
                            props.setFieldValue(field, value);
                          }}
                          placeholder="Select return date"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1 space-y-2 mb-6">
                  <TextAreaInput
                    name="reason"
                    error={props.errors?.reason}
                    touch={props.touched?.reason}
                    value={props.values?.reason}
                    label={
                      mode === "request"
                        ? "Reason for Request"
                        : "Reason for Assignment"
                    }
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder={
                      mode === "request"
                        ? "Explain why you need this asset"
                        : "Explain why this asset is being assigned"
                    }
                  />
                </div>
                <div className="flex-1 space-y-2 mb-6">
                  <TextAreaInput
                    name="additional_notes"
                    error={props.errors?.additional_notes}
                    touch={props.touched?.additional_notes}
                    value={props.values?.additional_notes}
                    label="Additional Notes"
                    required={false}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder="Any additional information (optional)"
                  />
                </div>
              </SheetCardExtension>

              {/* Approval Details Section (only show in edit mode) */}
              {isEdit &&
                editData?.approval_details &&
                editData.approval_details.length > 0 && (
                  <DetailCard
                    detailCardTitle="Approval Details"
                    className="mt-4"
                  >
                    <StatusList
                      status_list={editData.approval_details}
                      className="my-3"
                    />
                  </DetailCard>
                )}

              {/* StatusButtons for approval hierarchy (only show in edit mode for pending requests) */}
              {isEdit && (
                <StatusButtons
                  permissionKey={["MANAGE_ASSET_REQUEST"]}
                  permissionLogic="OR"
                  status={editData?.status || editData?.asset_status}
                  current_approver={editData?.current_approver || []}
                  request_id={
                    editData?.hierarchy_request ||
                    editData?.request ||
                    editData?.id
                  }
                  // Custom handlers
                  onApprove={handleApproveRequest}
                  onReject={handleCustomReject}
                  // Customize button text
                  approveText="Approve Request"
                  rejectText="Reject with Reason"
                />
              )}

              {/* Regular Form Buttons for form submission */}
              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={loading || assetsLoading}
                >
                  {loading
                    ? mode === "request"
                      ? "Submitting..."
                      : isEdit
                      ? "Updating..."
                      : "Assigning..."
                    : mode === "request"
                    ? "Submit Request"
                    : isEdit
                    ? "Update Request"
                    : "Assign Asset"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>

      {/* Rejection Reason Dialog */}
      <RejectionReasonDialog
        open={showRejectReason}
        onOpenChange={setShowRejectReason}
        onSubmit={handleRejectWithReason}
        isSubmitting={isSubmittingRejection}
        reason={rejectionReason}
        setReason={setRejectionReason}
      />
    </div>
  );
};

const RejectionReasonDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  reason,
  setReason,
}) => {
  const [touched, setTouched] = useState(false);

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      setReason("");
      setTouched(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejection Reason</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TextAreaInput
            name="rejection_reason"
            error={touched && reason.trim() === ""}
            touch={touched}
            value={reason}
            label={"Rejection Reason"}
            required={true}
            onChange={(field, value) => {
              setReason(value);
            }}
            maxRows={3}
            placeholder={"Please provide a reason for rejecting this request"}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={reason.trim() === "" || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    employees: state.emp.employees || [],
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(AssetRequestSheet);
