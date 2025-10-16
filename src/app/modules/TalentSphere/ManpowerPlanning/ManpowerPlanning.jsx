import { Header } from "components";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, } from "src/@/components/ui/tabs";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { HasAccess } from "utils/PermissionUtils";
import {
  HeadCountRequests,
  AddUpdateManpower,
  CareerLevels,
  ManpowerHeadcount,
  Educations,
  AddUpdateEducationForm,
  JobTypes,
  AddUpdateJobTypeForm,
  RemoteWorkChecklist,
  AddUpdateRemoteWorkChecklistForm,
} from 'app/modules/TalentSphere';
import Error from "app/modules/Error";

export default function ManpowerPlanning() {
  const isViewHeadcountPermitted = HasAccess("VIEW_MANPOWER");
  const isAddHeadcountPermitted = HasAccess("ADD_MANPOWER");
  const isViewCareerLevelsPermitted = HasAccess("VIEW_TS_CAREER_LEVEL");
  const isAddCareerLevelsPermitted = HasAccess("ADD_TS_CAREER_LEVEL");
  const isViewEducationsPermitted = HasAccess("VIEW_TS_EDUCATION");
  const isAddEducationsPermitted = HasAccess("ADD_TS_EDUCATION");
  const isViewJobTypesPermitted = HasAccess("VIEW_TS_JOB_TYPE");
  const isAddJobTypesPermitted = HasAccess("ADD_TS_JOB_TYPE");
  const isViewHCRequestPermitted = HasAccess("VIEW_HEADCOUNT_REQUESTS");
  const isAddChecklistPermitted = HasAccess("ADD_TS_REMOTE_WORK_CHECKLIST");
  const [activeTab, setActiveTab] = useState(null);
  const [OpenBenefitForm, setOpenBenefitForm] = useState(false);
  const [OpenCareerLevelForm, setOpenCareerLevelForm] = useState(false);
  const [OpenEducationForm, setOpenEducationForm] = useState(false);
  const [OpenJobTypesForm, setOpenJobTypesForm] = useState(false);
  const [reloadData, setReloadData] = useState({});
  const [OpenManpowerForm, setOpenManpowerForm] = useState(false);


  const TabListArray = React.useMemo(() => [
    ...(isViewHeadcountPermitted ? ["Manpower Headcount"] : []),
    ...(isViewHCRequestPermitted ? ["Headcount Requests"] : []),
    // ...(isViewJobTypesPermitted ? ["Job Types"] : []),
    // ...(isViewEducationsPermitted ? ["Education"] : []),
    // ...(isViewCareerLevelsPermitted ? ["Career Level"] : []),

  ], [isViewHeadcountPermitted, isViewCareerLevelsPermitted, isViewEducationsPermitted, isViewJobTypesPermitted, isViewHCRequestPermitted]);

  const HeaderButton = () => {
    const handleRequestClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpenBenefitForm(false);
      setOpenCareerLevelForm(false);
      setOpenEducationForm(false);
      setOpenJobTypesForm(false);
      setOpenManpowerForm(false);
      const triggeredResquest = event.target.title;
      if (triggeredResquest === 'manpower-headcount')
        setOpenManpowerForm(true);
      else if (triggeredResquest === 'career-level')
        setOpenCareerLevelForm(true);
      else if (triggeredResquest === 'education')
        setOpenEducationForm(true);
      else if (triggeredResquest === 'job-type')
        setOpenJobTypesForm(true);
      else if (triggeredResquest === 'checklist')
        setOpenManpowerForm(true);
    }
    const activeButtonTab = activeTab ?? TabListArray[0];
    if (activeButtonTab === "Manpower Headcount" && isAddHeadcountPermitted) {
      return (
        <Button title="manpower-headcount" onClick={handleRequestClick}>
          Add Manpower
        </Button>
      )
    } else if (activeButtonTab === "Career Level" && isAddCareerLevelsPermitted) {
      return (
        <Button title="career-level" onClick={handleRequestClick}>
          Add Career Level
        </Button>
      )
    } else if (activeButtonTab === "Educations" && isAddEducationsPermitted) {
      return (
        <Button title="benefits" onClick={handleRequestClick}>
          Add Education
        </Button>
      )
    } else if (activeButtonTab === "Job Types" && isAddJobTypesPermitted) {
      return (
        <Button title="job-type" onClick={handleRequestClick}>
          Add Job Type
        </Button>
      )
    } else if (activeButtonTab === "Remote Work Checklist" && isAddChecklistPermitted) {
      return (
        <Button title="checklist" onClick={handleRequestClick}>
          Add Remote Work Checklist
        </Button>
      )
    }
  }
  if (!isViewHeadcountPermitted && !isViewCareerLevelsPermitted && !isViewEducationsPermitted && !isViewJobTypesPermitted && !isViewHCRequestPermitted)
    return <Error errorType={401} />
  return (
    <div className="flex flex-col gap-4">
      <Header content={<HeaderButton />} />

      <Tabs
        value={activeTab || TabListArray[0]}
        onValueChange={setActiveTab}
        defaultValue="Benefits"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList>
            {TabListArray.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          <TabsContent value={'Manpower Headcount'}>
            <ManpowerHeadcount reload={reloadData['manpower-headcount']} />
          </TabsContent>
          <TabsContent value={'Headcount Requests'}>
            <HeadCountRequests reload={reloadData['headcount-request']} />
          </TabsContent>
          <TabsContent value={'Career Level'}>
            <CareerLevels reload={reloadData['career-level']} />
          </TabsContent>
          <TabsContent value={'Education'}>
            <Educations reload={reloadData['education']} />
          </TabsContent>
          <TabsContent value={'Job Types'}>
            <JobTypes reload={reloadData['job-type']} />
          </TabsContent>
          <TabsContent value={'Remote Work Checklist'}>
            <RemoteWorkChecklist reload={reloadData['checklist']} />
          </TabsContent>
        </Card>
      </Tabs>
      {OpenManpowerForm && (
        <AddUpdateManpower
          isOpen={OpenManpowerForm}
          setIsOpen={() => {
            setOpenManpowerForm(false);
            setReloadData((prev) => {
              return {
                ...prev,
                'manpower-headcount': !prev["manpower-headcount"],
              };
            })
          }}
          isAdminView={true}
          isEmployee={true}
        />
      )}
    </div>
  );
}

