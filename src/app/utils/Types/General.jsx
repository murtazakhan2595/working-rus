const File = {
  description: null,
  document: null,
  employee_id: null,
  id: null,
  name: null,
};
const Attachment = { attachments: "", id: null, name: null };
const EmployeeListData = {
  count: 0,
  results: [],
  ActiveEmployee: 0,
  TotalEmployee: 0,
  TotalManager: 0,
};
const imageFileType = ["JPG", "JPEG", "PNG", "GIF", "WEBP"];

export { File, EmployeeListData, Attachment,imageFileType };
