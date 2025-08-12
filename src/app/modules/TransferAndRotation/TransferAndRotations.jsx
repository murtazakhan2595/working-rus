"use client";
import React, { useState } from "react";
import { SheetComp, FormComp } from "./subComponents";
import { HasAccess } from "utils/PermissionUtils";
import { UnauthorizedAccess } from "components";

export default function MyJobRotationPage() {
  const [requestRotation, setRequestRotation] = useState(false);
  const VIEW_JOB_ROTATION = HasAccess("VIEW_JOB_ROTATION");
  const REQUEST_JOB_ROTATION = HasAccess("REQUEST_JOB_ROTATION");

  if (!VIEW_JOB_ROTATION) {
    return (
      <UnauthorizedAccess message="You do not have permission to view job rotation." />
    );
  }

  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-2xl">Job Rotation</h4>
        {REQUEST_JOB_ROTATION && (
          <button
            className="btn"
            onClick={() => setRequestRotation(true)}
          >
            Request Rotation
          </button>
        )}
        <SheetComp isOpen={requestRotation} onClose={() => setRequestRotation(false)} />
      </div>
      <FormComp />
    </div>
  );
}