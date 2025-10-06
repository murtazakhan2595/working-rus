import React, { useState, useMemo, useEffect, useRef } from "react";
import { usePermissions } from "utils/PermissionUtils";
import { Header, OverviewCard, DetailContent, StatusLabel, PageLoader } from "components";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import Error from "app/modules/Error";
import { APPLICANT_PROFILE_TAB_CONFIG } from "app/modules/TalentSphere/Sections";
import { useParams } from "react-router-dom";
import { getApplicantsData } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";

export default function ApplicantProfileDetails() {
    const { hasAccess } = usePermissions();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState(null);
    const [isLoading, setIsLoading] = useState({});
    const [ApplicantData, setApplicantData] = useState({});
    const viewPermitted = hasAccess("TS_VIEW_APPLICANT_PROFILE");

    useEffect(() => {
        const fetchData = async (isMounted) => {
            setIsLoading(true);
            try {
                const response = await getApplicantsData(id);
                if (isMounted && response) {
                    setApplicantData(response);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        let isMounted = true;
        if (id) fetchData(isMounted);
        return () => {
            isMounted = false;
        };
    }, [id]);

    const { candidate_name, candidate_id, serial_id, status } = useMemo(() => ApplicantData, [ApplicantData]);

    if (!viewPermitted) return <Error errorType={401} />;

    const currentTab = activeTab || APPLICANT_PROFILE_TAB_CONFIG[0].label;

    return (
        <div className="flex flex-col gap-4">
            <Header
                showBackButton={true}
                navigationLink={'/talent-sphere/applicants-profile'}
                content={ApplicantData.status === 'hired' && <Button>Create Employee</Button>}
            />
            <Card>
                <CardContent className="flex items-center justify-between pt-6 ">
                    <OverviewCard
                        title={candidate_name}
                        subtitle={serial_id}
                        additionalInfo={[candidate_id, <StatusLabel status={status}>{status}</StatusLabel>]}
                        avatarProps={{ size: 16, fallbackText: (candidate_name?.split(" ") || []).map((word) => word.charAt(0).toUpperCase()).join("") }}
                    />
                </CardContent>
            </Card>
            <Tabs value={currentTab} onValueChange={setActiveTab}>
                <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
                    <TabsList>
                        {APPLICANT_PROFILE_TAB_CONFIG.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.label}>
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {APPLICANT_PROFILE_TAB_CONFIG.map((tab) => (
                    <TabsContent key={tab.label} value={tab.label}>
                        {isLoading ? <PageLoader /> : <DetailContent
                            fields={tab.infoFields}
                            currentItem={tab.dataKey ? ApplicantData[tab.dataKey] : ApplicantData}
                            orientation={'horizontal'}
                            viewClassName={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}
                        />}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
