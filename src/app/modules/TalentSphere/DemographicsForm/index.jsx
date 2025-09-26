import React, { useState,useRef, useEffect } from 'react';
import { Button } from "components/ui/button";
import { CardHeader, CardTitle } from "components/ui/card";
import DemoGraphicsTable from './DemographicsTable';
import DemographicsSheet from './DemographicsSheet'
import { getDemographicFormsList } from 'app/hooks/talentSphere';

const DemoGraphics = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formsList, setFormsList] = useState(true);

  const handleAdd = () => {
    setSelectedId(null);
    setIsOpen(true);
  };

  useEffect(()=>{
   const fetchdata = async()=>{
    const res = await getDemographicFormsList();
    if(res.count > 0){
      setFormsList(true)
    }else{
      setFormsList(false)
    }
   }
   fetchdata()
  },[])

  const tableRef = useRef();

  return (
    <>
      <CardHeader className="items-start p-6">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-black xl:text-2xl lg:text-xl md:text-lg">
            Talent Sphere
          </div>
          <div className="flex flex-row gap-4">
            <Button onClick={handleAdd} disabled={formsList? true : false}>
              {formsList?"Already Exit":"Add"} Demographics Form
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <DemoGraphicsTable ref={tableRef} setIsOpen={setIsOpen} setSelectedId={setSelectedId} />

      {/* Sheet Component */}
      <DemographicsSheet
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        id={selectedId}
        reloadData={() => { tableRef.current.reload() }}
      />
    </>
  );
};

export default DemoGraphics;
