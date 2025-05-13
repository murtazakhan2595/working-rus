import React from 'react';
import { Checkbox } from 'src/@/components/ui/checkbox';
import { Label } from 'src/@/components/ui/label';

const PermissionsTree = ({ schema, selectedPermissions, onChange, permissionTypes, searchTerm }) => {
  // Deep clone the current permissions to avoid direct mutation
  const updatePermissions = (featureKey, permissionType, checked) => {
    const newPermissions = { ...selectedPermissions };
    
    if (!newPermissions[featureKey]) {
      newPermissions[featureKey] = [];
    }
    
    if (checked) {
      // Add permission if not already there
      if (!newPermissions[featureKey].includes(permissionType)) {
        newPermissions[featureKey] = [...newPermissions[featureKey], permissionType];
      }
    } else {
      // Remove permission
      newPermissions[featureKey] = newPermissions[featureKey].filter(
        type => type !== permissionType
      );
      
      // Clean up empty arrays
      if (newPermissions[featureKey].length === 0) {
        delete newPermissions[featureKey];
      }
    }
    
    onChange(newPermissions);
  };

  // Handle "Select All" for a module
  const handleSelectAllModule = (module, permissionType, checked) => {
    const newPermissions = { ...selectedPermissions };
    
    // Handle direct module features
    if (module.features) {
      module.features.forEach(feature => {
        // Only check if the permission type is supported
        if (feature.supportedPermissions.includes(permissionType)) {
          const featureKey = feature.key;
          
          if (!newPermissions[featureKey]) {
            newPermissions[featureKey] = [];
          }
          
          if (checked) {
            if (!newPermissions[featureKey].includes(permissionType)) {
              newPermissions[featureKey] = [...newPermissions[featureKey], permissionType];
            }
          } else {
            newPermissions[featureKey] = newPermissions[featureKey].filter(
              type => type !== permissionType
            );
            
            if (newPermissions[featureKey].length === 0) {
              delete newPermissions[featureKey];
            }
          }
        }
      });
    }
    
    // Handle submodules
    if (module.subModules) {
      module.subModules.forEach(subModule => {
        handleSelectAllSubModule(subModule, permissionType, checked, newPermissions);
      });
    }
    
    onChange(newPermissions);
  };

  // Handle "Select All" for a submodule
  const handleSelectAllSubModule = (subModule, permissionType, checked, permissions = selectedPermissions) => {
    const newPermissions = { ...permissions };
    
    if (subModule.features) {
      subModule.features.forEach(feature => {
        // Only check if the permission type is supported
        if (feature.supportedPermissions.includes(permissionType)) {
          const featureKey = feature.key;
          
          if (!newPermissions[featureKey]) {
            newPermissions[featureKey] = [];
          }
          
          if (checked) {
            if (!newPermissions[featureKey].includes(permissionType)) {
              newPermissions[featureKey] = [...newPermissions[featureKey], permissionType];
            }
          } else {
            newPermissions[featureKey] = newPermissions[featureKey].filter(
              type => type !== permissionType
            );
            
            if (newPermissions[featureKey].length === 0) {
              delete newPermissions[featureKey];
            }
          }
        }
      });
    }
    
    // If this is a direct call (not from handleSelectAllModule)
    if (permissions === selectedPermissions) {
      onChange(newPermissions);
    }
    
    return newPermissions;
  };

  // Check if all features in a submodule have a specific permission
  const isAllSubModuleSelected = (subModule, permissionType) => {
    if (!subModule.features || subModule.features.length === 0) {
      return true;
    }
    
    for (const feature of subModule.features) {
      if (feature.supportedPermissions.includes(permissionType)) {
        const isSelected = selectedPermissions[feature.key]?.includes(permissionType);
        if (!isSelected) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Check if all features in a module have a specific permission
  const isAllModuleSelected = (module, permissionType) => {
    let allSelected = true;
    
    // Check direct module features
    if (module.features && module.features.length > 0) {
      for (const feature of module.features) {
        if (feature.supportedPermissions.includes(permissionType)) {
          const isSelected = selectedPermissions[feature.key]?.includes(permissionType);
          if (!isSelected) {
            allSelected = false;
            break;
          }
        }
      }
    }
    
    // Check submodules
    if (module.subModules && allSelected) {
      for (const subModule of module.subModules) {
        if (!isAllSubModuleSelected(subModule, permissionType)) {
          allSelected = false;
          break;
        }
      }
    }
    
    return allSelected;
  };

  // Render the permissions table header
  const renderTableHeader = () => (
    <div className="grid grid-cols-[2fr,repeat(6,1fr)] gap-2 mb-2 font-medium text-sm border-b pb-2">
      <div>Feature</div>
      {permissionTypes.map(type => (
        <div key={type} className="text-center">{type}</div>
      ))}
    </div>
  );

  // Render a feature row
  const renderFeature = (feature) => (
    <div 
      key={feature.key} 
      className="grid grid-cols-[2fr,repeat(6,1fr)] gap-2 py-1 text-sm items-center"
    >
      <div className="pl-8">{feature.name}</div>
      {permissionTypes.map(permissionType => {
        const isSupported = feature.supportedPermissions.includes(permissionType);
        const isChecked = selectedPermissions[feature.key]?.includes(permissionType);
        
        return (
          <div key={`${feature.key}-${permissionType}`} className="flex justify-center">
            <Checkbox
              id={`${feature.key}-${permissionType}`}
              disabled={!isSupported}
              checked={isChecked}
              onCheckedChange={(checked) => 
                updatePermissions(feature.key, permissionType, checked)
              }
              aria-label={`${permissionType} permission for ${feature.name}`}
            />
          </div>
        );
      })}
    </div>
  );

  // Render a submodule section
  const renderSubModule = (subModule, index) => {
    if (!subModule.features || subModule.features.length === 0) {
      return null;
    }
    
    return (
      <div key={`submodule-${index}`} className="mb-4">
        <div className="grid grid-cols-[2fr,repeat(6,1fr)] gap-2 py-1 font-medium text-sm items-center bg-gray-50">
          <div className="pl-4">{subModule.name}</div>
          {permissionTypes.map(permissionType => (
            <div key={`${subModule.name}-${permissionType}`} className="flex justify-center">
              <Checkbox
                id={`submodule-${index}-${permissionType}`}
                checked={isAllSubModuleSelected(subModule, permissionType)}
                onCheckedChange={(checked) => 
                  handleSelectAllSubModule(subModule, permissionType, checked)
                }
                aria-label={`Select all ${permissionType} permissions for ${subModule.name}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 space-y-1">
          {subModule.features.map(feature => renderFeature(feature))}
        </div>
      </div>
    );
  };

  // Render a module section
  const renderModule = (module, index) => {
    const hasContent = 
      (module.features && module.features.length > 0) || 
      (module.subModules && module.subModules.length > 0);
      
    if (!hasContent) {
      return null;
    }
    
    return (
      <div key={`module-${index}`} className="p-4 mb-6 border rounded-md">
        <div className="grid grid-cols-[2fr,repeat(6,1fr)] gap-2 py-2 font-bold text-base items-center border-b">
          <div>{module.name}</div>
          {permissionTypes.map(permissionType => (
            <div key={`${module.name}-${permissionType}`} className="flex justify-center">
              <Checkbox
                id={`module-${index}-${permissionType}`}
                checked={isAllModuleSelected(module, permissionType)}
                onCheckedChange={(checked) => 
                  handleSelectAllModule(module, permissionType, checked)
                }
                aria-label={`Select all ${permissionType} permissions for ${module.name}`}
              />
            </div>
          ))}
        </div>
        
        {/* Module direct features */}
        {module.features && module.features.length > 0 && (
          <div className="mt-2 space-y-1">
            {module.features.map(feature => renderFeature(feature))}
          </div>
        )}
        
        {/* Submodules */}
        {module.subModules && module.subModules.length > 0 && (
          <div className="mt-4 space-y-2">
            {module.subModules.map((subModule, idx) => 
              renderSubModule(subModule, `${index}-${idx}`)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="permissions-tree">
      {renderTableHeader()}
      {schema.map((module, index) => renderModule(module, index))}
      
      {schema.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          {searchTerm ? "No matching permissions found." : "Loading permissions..."}
        </div>
      )}
    </div>
  );
};

export default PermissionsTree;
