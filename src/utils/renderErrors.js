import { toast } from "react-toastify";

export function renderErrorMessages(errorObj) {
  const errorElements = [];

  for (const key in errorObj) {
    if (key === 'detail') {
      errorElements.push(
        <div key="detail">
          {errorObj[key]}
        </div>
      );
    } else if (Array.isArray(errorObj[key])) {
      const messages = errorObj[key].map((msg, index) => (
        <div key={`${key}-${index}`}>
          <strong>{key}:</strong> {msg}
        </div>
      ));
      errorElements.push(...messages);
    }
  }

  toast.error(<div>{errorElements}</div>, {
    autoClose: 3000,
    closeOnClick: true,
    closeButton: true,
  });
}
