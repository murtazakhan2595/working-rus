import React, { useState } from 'react';
import { useSelfServicePermissions } from '../hooks/useSelfServicePermissions';
import { PermissionWrapper } from '../components/PermissionWrapper';
import { SELF_SERVICE_PERMISSIONS } from '../permissions/constants';

// Import sections
import PersonalInformation from './sections/PersonalInformation';
import JobInformation from './sections/JobInformation';
import AcademicInformation from './sections/AcademicInformation';
import ExperienceInformation from './sections/ExperienceInformation';
import CertificationInformation from './sections/CertificationInformation';
import IdentificationInformation from './sections/IdentificationInformation';

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const permissions = useSelfServicePermissions();

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW,
      component: PersonalInformation
    },
    {
      id: 'job',
      label: 'Job Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.JOB_INFO.VIEW,
      component: JobInformation
    },
    {
      id: 'academic',
      label: 'Academic Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.ACADEMIC_INFO.VIEW,
      component: AcademicInformation
    },
    {
      id: 'experience',
      label: 'Experience Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.EXPERIENCE_INFO.VIEW,
      component: ExperienceInformation
    },
    {
      id: 'certification',
      label: 'Certification Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.CERTIFICATION_INFO.VIEW,
      component: CertificationInformation
    },
    {
      id: 'identification',
      label: 'Identification Information',
      permission: SELF_SERVICE_PERMISSIONS.PROFILE.IDENTIFICATION_INFO.VIEW,
      component: IdentificationInformation
    }
  ];

  const availableTabs = tabs.filter(tab => 
    permissions.profile[tab.id.split('_')[0]]?.canView
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map(tab => (
          <PermissionWrapper
            key={tab.id}
            permissions={tab.permission}
          >
            {activeTab === tab.id && (
              <tab.component />
            )}
          </PermissionWrapper>
        ))}
      </div>
    </div>
  );
};

export default MyProfile; 