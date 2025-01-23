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
const errorClassName = "text-red-100 text-sm font-[inter] font-normal ml-1";

export { File, EmployeeListData, Attachment,imageFileType ,errorClassName};
