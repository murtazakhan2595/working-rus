import React, { useState } from "react";
import Documents from "app/modules/HRDocuments/Documents";
import MyDocuments from "app/modules/HRDocuments/MyDocuments";
import MyLetterRequests from "app/modules/HRDocuments/Screens/LetterRequest/MyLetterRequest";
import LetterRequests from "app/modules/HRDocuments/Screens/LetterRequest/LetterRequests";
import Category from "app/modules/HRDocuments/Category";
import {
  UploadDocumentForm,
  CategoryForm,
  DocumentDetails,
} from "app/modules/HRDocuments/Screens";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Header } from "components";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";

const HRDocumentsTab = ["Documents", "Category", "Letter Requests"];

function HRDocuments() {
  const [OpenUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [OpenCategoryForm, setOpenCategoryForm] = useState(false);
  const [activeHRDocumentsTab, setActiveHRDocumentsTab] = useState("Documents");
  const [reloadData, setReloadData] = useState(false);
  const uploadHRDocumentPermitted = HasAccess("UPLOAD_HR_DOCUMENT");
  const addDocumentCategoryPermitted = HasAccess("ADD_DOCUMENT_CATEGORY");
  const manageLetterRequestsPermitted = HasAccess("MANAGE_LETTER_REQUESTS");

  const showHeaderButton = () => {
    if (activeHRDocumentsTab === "Documents" && uploadHRDocumentPermitted) {
      return true;
    }
    if (activeHRDocumentsTab === "Category" && addDocumentCategoryPermitted) {
      return true;
    }
    // No button for Letter Requests tab
    return false;
  };

  const getButtonText = () => {
    if (activeHRDocumentsTab === "Documents") return "Add Document";
    if (activeHRDocumentsTab === "Category") return "Add Category";
    return "";
  };

  const handleButtonClick = () => {
    if (activeHRDocumentsTab === "Documents") {
      setOpenUploadDocumentForm(true);
    } else if (activeHRDocumentsTab === "Category") {
      setOpenCategoryForm(true);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          showHeaderButton() && (
            <Button onClick={handleButtonClick}>{getButtonText()}</Button>
          )
        }
      />
      <Tabs
        defaultValue="Documents"
        className="w-full"
        onValueChange={(tab) => {
          setActiveHRDocumentsTab(tab);
        }}
        value={activeHRDocumentsTab}
      >
        <TabsList>
          {HRDocumentsTab.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card>
          <TabsContent value="Documents">
            <Documents reload={reloadData} />
          </TabsContent>
          <TabsContent value="Category">
            <Category reload={reloadData} />
          </TabsContent>
          {manageLetterRequestsPermitted && (
            <TabsContent value="Letter Requests">
              <LetterRequests reload={reloadData} />
            </TabsContent>
          )}
        </Card>
      </Tabs>
      {OpenUploadDocumentForm && (
        <UploadDocumentForm
          isOpen={OpenUploadDocumentForm}
          setIsOpen={() => {
            setOpenUploadDocumentForm(false);
            setReloadData(!reloadData);
          }}
        />
      )}
      {OpenCategoryForm && (
        <CategoryForm
          isOpen={OpenCategoryForm}
          setIsOpen={() => {
            setOpenCategoryForm(false);
            setReloadData(!reloadData);
          }}
        />
      )}
    </div>
  );
}

export {
  Documents,
  UploadDocumentForm,
  MyDocuments,
  HRDocuments,
  MyLetterRequests,
  LetterRequests,
  DocumentDetails,
};
