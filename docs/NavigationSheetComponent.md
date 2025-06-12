# NavigationSheetComponent Documentation

## Overview
The `NavigationSheetComponent` is a reusable React component that provides a standardized sheet view with navigation, edit, and delete functionality. It dramatically reduces code duplication by providing a common interface for detail views across the application.

## Features
- ✅ **Navigation**: Previous/Next buttons with circular navigation
- ✅ **Position Indicator**: Shows "X of Y" in header navigation area
- ✅ **Edit Functionality**: Integrated edit form with refresh capabilities
- ✅ **Delete Functionality**: Confirmation dialog and API integration
- ✅ **Hot Updates**: Real-time data refresh after operations
- ✅ **Defensive Programming**: Array validation and error handling
- ✅ **Flexible Content**: Supports any child content via props

## Installation

```javascript
import { NavigationSheetComponent, DetailContent } from "components";
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | boolean | ✅ | - | Controls sheet visibility |
| `setIsOpen` | function | ✅ | - | Function to control sheet state |
| `title` | string | ✅ | - | Sheet title displayed in header |
| `data` | object | ✅ | - | Current item data |
| `dataList` | array | ❌ | `[]` | Full list for navigation |
| `reload` | function | ❌ | `() => {}` | Function to reload parent data |
| `children` | ReactNode | ✅ | - | Content to display (usually DetailContent) |
| `editComponent` | Component | ❌ | - | Edit form component |
| `deleteEndpoint` | string | ❌ | - | API endpoint for delete operation |
| `refreshEndpoint` | string | ❌ | - | API endpoint for data refresh |
| `deleteItemName` | string | ❌ | `"item"` | Field name for delete confirmation |
| `editTooltip` | string | ❌ | `"Edit Item"` | Tooltip text for edit button |
| `deleteTooltip` | string | ❌ | `"Delete Item"` | Tooltip text for delete button |
| `onUpdateSuccess` | function | ❌ | `null` | Callback after successful update |
| `additionalEditProps` | object | ❌ | `{}` | Additional props for edit component |

## Basic Usage

### 1. Simple Detail View (Read-Only)

```javascript
import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";

const ViewUser = ({ isOpen, setIsOpen, data, UserList = [] }) => {
  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="User Detail"
      data={data}
      dataList={UserList}
    >
      <DetailContent
        title="User Information"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};
```

### 2. Full CRUD Implementation

```javascript
import React from "react";
import { NavigationSheetComponent, DetailContent } from "components";
import AddUserForm from "./AddUserForm";

const ViewUser = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {}, 
  UserList = [] 
}) => {
  const fields = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { 
      key: "status", 
      label: "Status",
      formatter: (value) => value ? "Active" : "Inactive"
    }
  ];

  return (
    <NavigationSheetComponent
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="User Detail"
      data={data}
      dataList={UserList}
      reload={reload}
      editComponent={AddUserForm}
      deleteEndpoint={`/users/${data?.id}`}
      refreshEndpoint="/users"
      deleteItemName="name"
      editTooltip="Edit User"
      deleteTooltip="Delete User"
    >
      <DetailContent
        title="User Information"
        fields={fields}
      />
    </NavigationSheetComponent>
  );
};
```

## DetailContent Usage

The `DetailContent` component provides standardized field rendering:

```javascript
const fields = [
  // Simple field
  { key: "name", label: "Name" },
  
  // Field with custom formatter
  { 
    key: "created_at", 
    label: "Created Date",
    formatter: (date) => new Date(date).toLocaleDateString()
  },
  
  // Conditional field
  { 
    key: "status", 
    label: "Status",
    formatter: (status) => status === 1 ? "Active" : "Inactive"
  }
];

<DetailContent
  title="Details"
  fields={fields}
  dateField="updated_at"  // Default: "created_at"
  dateTitle="Last Modified"  // Default: "Created At"
/>
```

## Form Integration Patterns

### Pattern 1: Standard Edit Props (Departments, Designations, OnboardingChecklist)

```javascript
// Form expects: isOpen, setIsOpen, edit, setEdit, reload, onUpdateSuccess
<NavigationSheetComponent
  editComponent={AddDepartmentForm}
  // No additional setup needed
/>
```

### Pattern 2: Additional Props (Departments with Organization)

```javascript
import useUserOrganization from "app/hooks/useUserOrganization";

const ViewDepartment = ({ ... }) => {
  const userOrganization = useUserOrganization();

  return (
    <NavigationSheetComponent
      editComponent={AddDepartmentForm}
      additionalEditProps={{ userOrganization }}
    />
  );
};
```

### Pattern 3: Custom Data Props (Branches, Shifts)

```javascript
// Automatically handled - NavigationSheetComponent passes:
// - editMode={true}
// - branchData={currentItem}
// - shiftData={currentItem}
<NavigationSheetComponent
  editComponent={AddBranchForm}
  // Handles branchData automatically
/>
```

## Advanced Examples

### Custom Content with Multiple Sections

```javascript
const CustomContent = ({ currentItem }) => (
  <div className="space-y-6">
    <DetailContent
      title="Basic Information"
      fields={basicFields}
      currentItem={currentItem}
    />
    <DetailContent
      title="Contact Information"
      fields={contactFields}
      currentItem={currentItem}
    />
    <div className="bg-gray-50 p-4 rounded">
      <h3 className="font-semibold mb-2">Additional Notes</h3>
      <p>{currentItem?.notes || "No notes available"}</p>
    </div>
  </div>
);

<NavigationSheetComponent
  // ... other props
>
  <CustomContent />
</NavigationSheetComponent>
```

### Time-based Fields

```javascript
import moment from "moment";

const formatTime = (utcTime) => {
  return utcTime ? moment.utc(utcTime).local().format("hh:mm A") : "N/A";
};

const fields = [
  { key: "name", label: "Shift Name" },
  { key: "starttime", label: "Start Time", formatter: formatTime },
  { key: "endtime", label: "End Time", formatter: formatTime }
];
```

## Error Handling

The component includes built-in error handling:

```javascript
// Defensive array validation
const validList = Array.isArray(dataList) ? dataList : [];

// API error handling
try {
  await deleteRecord(deleteEndpoint, currentItem?.name);
} catch (error) {
  console.error("DELETE ERROR:", error);
}

// Graceful fallbacks
const positionIndicator = dataList.length > 0 ? `${currentIndex + 1} of ${dataList.length}` : null;
```

## Best Practices

### 1. **Consistent Field Definitions**
```javascript
// ✅ Good: Descriptive and consistent
const fields = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email Address" },
  { key: "department_name", label: "Department" }
];

// ❌ Avoid: Inconsistent or unclear labels
const fields = [
  { key: "name", label: "name" },
  { key: "email", label: "EMAIL" },
  { key: "dept", label: "Dept." }
];
```

### 2. **Proper Data Flow**
```javascript
// ✅ Good: Pass complete data list for navigation
<NavigationSheetComponent
  data={selectedItem}
  dataList={completeItemList}  // Full dataset, not paginated
  reload={handleReload}
/>

// ❌ Avoid: Partial or paginated data
<NavigationSheetComponent
  data={selectedItem}
  dataList={currentPageItems}  // Only current page
/>
```

### 3. **API Endpoint Consistency**
```javascript
// ✅ Good: RESTful endpoint patterns
deleteEndpoint={`/users/${data?.id}`}
refreshEndpoint="/users"

// ✅ Good: Specific endpoints
deleteEndpoint={`/departments/${data?.id}`}
refreshEndpoint="/departments"
```

### 4. **Error Prevention**
```javascript
// ✅ Good: Defensive props
const ViewComponent = ({ 
  isOpen, 
  setIsOpen, 
  data, 
  reload = () => {},     // Default function
  ItemList = []          // Default empty array
}) => {
  // Component implementation
};
```

## Migration Guide

### From Legacy View Components

**Before (200+ lines):**
```javascript
// Old pattern with lots of boilerplate
const [editMode, setEditMode] = useState(false);
const [deleteAlert, setDeleteAlert] = useState(false);
const [currentItem, setCurrentItem] = useState(data);
// ... 150+ more lines of navigation logic
```

**After (40 lines):**
```javascript
// New pattern with NavigationSheetComponent
const fields = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" }
];

return (
  <NavigationSheetComponent
    isOpen={isOpen}
    setIsOpen={setIsOpen}
    title="Item Detail"
    data={data}
    dataList={ItemList}
    reload={reload}
    editComponent={AddItemForm}
    deleteEndpoint={`/items/${data?.id}`}
    refreshEndpoint="/items"
  >
    <DetailContent
      title="Item Details"
      fields={fields}
    />
  </NavigationSheetComponent>
);
```

## Troubleshooting

### Common Issues

1. **Navigation not working**
   - Ensure `dataList` is passed and is an array
   - Check that items have `id` property

2. **Edit form not opening**
   - Verify `editComponent` is imported correctly
   - Check `additionalEditProps` for required props

3. **Position indicator showing wrong numbers**
   - Ensure `dataList` contains the complete dataset, not paginated results

4. **Delete operation failing**
   - Verify `deleteEndpoint` format: `/resource/${id}`
   - Check `deleteItemName` matches the field name for confirmation

## Real-World Examples

All OfficeSetting modules have been successfully migrated:

- ✅ **Departments**: [ViewDepartment.jsx](../app/modules/OfficeSetting/Screens/Departments/ViewDepartment.jsx)
- ✅ **Designations**: [ViewDesignation.jsx](../app/modules/OfficeSetting/Screens/Designations/ViewDesignation.jsx)
- ✅ **Branches**: [ViewBranch.jsx](../app/modules/OfficeSetting/Screens/Branches/ViewBranch.jsx)
- ✅ **OnboardingChecklist**: [ViewOnboarding.jsx](../app/modules/OfficeSetting/Screens/OnboardingChecklist/ViewOnboarding.jsx)
- ✅ **Shifts**: [ViewShift.jsx](../app/modules/OfficeSetting/sections/Shift/ViewShift.jsx)

## Contributing

When creating new detail views:

1. Use `NavigationSheetComponent` as the wrapper
2. Use `DetailContent` for field rendering
3. Follow the established patterns for form integration
4. Include proper error handling and defensive programming
5. Test navigation with small and large datasets

---

**Code Reduction Achieved: ~900 lines eliminated across 5 components (80%+ reduction per component)** 