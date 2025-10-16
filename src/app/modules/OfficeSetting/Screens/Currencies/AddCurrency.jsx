import React, { useState } from "react";
import {AddUpdateCurrencyForm} from "app/modules/OfficeSetting/Screens";
import { Button } from "components/ui/button";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";

const AddCurrency = ({ reloadData = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const permissions = useOfficeSettingPermissions();

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  if (!permissions.currency.canCreate) {
    return null;
  }

  return (
    <>
      <Button onClick={handleClick}>Add New Currency</Button>
      {isOpen && (
        <AddUpdateCurrencyForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reloadData={reloadData}
        />
      )}
    </>
  );
};

export default AddCurrency;
