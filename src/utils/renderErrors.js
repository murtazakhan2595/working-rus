import { toast } from "react-toastify";

export function renderErrorMessages(errorObj) {
  debugger
  let errorMessages = "";

  for (const key in errorObj) {
    if (key === 'detail') {
      errorMessages += `${errorObj[key]}\n\n`;
    }
    if (Array.isArray(errorObj[key])) {
      const messages = errorObj[key].map((msg) => `${msg}`).join("\n");
      errorMessages += `${messages}\n\n`;
    }

  }

  const finalMessage = errorMessages.trim(); // removes the last new line

  toast.error(`${finalMessage}`, {
    autoClose: 3000,      // Closes automatically after 3 seconds
    closeOnClick: true,   // Optional
    closeButton: true     // Optional
  });
}