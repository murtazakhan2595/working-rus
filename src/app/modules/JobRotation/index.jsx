"use client";
import React , {useState} from "react";
import { SheetComp, FormComp } from "./subComponents";

export default function MyJobRotationPage() {

    const [requestRotation , setRequestRotation] = useState(false);


  return (
    <>
      <div className="flex flex-between items-center justify-between p-4">
        <h4 className="text-bold text-2xl">Job Rotation</h4>
        <div>
          <SheetComp isOpen={requestRotation}  />
        </div>
      </div>
      <FormComp />
    </>
  );
}
