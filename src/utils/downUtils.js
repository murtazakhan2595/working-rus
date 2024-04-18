import axios from 'axios';

export const downloadFiles = async (file, name) => {
    try {
        const response = await axios.get(file, {
            responseType: "blob",
        });

        const contentType = response.headers["content-type"];

        // Check if the content type indicates a PDF
        if (contentType === 'application/pdf') {
            downloadFile(response.data, `${name}.pdf`);
        } else if (contentType.startsWith('image')) {
            downloadFile(response.data, `${name}.${getImageExtension(contentType)}`);
        } else {
            console.error("Unsupported file type.");
        }
    } catch (error) {
        console.error("Error fetching file:", error);
    }
};

const downloadFile = (data, fileName) => {
    const url = window.URL.createObjectURL(data);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(url);
};

const getImageExtension = (contentType) => {
    switch (contentType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/gif':
            return 'gif';
        // Add support for more image formats if needed
        default:
            return 'jpg'; // Default to jpg if the format is not recognized
    }
};