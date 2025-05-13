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
              ? "Add Document"
              : "Add Category"}
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
          <div className="w-full sm:w-auto overflow-hidden mb-4">
            <TabsList className="flex flex-nowrap w-full overflow-x-auto overflow-y-hidden sm:overflow-visible">
              {HRDocumentsTab.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary-200 flex-1 sm:flex-initial whitespace-nowrap sm:w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
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
