import React, { useState } from "react";
import Documents from "app/modules/HRDocuments/Documents";
import MyDocuments from "app/modules/HRDocuments/MyDocuments";
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

const HRDocumentsTab = ["Documents", "Category"];

function HRDocuments() {
  const [OpenUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [OpenCategoryForm, setOpenCategoryForm] = useState(false);
  const [activeHRDocumentsTab, setActiveHRDocumentsTab] = useState("Documents");
  const [reloadData, setReloadData] = useState(false);
  const uploadHRDocumentPermitted = HasAccess("UPLOAD_HR_DOCUMENT");
  const addDocumentCategoryPermitted = HasAccess("ADD_DOCUMENT_CATEGORY");
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          ((activeHRDocumentsTab === "Documents" &&
            uploadHRDocumentPermitted) ||
            (activeHRDocumentsTab !== "Documents" &&
              addDocumentCategoryPermitted)) && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (activeHRDocumentsTab === "Documents")
                  setOpenUploadDocumentForm(true);
                else setOpenCategoryForm(true);
              }}
            >
              {activeHRDocumentsTab === "Documents"
                ? "Add Document"
                : "Add Category"}
            </Button>
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
            <TabsTrigger
              key={tab}
              value={tab}
            >
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
  DocumentDetails,
};
