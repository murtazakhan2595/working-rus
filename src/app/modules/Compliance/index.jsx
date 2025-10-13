import React, { useState, useEffect } from "react";
import { Header } from "components";
import { Card, CardContent } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  AddLicenseModal,
  ViewLicenseModal,
  EditLicenseModal,
  DeleteLicenseModal,
} from "components/Compliance";
import { AlertTriangle } from "lucide-react";
import { complianceStats, facilityLicensesData, stats } from "./dummyData";

import FacilityLicensing from "./BranchLicensing";
import LicenseCertificates from "./LicenseCertificates";
import MandatoryTraining from "./MandatoryTraining";
import ComplianceRatio from "./ComplianceRatio";
import SopPolicy from "./SopPolicy";
import WorkforceRegulations from "./WorkforceRegulations";

const Compliance = () => {
  const [activeTab, setActiveTab] = useState("facility");
  const [vs2, setVs2] = useState(false);

  // Modal states
  const [isAddLicenseModalOpen, setIsAddLicenseModalOpen] = useState(false);
  const [isViewLicenseModalOpen, setIsViewLicenseModalOpen] = useState(false);
  const [isEditLicenseModalOpen, setIsEditLicenseModalOpen] = useState(false);
  const [isDeleteLicenseModalOpen, setIsDeleteLicenseModalOpen] =
    useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);

  // License data state
  const [facilityLicenses, setFacilityLicenses] = useState([]);

  console.log(vs2, "vs2");
  // Check for v2 parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const v2Param = urlParams.get("v2");
    setVs2(v2Param === "true");
  }, []);

  // Initialize facility licenses data
  useEffect(() => {
    setFacilityLicenses(facilityLicensesData);
  }, []);

  // Handler functions for license operations
  const handleAddLicense = (newLicense) => {
    console.log("handleAddLicense called with:", newLicense);
    setFacilityLicenses((prev) => {
      const updated = [...prev, newLicense];
      console.log("Updated facilityLicenses:", updated);
      return updated;
    });
  };

  const handleEditLicense = (updatedLicense) => {
    setFacilityLicenses((prev) =>
      prev.map((license) =>
        license.id === updatedLicense.id ? updatedLicense : license
      )
    );
  };

  const handleDeleteLicense = (licenseToDelete) => {
    setFacilityLicenses((prev) =>
      prev.filter((license) => license.id !== licenseToDelete.id)
    );
  };

  const handleProceedForRenewal = (license) => {
    // Move license to renewal tracking tab
    const updatedLicense = {
      ...license,
      status: "Renewal Tracking",
      renewalInitiatedAt: new Date().toISOString(),
      renewalIntimations: 2, // Mark as second intimation
    };
    handleEditLicense(updatedLicense);
  };

  return (
    <div className="flex flex-col">
      <Header />

      <div className="p-4">
        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="grid grid-cols-7 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`border-slate-200 hover:shadow-lg transition-shadow${
                  activeTab === stat.id && vs2
                    ? "border border-primary-900 hover:cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (vs2) setActiveTab(stat.id);
                }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div
                    className={`text-sm mb-1 
                    ${
                      activeTab === stat.id && vs2
                        ? "text-primary-900"
                        : "text-black"
                    }
                    `}
                  >
                    {vs2 ? stat.fullName : stat.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-2xl font-semibold  ${
                        activeTab === stat.id && vs2
                          ? "text-primary-900"
                          : "text-black"
                      }`}
                    >
                      {stat.value}
                    </div>
                    {stat.warning && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!vs2 && (
            <TabsList className="bg-transparent">
              {complianceStats.map((stat) => {
                return (
                  <TabsTrigger
                    value={stat.id}
                    className="data-[state=active]:bg-transparent text-black"
                    variant="inner-tab"
                  >
                    {stat.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}

          {/* Facility Licensing Tab */}
          <TabsContent value="facility">
            <FacilityLicensing
              isAddLicenseModalOpen={isAddLicenseModalOpen}
              setIsAddLicenseModalOpen={setIsAddLicenseModalOpen}
              isViewLicenseModalOpen={isViewLicenseModalOpen}
              setIsViewLicenseModalOpen={setIsViewLicenseModalOpen}
              isEditLicenseModalOpen={isEditLicenseModalOpen}
              setIsEditLicenseModalOpen={setIsEditLicenseModalOpen}
              isDeleteLicenseModalOpen={isDeleteLicenseModalOpen}
              setIsDeleteLicenseModalOpen={setIsDeleteLicenseModalOpen}
              selectedLicense={selectedLicense}
              setSelectedLicense={setSelectedLicense}
              handleAddLicense={handleAddLicense}
              handleEditLicense={handleEditLicense}
              handleDeleteLicense={handleDeleteLicense}
              handleProceedForRenewal={handleProceedForRenewal}
            />
          </TabsContent>

          {/* License & Certificates Tab */}
          <TabsContent value="license-certificates">
            <LicenseCertificates />
          </TabsContent>

          {/* Mandatory Training Tab */}
          <TabsContent value="training">
            <MandatoryTraining />
          </TabsContent>

          {/* Compliance Ratio Tab */}
          <TabsContent value="ratio">
            <ComplianceRatio />
          </TabsContent>

          {/* SOP & Policy Tab */}
          <TabsContent value="sop">
            <SopPolicy />
          </TabsContent>

          {/* Workforce Regulations Tab */}
          <TabsContent value="workforce">
            <WorkforceRegulations />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <AddLicenseModal
        isOpen={isAddLicenseModalOpen}
        onClose={() => setIsAddLicenseModalOpen(false)}
        onSave={handleAddLicense}
        existingLicenses={facilityLicenses}
      />

      <ViewLicenseModal
        isOpen={isViewLicenseModalOpen}
        onClose={() => setIsViewLicenseModalOpen(false)}
        licenseData={selectedLicense}
      />

      {isEditLicenseModalOpen && selectedLicense && (
        <EditLicenseModal
          isOpen={isEditLicenseModalOpen}
          onClose={() => setIsEditLicenseModalOpen(false)}
          onSave={handleEditLicense}
          licenseData={selectedLicense}
          existingLicenses={facilityLicenses}
        />
      )}

      <DeleteLicenseModal
        isOpen={isDeleteLicenseModalOpen}
        onClose={() => setIsDeleteLicenseModalOpen(false)}
        onConfirm={handleDeleteLicense}
        licenseData={selectedLicense}
      />
    </div>
  );
};

export default Compliance;
