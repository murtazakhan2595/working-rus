import moment from "moment";
import { Badge } from "components/ui/badge";
import { lightenColor } from "utils/renderValues";
import { useSelector } from "react-redux";

/**
 * Generates a dropdown list from an array of items.
 *
 * @param {Array} items - The array of objects to generate dropdown options from.
 * @param {string} labelKey - The key used for the label in dropdown options (default: "name").
 * @param {string} valueKey - The key used for the value in dropdown options (default: "id").
 * @param {string|null} prefixKey - Optional key to add a prefix before the label.
 * @param {string|null} separator - Separator to use between prefix and label (if prefixKey is provided).
 * @param {Object|null} additionalOption - An optional extra option to add (e.g., { label: "All", value: "all" }).
 *
 * @returns {Array} - Returns an array of dropdown options.
 */
export function getDropdownList(
  items,
  labelKey = "name",
  valueKey = "id",
  prefixKey = null,
  separator = null,
  additionalOption = null
) {
  // If the input array is empty or not an array, return only the additional option if provided
  if (!Array.isArray(items) || items?.length === 0)
    return additionalOption ? [additionalOption] : [];

  // Map items to dropdown-friendly format
  const dropdownOptions = items.map((item) => ({
    label: prefixKey
      ? `${item[prefixKey]} ${separator} ${item[labelKey]}` // Format: "Prefix - Label"
      : item[labelKey], // If no prefix, use label directly
    value: item[valueKey],
  }));

  // If additionalOption exists, append it to the dropdown options
  return additionalOption
    ? [additionalOption, ...dropdownOptions]
    : dropdownOptions;
}

export function getDropdownListWithExtraKeys(
  items,
  labelKey = "name",
  valueKey = "id",
  additionalFields = [],
  additionalOption = null,
  prefixKey = null,
  separator = null
) {
  // If the input array is empty or not an array, return only the additional option if provided
  if (!Array.isArray(items) || items?.length === 0) {
    return additionalOption ? [additionalOption] : [];
  }

  // Map items to dropdown-friendly format
  const dropdownOptions = items.map((item) => {
    let label = prefixKey
      ? `${item[prefixKey]} ${separator} ${item[labelKey]}`
      : item[labelKey];

    // Include additional keys if specified
    let additionalData = {};
    additionalFields.forEach((key) => {
      if (item.hasOwnProperty(key)) {
        additionalData[key] = item[key];
      }
    });

    return {
      label,
      value: item[valueKey],
      ...additionalData, // Spread additional fields dynamically
    };
  });

  // Include the additional option at the start if provided
  return additionalOption
    ? [additionalOption, ...dropdownOptions]
    : dropdownOptions;
}

export function getFormattedDropdownItems(
  items,
  labelKey = "name",
  valueKey = "id",
  prefixKey = null,
  separator = null,
  additionalOption = null
) {
  // If the input array is empty or not an array, return only the additional option if provided
  if (!Array.isArray(items) || items?.length === 0)
    return additionalOption ? [additionalOption] : [];

  // Map items to dropdown-friendly format
  const dropdownOptions = items.map((item) => ({
    label: prefixKey
      ? `${item[prefixKey]} ${separator} ${item[labelKey]}` // Format: "Prefix - Label"
      : item[labelKey], // If no prefix, use label directly
    value: item[valueKey],
    ...item,
  }));

  // If additionalOption exists, append it to the dropdown options
  return additionalOption
    ? [additionalOption, ...dropdownOptions]
    : dropdownOptions;
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
  if (!options || options?.length === 0) return [];
  // Map each string to an object with `label` and `value` properties.
  const dropdownOptions = options.map((option) => {
    return { label: option, value: option };
  });

  return dropdownOptions;
}

export function getLabelDropdownList(list, label = "name", value = "id") {
  if (!list || list?.length === 0) return [];
  const dropdownList = list.map((obj) => {
    return {
      label: (
        <Badge
          className={``}
          style={{
            background: lightenColor(obj?.color, 85),
            color: obj.color,
          }}
        >
          {obj[label]}
        </Badge>
      ),
      value: obj[value],
    };
  });
  return dropdownList;
}

export function getEmployeeLeavesTypesList(LeaveTypes, employeeLeaveType) {
  if (
    employeeLeaveType &&
    employeeLeaveType?.length > 0 &&
    LeaveTypes &&
    LeaveTypes?.length > 0
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
        (task) => !task.noMemberSelected || task.noMemberSelected?.length === 0
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
  if (!Array.isArray(data) || data?.length === 0) {
    return []; // Return an empty array if data is not valid
  }

  // Map each object to a string in the desired format
  return data.map((item) => `${item[label]}:${item[value]}`);
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
export function convertStringsArrayToJsonArray(
  data,
  label = "name",
  valueKey = "value"
) {
  // Check if the input is valid
  if (!Array.isArray(data) || data?.length === 0) {
    return []; // Return an empty array if data is not valid
  }

  // Map each string to a JSON object
  return data.map((item) => {
    const [field, value] = item.split(":").map((str) => str.trim()); // Split and trim
    return { [label]: field, [valueKey]: value };
  });
}

/**
 * Extracts a list of values for the given keys from an array of objects.
 *
 * @param {Array<Object>} dataList - The array of objects to process.
 * @param {Array<String>} keys - The keys whose values you want to extract.
 * @returns {Array<Object>} - An array of objects containing only the specified keys.
 */
export const ExtractFieldsFromList = (dataList = [], keys = []) => {
  return dataList.map((item) => {
    const extracted = {};
    keys.forEach((key) => {
      extracted[key] = item[key];
    });
    return extracted;
  });
};

/**
 * Extracts a list of values for the given key from an array of objects.
 *
 * @param {Array<Object>} dataList - The array of objects to process.
 * @param {String} key - The key whose values you want to extract.
 * @returns {Array<Object>} - An array of values containing only the specified key.
 */
export const ExtractFieldValueFromList = (dataList = [], key = []) => {
  return dataList.map((item) => {
    return item[key];
  });
};

/**
 * Recursively filters a tree, returning only the parts that contain nodes
 * matching any value in selectedLeafs (based on the provided label).
 *
 * It includes matching nodes, their ancestors, and optionally their children.
 *
 * @param {Object} node - The current tree node to evaluate.
 * @param {Array} selectedLeafs - Array of values to match against.
 * @param {String} label - Key name to match values against (e.g., "id").
 * @returns {Object|null} - Filtered node (with matched children), or null if no match.
 */
export const FilterTreeBySelectedLeafs = (
  node = {},
  selectedLeafs = [],
  label = "id"
) => {
  const children = node.childrens || [];

  // Recursively filter children
  const filteredChildren = children
    .map((child) => FilterTreeBySelectedLeafs(child, selectedLeafs, label))
    .filter((child) => child !== null);

  const isMatch = selectedLeafs.includes(node[label]);

  // If current node is a match or has matching children, include it in the result
  if (isMatch || filteredChildren?.length > 0) {
    return {
      ...node,
      childrens: filteredChildren, // preserve only matching sub-branches
    };
  }

  // Otherwise, exclude this node
  return null;
};

export const GetEmployeeFilteredList = (
  isTeamView = false,
  adminView = false,
  isBranchView = false,
  isDepartmentView = false
) => {
  const Employees = useSelector((state) => state.emp.employees);
  const {
    branch_id: user_branch,
    department_name: user_department,
    id: user_id,
  } = useSelector((state) => state.emp.user_details);

  if (!Array.isArray(Employees) || Employees?.length === 0) return [];

  // Admin view returns all employees
  if (adminView && !isTeamView) {
    return Employees;
  }

  // Determine filters
  const filters = [];

  if (isTeamView) {
    filters.push({
      keys: ['direct_report', 'indirect_report'],
      value: user_id,
    });
  } else if (isBranchView) {
    filters.push({
      keys: ['branch_id'],
      value: user_branch,
    });
  } else if (isDepartmentView) {
    filters.push({
      keys: ['department_name'],
      value: user_department,
    });
  }

  if (filters?.length === 0) return [];
  return Employees.filter((employee) => {
    return filters.some(({ keys, value }) => {
      return keys.some((key) => {
        const empVal = employee[key];
        if (Array.isArray(empVal)) {
          return empVal.includes(value);
        }

        return empVal === value;
      });
    });
  });
};


export const GetCommonFilteredList = (label) => {
  const List = useSelector((state) => state.common[label]);
  return List;
};

export const GetDispatchStateList = (label, list) => {

  const List = useSelector((state) => {
    if (!state || typeof state !== "object") return null;
    if (!list || !label) return null;
    if (!state.hasOwnProperty(list)) return null;
    if (!state[list] || typeof state[list] !== "object") return null;
    return state[list][label] ?? null;
  });

  return List;
};
