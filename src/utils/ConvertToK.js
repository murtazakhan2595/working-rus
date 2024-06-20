export function convertToK(number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number?.toString();
  }