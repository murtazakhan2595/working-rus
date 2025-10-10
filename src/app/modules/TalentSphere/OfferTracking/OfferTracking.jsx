import React, { useState, useMemo, useEffect } from "react";
import { usePermissions } from "utils/PermissionUtils";
import { Header } from "components";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import Error from "app/modules/Error";
import { OFFER_TAB_CONFIG } from "app/modules/TalentSphere/Sections";
import { useLocation } from "react-router-dom";

export default function OfferTracking() {
    const { hasAccess } = usePermissions();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(null);
    const [reloadData, setReloadData] = useState({});
    const [openForms, setOpenForms] = useState({});
    const [deepLinkFilterData, setDeepLinkFilterData] = useState(null);
    const [deepLinkSubTab, setDeepLinkSubTab] = useState(null);

    // 🔹 Filter only permitted tabs
    const permittedTabs = OFFER_TAB_CONFIG.filter((tab) => !tab.viewPerm || hasAccess(tab.viewPerm) || hasAccess(tab.addPerm));

    // Handle location state for deep linking from dashboard
    useEffect(() => {
        if (location.state?.filterData || location.state?.tab || location.state?.subTab) {
            const { tab, subTab, filterData } = location.state;
            
            if (filterData) setDeepLinkFilterData(filterData);
            if (subTab) setDeepLinkSubTab(subTab);
            
            // Set the correct tab based on state
            if (tab && permittedTabs.some(t => t.label === tab)) {
                setActiveTab(tab);
            }
            
            // Clear location state after reading
            window.history.replaceState({}, document.title);
        }
    }, [location.state, permittedTabs]);

    if (permittedTabs.length === 0) {
        return <Error errorType={401} />;
    }

    // 🔹 Button in header (Add New)
    const HeaderButton = () => {
        const currentTab = permittedTabs.find((t) => t.label === (activeTab || permittedTabs[0].label));
        if (!currentTab || !currentTab.form) return null;

        if (currentTab.addPerm && hasAccess(currentTab.addPerm)) {
            return (
                <Button title={currentTab.key} onClick={() => setOpenForms({ [currentTab.key]: true })}>
                    {currentTab.addLabel ?? `Add ${currentTab.label}`}
                </Button>
            );
        }

        return null;
    };

    return (
        <div className="flex flex-col gap-4">
            <Header content={<HeaderButton />} />
            <Tabs
                value={activeTab || permittedTabs[0].label}
                onValueChange={setActiveTab}
                defaultValue={permittedTabs[0].label}
            >
                <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
                    <TabsList>
                        {permittedTabs.map((tab) => (
                            <TabsTrigger key={tab.key} value={tab.label}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <Card>
                    {permittedTabs.map((tab) => (
                        <TabsContent key={tab.key} value={tab.label}>
                            {tab.list(reloadData[tab.key], deepLinkFilterData, deepLinkSubTab)}
                        </TabsContent>
                    ))}
                </Card>
            </Tabs>

            {/* 🔹 Render Modals dynamically */}
            {permittedTabs.map(
                (tab) =>
                    openForms[tab.key] &&
                    tab.form && (
                        <tab.form
                            key={tab.key}
                            isOpen={openForms[tab.key]}
                            setIsOpen={() => {
                                setOpenForms((prev) => ({ ...prev, [tab.key]: false }));
                                setReloadData((prev) => ({ ...prev, [tab.key]: !prev[tab.key] }));
                            }}
                        />
                    )
            )}
        </div>
    );
}
