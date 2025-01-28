import moment from "moment";
import { getDarkerTextColor } from "app/modules/TaskManagment/Boards/Sections/getTaskStatus";

export function getDropdownList(list, label = "name", value = "id") {
  if (!list || list.length === 0) return [];
  const dropdownList = list.map((obj) => {
    return { label: obj[label], value: obj[value] };
  });
  return dropdownList;
}
/**
 * Converts an array of strings into an array of objects
 * with `label` and `value` properties having the same value.
 *
 * @param {string[]} options - An array of strings to be converted into dropdown options.
 * @returns {Object[]} - An array of objects where each object has `label` and `value` properties.
 *                       Returns an empty array if the input is invalid or empty.
 */
export function createDropdownOptions(options) {
  // If the input is invalid or empty, return an empty array.
  if (!options || options.length === 0) return [];

  // Map each string to an object with `label` and `value` properties.
  const dropdownOptions = options.map((option) => {
    return { label: option, value: option };
  });

  return dropdownOptions;
}

export function getLabelDropdownList(list, label = "name", value = "id") {
  if (!list || list.length === 0) return [];
  const dropdownList = list.map((obj) => {
    return {
      label: (
        <div
          key={obj[value]}
          className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-lg flex items-center ${
            obj?.color
          } ${getDarkerTextColor(obj?.color)}`}
        >
          {obj[label]}
        </div>
      ),
      value: obj[value],
    };
  });
  return dropdownList;
}

export function getEmployeeLeavesTypesList(LeaveTypes, employeeLeaveType) {
  if (
    employeeLeaveType &&
    employeeLeaveType.length > 0 &&
    LeaveTypes &&
    LeaveTypes.length > 0
  ) {
    const employeeLeaveTypeList = employeeLeaveType.map((item) => {
      const leaveType = LeaveTypes.find(
        (type) => type.value === item.leave_type
      );
      return {
        value: item.id,
        label: leaveType ? leaveType.label : "Unknown",
        leave_type_id: item.leave_type,
      };
    });
    return employeeLeaveTypeList;
  } else {
    return [];
  }
}
export function getLeavesTypeNameList(LeaveTypes) {
  const LeaveTypeNameList = LeaveTypes.map((leaveType) => {
    return leaveType ? leaveType.label : "Unknown";
  });
  return LeaveTypeNameList;
}
export function getEmployeeLeavesAgainsLeaveType(
  employeeLeavesType,
  LeaveTypes
) {
  // Ensure inputs are arrays
  if (!Array.isArray(employeeLeavesType) || !Array.isArray(LeaveTypes)) {
    return {};
  }

  // Initialize arrays for used, remaining, and total leaves
  const usedLeaves = [];
  const remainingLeaves = [];
  const totalLeaves = [];

  // Map through LeaveTypes to populate the arrays
  LeaveTypes.forEach((leaveType) => {
    const leaves = employeeLeavesType.find(
      (obj) => obj.leave_type === leaveType.value
    );

    // Push the values into respective arrays
    usedLeaves.push(leaves ? leaves.used_leave : 0);
    remainingLeaves.push(leaves ? leaves.left_leave : 0);
    totalLeaves.push(leaves ? leaves.total_alloted_leaves : 0);
  });

  // Return the results as an object
  return { usedLeaves, remainingLeaves, totalLeaves };
}

export const yearsDropdownList = (StartYear, EndYear) => {
  const years = [];
  for (let year = EndYear; year >= StartYear; year--) {
    years.push({ label: year, value: year });
  }
  return years;
};

export function getTaskFilteredData(tasksList, filterData) {
  if (filterData?.end_date) {
    if (filterData?.end_date === "overdue") {
      return tasksList.filter((task) =>
        moment(task.end_date).isBefore(moment(new Date()))
      );
    }
    if (filterData?.end_date === "nextday") {
      const nextDay = moment(new Date()).add(1, "days");
      return tasksList.filter(
        (task) => task.end_date === nextDay.format("YYYY-MM-DD")
      );
    } else {
      return tasksList.filter((task) => !task.end_date);
    }
  }
  if (filterData?.assigned_to) {
    if (filterData?.assigned_to === "noMember") {
      return tasksList.filter(
        (task) => task.assigned_to === filterData?.assigned_to
      );
    }
    if (filterData?.priority === "priority") {
      if (filterData?.priority === "noPriority") {
        return tasksList.filter((task) => !task.priority);
      }
      return tasksList.filter((task) => task.priority === filterData?.priority);
    }
    if (filterData?.assigned_to === "noMemberSelected") {
      return tasksList.filter(
        (task) => !task.noMemberSelected || task.noMemberSelected.length === 0
      );
    }
  }
  return tasksList;
}

/**
 * Converts an array of objects with "field" and "value" keys
 * into an array of strings in the format: "field: value".
 *
 * @param {Array} data - The array of objects to convert.
 * @returns {Array} - An array of strings in "field: value" format.
 */
export function convertJSONArrayToStringsArray(
  data,
  label = "name",
  value = "value"
) {
  // Check if the input is valid
  if (!Array.isArray(data) || data.length === 0) {
    return []; // Return an empty array if data is not valid
  }

  // Map each object to a string in the desired format
  return data.map((item) => `${item[label]}: ${item[value]}`);
}

/**
 * Converts an array of strings in the format "field: value"
 * into an array of JSON objects with custom keys.
 *
 * @param {Array} data - The array of strings to convert.
 * @param {string} label - The key name for the field (default: "name").
 * @param {string} valueKey - The key name for the value (default: "value").
 * @returns {Array} - An array of JSON objects with custom keys.
 */
export function convertStringsArrayToJsonArray(data, label = "name", valueKey = "value") {
  // Check if the input is valid
  if (!Array.isArray(data) || data.length === 0) {
    return []; // Return an empty array if data is not valid
  }

  // Map each string to a JSON object
  return data.map((item) => {
    const [field, value] = item.split(":").map((str) => str.trim()); // Split and trim
    return { [label]: field, [valueKey]: value };
  });
}

