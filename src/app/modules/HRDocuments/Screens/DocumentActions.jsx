import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Document, DocumentAssignment } from "app/utils/Types/HRDocuments";
import { validationHRDocumentFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { HRDocumentTargetAudience, HRDocumentCategory } from "data/Data";
import {
  RadioGroupInput,
  TextAreaInput,
  SelectInputComponent,
  DateInput,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";
import { SheetUI } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  getHRDocumentData,
  addUpdateHRDocumentDetails,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";
import { AssignDocumentForm } from "app/modules/HRDocuments/Screens";
import { Eye, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import DropdownActionMenu from "components/DropdownActionMenu";

// ActionVariant = [assign_document,view_detail];

const DocumentActions = ({ reloadData = () => {}, variant = "", document, showAction = true }) => {
  const navigate = useNavigate();
  const [OpenUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  
  const handleAssignDocument = (event) => {
    event.preventDefault();
    setOpenUploadDocumentForm(true);
  };
  
  const handleViewDetails = (event) => {
    event.preventDefault();
    navigate(`/documents/detail`, {
      state: {
        GOTO_URLS: `/documents/`,
        document_id: document.id,
      },
    });
  };
  
  if (!document || !document.id) return null;
  
  return (
    <>
      <DropdownActionMenu
        onView={handleViewDetails}
        onEdit={showAction ? handleAssignDocument : undefined}
        viewText="View Details"
        editText="Assign Document"
        menuTooltip="Document Actions"
      />
      
      {OpenUploadDocumentForm && (
        <AssignDocumentForm
          isOpen={OpenUploadDocumentForm}
          setIsOpen={() => {
            setOpenUploadDocumentForm(false);
            reloadData(true);
          }}
          assign_document={true}
          document_id={document.id}
        />
      )}
    </>
  );
};

export default DocumentActions;
