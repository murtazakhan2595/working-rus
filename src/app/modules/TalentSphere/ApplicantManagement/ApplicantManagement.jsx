import React, { useState, useMemo, useEffect } from "react";
import { usePermissions } from "utils/PermissionUtils";
import { Header } from "components";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import Error from "app/modules/Error";
import {APPLICANT_TAB_CONFIG} from 'app/modules/TalentSphere/Sections';
import { useSearchParams } from "react-router-dom";
import ViewApplicationDetail from "./ViewApplicationDetail";



export default function ApplicantManagement() {
  const { hasAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState(null);
  const [reloadData, setReloadData] = useState({});

  // Deep-link state
  const [searchParams, setSearchParams] = useSearchParams();
  const [deepLinkApplicant, setDeepLinkApplicant] = useState(null);
  const [deepLinkAction, setDeepLinkAction] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    const applicant = searchParams.get("applicant");
    const action = searchParams.get("action");
    if (applicant) {
      setDeepLinkApplicant(applicant);
      if (action) setDeepLinkAction(action);
      setOpenDetail(true);
      // Clean URL
      searchParams.delete("applicant");
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  // Filter tabs based on user permissions
  const availableTabs = useMemo(
    () => APPLICANT_TAB_CONFIG.filter((tab) => hasAccess(tab.permission)),
    [hasAccess]
  );

  // If no permission -> show error page
  if (!availableTabs.length) return <Error errorType={401} />;

  const currentTab = activeTab || availableTabs[0].label;

  return (
    <div className="flex flex-col gap-4">
      <Header />

      <Tabs value={currentTab} onValueChange={setActiveTab}>
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList>
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          {availableTabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              {tab.component(reloadData)}
            </TabsContent>
          ))}
        </Card>
      </Tabs>

      {openDetail && deepLinkApplicant && (
        <ViewApplicationDetail
          currentId={deepLinkApplicant}
          isOpen={openDetail}
          setIsOpen={(flag) => setOpenDetail(flag)}
          autoAction={deepLinkAction}
        />
      )}
    </div>
  );
}
