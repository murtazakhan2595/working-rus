export function convertToK(number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(0) + "K";
    }
    return number?.toString();
  }