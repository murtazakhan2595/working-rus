import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import { getDemographicFormById } from "app/hooks/talentSphere";
import { EmployeeName } from "utils/getValuesFromTables";
import  DemographicsSheet  from "../DemographicsSheet";

const ViewDemographicForm = ({
    isOpen,
    setIsOpen,
    currentId,
    reloadData = () => {},
    DataList = [],
}) => {
    const fields = [
        {
            title: "Form Details",
            footerTitle: "Created At",
            footerField: "created_at",
            field: [
                { key: "id", label: "Form ID" },
                { key: "name", label: "Form Name" },
                { key: "description", label: "Description" },
                {
                    key: "is_active",
                    label: "Status",
                    formatter: (cell) => (cell ? "Active" : "Inactive"),
                },
                {
                    key: "created_by",
                    label: "Created By",
                    formatter: (cell) => <EmployeeName value={cell} />,
                },
                {
                    key: "updated_by",
                    label: "Updated By",
                    formatter: (cell) => <EmployeeName value={cell} />,
                },
            ],
        },
        {
            title: "Form Sections",
            field: [
                {
                    key: "sections",
                    label: "Sections and Fields",
                    formatter: (sections) =>
                        sections?.length > 0 ? (
                            <div className="space-y-4">
                                {sections.map((section, sectionIndex) => (
                                    <div
                                        key={section.id}
                                        className="p-4 border rounded-lg bg-gray-50"
                                    >
                                        <div className="mb-3">
                                            <h4 className="font-semibold text-lg">
                                                Section {sectionIndex + 1}: {section.heading}
                                            </h4>
                                            {section.description && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {section.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Fields inside each section */}
                                        {section.fields?.length > 0 ? (
                                            <div className="ml-4">
                                                <p className="font-medium text-sm text-gray-700 mb-2">
                                                    Fields ({section.fields.length}):
                                                </p>
                                                <div className="space-y-2">
                                                    {section.fields.map((field, fieldIndex) => (
                                                        <div
                                                            key={field.id}
                                                            className="flex flex-wrap items-center gap-2 text-sm"
                                                        >
                                                            <span className="font-medium">
                                                                {fieldIndex + 1}. {field.label}
                                                            </span>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                                                {field.field_type}
                                                            </span>
                                                            {field.required && (
                                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                                                                    Required
                                                                </span>
                                                            )}
                                                            {field.attachment_required && (
                                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                                                                    Attachment Required
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="ml-4 text-sm text-gray-500 italic">
                                                No fields configured for this section
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No sections configured</p>
                        ),
                },
            ],
        },
    ];

    const fetchData = async (id, isMounted) => {
        try {
            const response = await getDemographicFormById(id);
            if (isMounted) {
                return response;
            }
        } catch (error) {
            console.error("Error fetching demographic form:", error);
        }
    };

    return (
        <NavigationSheetComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Demographic Form Details"
            currentItem_Id={currentId}
            dataList={DataList}
            reloadData={reloadData}
            apiEndpoint={`/demographic-forms/${currentId}/`}
            fetchCurrentItemDetails={fetchData}
            deleteItemName="name"
            editTooltip="Edit Demographic Form"
            deleteTooltip="Delete Demographic Form"
            editPermissions="EDIT_DEMOGRAPHIC_FORM"
            deletePermissions="DELETE_DEMOGRAPHIC_FORM"
            editComponent={DemographicsSheet}  
        >
            <DetailContent fields={fields} />
        </NavigationSheetComponent>
    );
};

export default ViewDemographicForm;
