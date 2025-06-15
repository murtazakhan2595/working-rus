import { saveDepartment } from "app/hooks/general";
import { getDepartmentById } from "app/hooks/general";
import { DepartmentsInformation } from "app/utils/Types/Departments";
import { SelectInputComponent, TextAreaInput, TextInput, FilterInput } from "components/FormControl";
import SheetUI from "components/SheetUI";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "src/@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "src/@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

const AddDepartmentForm = ({ 
  id = false,
  isOpen, 
  setIsOpen, 
  edit, 
  reloadData = () => {}, 
  userOrganization, 
  onUpdateSuccess = null 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState(edit?.data?.permissions || {});
  const [formData, setFormData] = useState(DepartmentsInformation);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  // Determine if we're in edit mode
  const isEditMode = Boolean(edit?.data) || Boolean(id);
  
  // Extract the actual data based on the structure provided
  const editData = edit?.data || edit;

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Department`,
    title: `${isEditMode ? "Edit" : "Add"} Department`,
    description: null,
    footer: null,
  };

  // Mock permission modules
  const permissionModules = [
    {
      name: "Employees",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Attendance",
      permissions: ["View", "Add", "Edit", "Approve"]
    },
    {
      name: "Leaves",
      permissions: ["View", "Add", "Edit", "Approve"]
    },
    {
      name: "Tasks",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Roles",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Departments",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Profiles",
      permissions: ["View", "Edit"]
    }
  ];

  // Update form data when edit data changes
  useEffect(() => {
    if (editData) {
      console.log("Setting form data from edit:", editData);
      setFormData({
        ...DepartmentsInformation,
        ...editData,
      });
    }
    
    if (editData?.permissions) {
      setPermissions(editData.permissions);
    }
    
    // If we have an ID but no edit data, fetch the department data
    if (id && !editData) {
      const fetchDepartmentData = async () => {
        try {
          setIsLoading(true);
          const data = await getDepartmentById(id);
          if (data) {
            console.log("Fetched department data:", data);
            setFormData({
              ...DepartmentsInformation,
              ...data,
            });
            if (data.permissions) {
              setPermissions(data.permissions);
            }
          }
        } catch (error) {
          console.error("Error fetching department data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDepartmentData();
    }
  }, [editData, id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  // Handle permission change
  const handlePermissionChange = (module, permission, checked) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }
      
      if (checked) {
        if (!newPermissions[module].includes(permission)) {
          newPermissions[module] = [...newPermissions[module], permission];
        }
      } else {
        newPermissions[module] = newPermissions[module].filter(p => p !== permission);
        if (newPermissions[module].length === 0) {
          delete newPermissions[module];
        }
      }
      
      return newPermissions;
    });
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      
      // Explicitly construct the payload with required fields
      const payload = {
        ...values,
        permissions: permissions
      };

      // Only add organization for new departments
      if (!isEditMode && userOrganization?.id) {
        payload.organization = userOrganization.id;
      }

      // Pass the department ID (if editing) and the structured payload
      const departmentId = isEditMode ? (id || editData?.id) : null;
      const response = await saveDepartment(departmentId, payload);

      if (response) {
        toast.success(
          `Department ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          await onUpdateSuccess(payload);
        }

        handleClose();
      }
    } catch (error) {
      console.error("ERROR", error);
      
      // Show general error message
      const errorMessage = error?.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} department.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Filter modules based on search term
  const filteredModules = searchTerm.trim() === "" 
    ? permissionModules 
    : permissionModules.filter(module => 
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const validateForm = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Department name is required";
    } else if (values.name.length < 2) {
      errors.name = "Department name must be at least 2 characters";
    } else if (values.name.length > 50) {
      errors.name = "Department name must be less than 50 characters";
    }

    if (!values.description) {
      errors.description = "Description is required";
    } else if (values.description.length < 5) {
      errors.description = "Description must be at least 5 characters";
    } else if (values.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    return errors;
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validateForm,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Department Details",
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Department Name",
              },
              {
                InputField: TextAreaInput,
                name: "description",
                required: true,
                label: "Description",
              },
            ],
          },
          // {
          //   sheetCardExtension: true,
          //   sheetCardTitle: "Permissions",
          //   customComponent: (
          //     <div>
          //       <div className="mb-4">
          //         <FilterInput
          //           filters={[
          //             {
          //               type: "search",
          //               placeholder: "Search modules...",
          //               name: "search",
          //               className: "w-full",
          //             },
          //           ]}
          //           onChange={(filterName, filterValue) => {
          //             if (filterName === "search") {
          //               setSearchTerm(filterValue);
          //             }
          //           }}
          //         />
          //       </div>

          //       <div className="max-h-[400px] overflow-y-auto space-y-2">
          //         {filteredModules.length > 0 ? (
          //           filteredModules.map((module, index) => (
          //             <Collapsible key={index} className="overflow-hidden border rounded-md">
          //               <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50">
          //                 <div className="font-medium">{module.name}</div>
          //                 <CollapsibleTrigger className="p-1 rounded-full hover:bg-gray-200">
          //                   {open => (
          //                     open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          //                   )}
          //                 </CollapsibleTrigger>
          //               </div>
          //               <CollapsibleContent>
          //                 <div className="grid grid-cols-2 gap-3 p-4 border-t">
          //                   {module.permissions.map((permission, i) => (
          //                     <div key={i} className="flex items-center space-x-2">
          //                       <Checkbox 
          //                         id={`${module.name}-${permission}`}
          //                         checked={permissions[module.name]?.includes(permission) || false}
          //                         onCheckedChange={(checked) => 
          //                           handlePermissionChange(module.name, permission, checked)
          //                         }
          //                       />
          //                       <label 
          //                         htmlFor={`${module.name}-${permission}`}
          //                         className="text-sm cursor-pointer"
          //                       >
          //                         {permission}
          //                       </label>
          //                     </div>
          //                   ))}
          //                 </div>
          //               </CollapsibleContent>
          //             </Collapsible>
          //           ))
          //         ) : (
          //           <div className="py-8 text-center text-gray-500">
          //             No modules match your search
          //           </div>
          //         )}
          //       </div>
          //     </div>
          //   ),
          // },
        ],
      }}
    />
  );
};

export default AddDepartmentForm;
