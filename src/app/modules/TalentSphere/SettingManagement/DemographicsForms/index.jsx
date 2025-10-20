import React, { useState, useRef, useEffect } from "react";
import { Button } from "components/ui/button";
import { CardHeader, CardTitle } from "components/ui/card";
import DemoGraphicsTable from "./DemographicsTable";
import DemographicsSheet from "./DemographicsSheet";
import { getDemographicFormsList } from "app/hooks/talentSphere";

const DemoGraphics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formsList, setFormsList] = useState(true);

  // 👇 trigger for reload
  const [reloadKey, setReloadKey] = useState(0);

  const tableRef = useRef();

  const handleAdd = () => {
    setSelectedId(null);
    setIsOpen(true);
  };

  useEffect(() => {
    const fetchdata = async () => {
      const res = await getDemographicFormsList();
      setFormsList(res.count > 0);
    };
    fetchdata();
  }, [reloadKey]);

  const handleReload = () => {
    tableRef.current?.reload();
    setReloadKey((prev) => prev + 1); 
  };

  return (
    <>
      <CardHeader className="items-start p-6">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-black xl:text-2xl lg:text-xl md:text-lg">
            Talent Sphere
          </div>
          <div className="flex flex-row gap-4">
            <Button onClick={handleAdd} disabled={formsList}>
              {formsList ? "Already Exist" : "Add"} Demographics Form
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <DemoGraphicsTable
        ref={tableRef}
        setIsOpen={setIsOpen}
        setSelectedId={setSelectedId}
          onDataChange={() => setReloadKey((prev) => prev + 1)}

      />

      {/* Sheet Component */}
      <DemographicsSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id={selectedId}
        reloadData={handleReload} 
      />
    </>
  );
};

export default DemoGraphics;
