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
import { Card, CardContent } from "components/ui/card";
import { Header } from "components";
import { Button } from "components/ui/button";

const HRDocumentsTab = ["Documents", "Category"];

function HRDocuments() {
  const [OpenUploadDocumentForm, setOpenUploadDocumentForm] = useState(false);
  const [OpenCategoryForm, setOpenCategoryForm] = useState(false);
  const [activeHRDocumentsTab, setActiveHRDocumentsTab] = useState("Documents");
  const [reloadData, setReloadData] = useState(false);
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              if (activeHRDocumentsTab === "Documents")
                setOpenUploadDocumentForm(true);
              else setOpenCategoryForm(true);
            }}
          >
            {activeHRDocumentsTab === "Documents"
              ? "Upload New Document"
              : "Add New Category"}
          </Button>
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
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {HRDocumentsTab.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <CardContent>
            <TabsContent value="Documents">
              <Documents reload={reloadData} />
            </TabsContent>
            <TabsContent value="Category">
              <Category reload={reloadData} />
            </TabsContent>
          </CardContent>
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
