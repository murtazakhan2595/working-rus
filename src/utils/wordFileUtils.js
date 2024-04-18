import axios from 'axios';

export const downloadAttachmentWord = async (file, name) => {
    try {
        const response = await axios.get(file, {
            responseType: "blob",
        });

        const contentType = response.headers["content-type"];

        // Check if the content type indicates a Word file
        if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            downloadFile(response.data, `${name}.docx`);
        } else {
            console.error("Unsupported file type.");
        }
    } catch (error) {
        console.error("Error fetching file:", error);
    }
};

const downloadFile = (data, fileName) => {
    const url = window.URL.createObjectURL(data);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the download attribute

    // Programmatically trigger a click on the link to initiate the download
    link.click();

    // Revoke the object URL to free up memory
    window.URL.revokeObjectURL(url);
};
