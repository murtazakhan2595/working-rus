import React, { useState, useEffect } from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import { AddUpdateDelegateLevels } from "app/modules/ApprovalHierarchy";
import {
  getDelegateLevelData,
  getHierarchyLevelData,
} from "app/hooks/approvalHierarchy";
const DelegateDetails = ({
  isOpen,
  setIsOpen,
  current_id,
  reloadData = () => {},
  LevelDelegateList = [],
}) => {
  const [currentItemData, setCurrentItemData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define the fields to display
  const fields = [
    { key: "branch", label: "Branch" },
    { key: "department", label: "Department" },
    { key: "delegate", label: "Delegate User" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
    { key: "reason", label: "Reason" },
  ];

  const fetchData = async (id, isMounted) => {
    try {
      setIsLoading(true);
      const response = await getDelegateLevelData(id);
      if (isMounted) {
        if (response.level) {
          const responseLevel = await getHierarchyLevelData(response.level);
          setCurrentItemData({ ...responseLevel, ...response });
        } else {
          setCurrentItemData(response);
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    if (current_id) fetchData(current_id, isMounted);
    return () => {
      isMounted = false;
    };
  }, [current_id]);

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Delegate Detail"
      dataList={LevelDelegateList}
      loading={isLoading}
      reloadData={reloadData}
      editComponent={AddUpdateDelegateLevels}
      currentItemDetails={currentItemData}
      apiEndpoint={`/delegations/`}
      refreshEndpoint="/delegations"
      fetchCurrentItemDetails={fetchData}
      deleteItemName="Delegate"
      editTooltip="Edit Delegate"
      deleteTooltip="Delete Delegate"
      //   additionalEditProps={{
      //     editMode: true,
      //     branchData: data,
      //   }}
    >
      <DetailContent title="Delegate Details" fields={fields} />
    </NavigationSheetComponent>
  );
};

export default DelegateDetails;
