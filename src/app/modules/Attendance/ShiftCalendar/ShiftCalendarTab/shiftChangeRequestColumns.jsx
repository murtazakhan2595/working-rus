import { StatusLabel } from "components";
import { EmployeeOverview } from "components";

export const EmployeeColumns = [
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell) => (
      <EmployeeOverview id={cell} showPosition={true} showDepartment={true} />
    ),
    dataSort: true,
  },
  {
    dataField: "assigned_by",
    text: "Requested By",
    formatter: (cell) => <EmployeeOverview id={cell} />,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => {
      return (
        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            cell === "Accepted" || cell === "Approved"
              ? "bg-emerald-50 text-teal-700"
              : cell === "Rejected" || cell === "Rejected"
              ? "bg-red-50 text-red-700"
              : "bg-[#f0f0f3] text-[#7f838d]"
          }`}
        >
          {cell || "N/A"}
        </span>
      );
    },
    dataSort: true,
  },
  // {
  //       dataField: "",
  //       text: "Actions",
  //       formatter: (cell, row, rowIndex, formatExtraData) => {
  //         // Function to view category details
  //         const openCategoryView = () => {
  //           const viewModule = window.AssetsModule;

  //           if (viewModule) {
  //             viewModule.setCategoryToView(row);
  //           }
  //         };

  //         // Function to open the edit category form
  //         const openCategoryEdit = async () => {
  //           try {
  //             const viewModule = window.AssetsModule;

  //             if (viewModule) {
  //               // This sets categoryToView = row
  //               viewModule.setCategoryToView(row);
  //               // This sets createCategory = true
  //               viewModule.setCreateCategory(true);
  //             }
  //           } catch (error) {
  //             console.error("Error preparing category for edit:", error);
  //             toast.error("Failed to prepare category for editing");
  //           }
  //         };

  //         // Function to open delete confirmation
  //         const openDeleteConfirm = () => {
  //           const viewModule = window.AssetsModule;

  //           if (viewModule) {
  //             viewModule.setCategoryToDelete(row);
  //             viewModule.setOpenCategoryDeleteAlert(true);
  //           }
  //         };

  //         const handleView = (e) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           openCategoryView();
  //         };

  //         const handleEdit = (e) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           openCategoryEdit();
  //         };

  //         const handleDelete = (e) => {
  //           e.preventDefault();
  //           e.stopPropagation();
  //           openDeleteConfirm();
  //         };

  //         return (
  //           <div onClick={(e) => e.stopPropagation()}>
  //             <DropdownActionMenu
  //               onView={handleView}
  //               onEdit={handleEdit}
  //               onDelete={handleDelete}
  //               viewText="View Category"
  //               editText="Edit Category"
  //               deleteText="Delete Category"
  //               menuTooltip="Category Actions"
  //             />
  //           </div>
  //         );
  //       },
  //     },
];