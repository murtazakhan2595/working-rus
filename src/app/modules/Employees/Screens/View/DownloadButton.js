import React from "react";
import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import moment from "moment";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const prepareDownloadData = (userData, experiences, visa, certifications) => { 
  console.log(userData, experiences, visa, certifications);
  // Personal Information Section
  const personalInfo = [
    { title: "Personal Information", data: "" },
    { title: "First Name", data: userData.first_name },
    { title: "ID Card No", data: userData?.nic },
    { title: "Contact No", data: userData?.mobile_no },
    { title: "Nationality", data: userData?.nationality },
    { title: "Father Name", data: userData?.father_name },
    { title: "Last Name", data: userData?.last_name },
    {
      title: "Date of Birth",
      data: moment(userData.date_of_birth, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
    { title: "Email Address", data: userData?.other_email },
    { title: "Marital Status", data: userData?.marital_status },
    { title: "Mother Name", data: userData?.mother_name },
    { title: "", data: "" },
  ];

  // Contact Information Section
  const contactInformation = [
    { title: "Contact Information", data: "" },
    { title: "Emergency Contact", data: userData?.emergency_phone_no },
    { title: "Full Name", data: userData?.emergency_first_name },
    { title: "Relation", data: userData?.emergency_relation },
    { title: "Permanent Address", data: userData?.residential_address },
    { title: "Present Address", data: userData?.current_address },
    { title: "", data: "" },
  ];

  // Bank Information Section
  const bankInformation = [
    { title: "Bank Information", data: "" },
    { title: "Bank Name", data: userData?.bank_name },
    { title: "Account Title", data: userData?.account_title },
    { title: "Account Number", data: userData?.account_number },
    { title: "IBAN", data: userData?.account_iban },
    { title: "Branch Address", data: userData?.branch_address },
    { title: "Branch Code", data: userData?.branch_code },
    { title: "Swift Code", data: userData?.swift_code },
    { title: "", data: "" },
  ];

  // Identification Details Section
  const identificationDetails = [
    { title: "Identification Details", data: "" },
    { title: "Current Country ID", data: visa.living_country_id_no },
    { title: "Issuance Country", data: visa.place_of_issuance },
    {
      title: "ID Issuance Date",
      data: moment(visa.id_issuance_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
    {
      title: "ID Expiry Date",
      data: moment(visa?.id_expiry_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
    { title: "ID Front Image", data: "Link to ID Front Image" },
    { title: "ID Back Image", data: "Link to ID Back Image" },
    { title: "", data: "" },
  ];

  // Work Information Section
  const workInformation = [
    { title: "Work Information", data: "" },
    { title: "Department", data: "Project Management" },
    { title: "Position", data: "Project Coordinator" },
    { title: "Work Email", data: userData.work_email },
    { title: "Employee Type", data: userData.employee_type },
    { title: "Employee Status", data: userData.employee_status },
    { title: "Work Type", data: userData.employee_work_type },
    { title: "Work Location", data: userData.employee_location },
    { title: "Direct Report To", data: "manager" },
    { title: "Department Head", data: userData.department_manager },
    {
      title: "Joining Date",
      data: moment(userData.joining_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    },
    { title: "", data: "" },
  ];

  // Experiences Section
  const experienceData = [{ title: "Experiences", data: "" }];
  experiences.forEach((exp, index) => {
    experienceData.push({ title: `Experience ${index + 1}`, data: "" });
    experienceData.push({ title: "Organization", data: exp.exp_organization });
    experienceData.push({ title: "Designation", data: exp.exp_designation });
    experienceData.push({ title: "Description", data: exp.exp_discription });
    experienceData.push({
      title: "Start Date",
      data: moment(exp.exp_start_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    });
    experienceData.push({
      title: "End Date",
      data: exp.exp_end_date
        ? moment(exp.exp_end_date, "YYYY-MM-DD").format("DD-MM-YYYY")
        : "N/A",
    });
    experienceData.push({
      title: "Experience Letter",
      data: exp.exp_letter?.name,
    });
    experienceData.push({ title: "", data: "" });
  });

  // Certifications Section
  const certificationData = [{ title: "Certifications", data: "" }];
  certifications.forEach((cert, index) => {
    certificationData.push({ title: `Certification ${index + 1}`, data: "" });
    certificationData.push({
      title: "Certification Name",
      data: cert.certification_name,
    });
    certificationData.push({
      title: "Completion Date",
      data: moment(cert.completion_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
    });
    certificationData.push({
      title: "Expiry Date",
      data: cert.expiry_date
        ? moment(cert.expiry_date, "YYYY-MM-DD").format("DD-MM-YYYY")
        : "N/A",
    });
    certificationData.push({
      title: "Certification Institute",
      data: cert.certification_institute,
    });
    certificationData.push({
      title: "Certification Body",
      data: cert.certification_body || "N/A",
    });
  });

  // Combine all data
  const combinedData = [
    ...personalInfo,
    ...contactInformation,
    ...bankInformation,
    ...identificationDetails,
    ...workInformation,
    ...experienceData,
    ...certificationData,
  ];

  return combinedData;
};

const DownloadExcel = ({ userData, experiences, visa, certifications }) => {
  const handleDownload = async () => {
    const data = prepareDownloadData(
      userData,
      experiences,
      visa,
      certifications
    );

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(
      data.map(({ title, data }) => ({ Title: title, Data: data }))
    );

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employee Data");

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    // Create zip file
    const zip = new JSZip();
    zip.file("EmployeeData.xlsx", excelBuffer);

    // Add experience letters
    experiences.forEach((exp, index) => {
      if (exp.exp_letter && exp.exp_letter.file) {
        const base64Data = exp.exp_letter.file.split(",")[1];
        zip.file(exp.exp_letter.name, base64Data, { base64: true });
      }
    });

    // Add profile picture
    if (userData.profile_picture && userData.profile_picture.file) {
      const base64Data = userData.profile_picture.file.split(",")[1];
      zip.file(userData.profile_picture.name, base64Data, { base64: true });
    }

    // Add ID front and back images
    if (visa.id_front && visa.id_front.document.file) {
      const base64Data = visa.id_front.document.file.split(",")[1];
      zip.file(visa.id_front.document.name, base64Data, { base64: true });
    }

    if (visa.id_back && visa.id_back.document.file) {
      const base64Data = visa.id_back.document.file.split(",")[1];
      zip.file(visa.id_back.document.name, base64Data, { base64: true });
    }


    // Generate zip and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "EmployeeData.zip");
  };

  return (
    <button
      className="flex items-center gap-x-2 py-2 opacity-50 text-base font-semibold leading-6 border-2 border-black rounded-lg font-opensans px-4"
      onClick={handleDownload}
    >
      <div>Download</div>
      <FiDownload />
    </button>
  );
};

export default DownloadExcel;
