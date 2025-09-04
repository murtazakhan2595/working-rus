import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ViewLetterRequest } from "./ViewLetterRequest";
import { AcceptRejectLetterForm } from "./AcceptRejectLetterForm";

export const LetterRequestActions = ({ request, reloadData = () => {} }) => {
  const [viewRequest, setViewRequest] = useState(false);
  const [acceptRejectForm, setAcceptRejectForm] = useState(false);

  const handleViewRequest = (event) => {
    event.preventDefault();
    setViewRequest(true);
  };

  const handleAcceptReject = (event) => {
    event.preventDefault();
    setAcceptRejectForm(true);
  };

  if (!request || !request.id) return null;

  const isPending = request.status === "PENDING";

  return (
    <>
      <DropdownActionMenu
        onView={handleViewRequest}
        onEdit={isPending ? handleAcceptReject : undefined}
        viewText="View Request"
        editText="Manage Request"
        menuTooltip="Letter Request Actions"
      />

      {viewRequest && (
        <ViewLetterRequest
          requestId={request.id}
          isOpen={viewRequest}
          setIsOpen={() => {
            setViewRequest(false);
            reloadData(true);
          }}
        />
      )}

      {acceptRejectForm && (
        <AcceptRejectLetterForm
          requestId={request.id}
          isOpen={acceptRejectForm}
          setIsOpen={() => {
            setAcceptRejectForm(false);
            reloadData(true);
          }}
        />
      )}
    </>
  );
};
