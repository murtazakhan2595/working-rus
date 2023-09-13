import { TbAlertCircleFilled } from "react-icons/tb";

export const tasks = [
  {
    id: 1,
    taskName: "Office Landing Page",
    assignBy: "Sarrah Jones",
    dueDate: "30/5/2023",
    status: "Testing",
    progress: 40,
    priority: "high",
  },
  {
    id: 2,
    taskName: "Update User Profiles",
    assignBy: "John Smith",
    dueDate: "15/6/2023",
    status: "Updates",
    progress: 20,
    priority: "medium",
  },
  {
    id: 3,
    taskName: "Fix Bug in Contact Form",
    assignBy: "Emily Brown",
    dueDate: "10/5/2023",
    status: "InProgress",
    progress: 80,
    priority: "high",
  },
  {
    id: 4,
    taskName: "Product Mockups",
    assignBy: "Alex Johnson",
    dueDate: "20/7/2023",
    status: "Completed",
    progress: 60,
    priority: "medium",
  },
  {
    id: 5,
    taskName: "User Documentation",
    assignBy: "Chris Davis",
    dueDate: "5/8/2023",
    status: "Testing",
    progress: 10,
    priority: "low",
  },
];

export const tasksTitle = [
  { label: "Task Name", width: "w-40" },
  { label: "Assign By", width: "w-28" },
  { label: "Due Date", width: "w-28" },
  { label: "Status", width: "w-28" },
  { label: "Progress", width: "w-40" },
  { label: "Priority", width: "w-28" },
];

export const todoList = [
  {
    id: 1,
    text: "Email Sarrah",
    completed: false,
  },
  {
    id: 2,
    text: "Schedule The Meeting",
    completed: true,
  },
  {
    id: 3,
    text: "Update The Page",
    completed: true,
  },
  {
    id: 4,
    text: "Assign Work To Sarrah",
    completed: false,
  },
  {
    id: 5,
    text: "Assign Work To John", // Changed text to make it unique
    completed: false,
  },
  {
    id: 6,
    text: "Assign Work To Jane", // Changed text to make it unique
    completed: false,
  },
  {
    id: 7, // Added a new unique item
    text: "Create New Report",
    completed: false,
  },
  {
    id: 8,
    text: "Assign Work To Alex", // Changed text to make it unique
    completed: false,
  },
];

export const priority = [
  {
    value: "low",
    label: <TbAlertCircleFilled className="text-green-600 text-2xl" />,
  },
  {
    value: "medium",
    label: <TbAlertCircleFilled className="text-[#ffa500] text-2xl" />,
  },
  {
    value: "high",
    label: <TbAlertCircleFilled className="text-red-600 text-2xl" />,
  },
];

export const assigToData = [
  {
    id: 1,
    name: "Syed Umair",
    imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
  },
  {
    id: 2,
    name: "Moattar Ali",
    imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
  },
  {
    id: 3,
    name: "Asra Fatima",
    imageUrl: "https://i.ibb.co/QdJwgmp/brown-cowboy.png",
  },
  {
    id: 4,
    name: "John wick",
    imageUrl: "",
    isPlusIcon: true,
  },
  // {
  //   "id": 5,
  //   "name": "Grey Brim",
  //   "imageUrl": "https://i.ibb.co/RjBLWxB/grey-brim.png",
  // },
  // {
  //   "id": 6,
  //   "name": "Grey Brim",
  //   "imageUrl": "https://i.ibb.co/RjBLWxB/grey-brim.png",
  // },
];
export const assigByData = [
  {
    id: 1,
    name: "Syed Umair",
    imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
  },
  {
    id: 2,
    name: "Moattar Ali",
    imageUrl: "https://i.ibb.co/ypkgK0X/blue-beanie.png",
  },
  {
    id: 3,
    name: "Asra Fatima",
    imageUrl: "https://i.ibb.co/QdJwgmp/brown-cowboy.png",
  },
  {
    id: 4,
    name: "Asra Fatima",
    imageUrl: "https://i.ibb.co/QdJwgmp/brown-cowboy.png",
  },
  {
    id: 5,
    name: "John wick",
    imageUrl: "",
    isPlusIcon: true,
  },
  // {
  //   "id": 5,
  //   "name": "Grey Brim",
  //   "imageUrl": "https://i.ibb.co/RjBLWxB/grey-brim.png",
  // },
  // {
  //   "id": 6,
  //   "name": "Grey Brim",
  //   "imageUrl": "https://i.ibb.co/RjBLWxB/grey-brim.png",
  // },
];
