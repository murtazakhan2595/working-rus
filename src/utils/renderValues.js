import moment from "moment";

export const getRandomColor = (letter) => {
    letter = letter?.toUpperCase();
    const colors = {
      A: "bg-plum-300",
      B: "bg-plum-400",
      C: "bg-plum-500",
      D: "bg-plum-600",
      E: "bg-plum-300",
      F: "bg-plum-400",
      G: "bg-plum-500",
      H: "bg-plum-600",
      I: "bg-plum-300",
      J: "bg-plum-400",
      K: "bg-plum-500",
      L: "bg-plum-600",
      M: "bg-plum-300",
      N: "bg-plum-400",
      O: "bg-splum-500",
      P: "bg-plume-600",
      Q: "bg-plum-300",
      R: "bg-plum-400",
      S: "bg-plum-500",
      T: "bg-plum-600",
      U: "bg-plum-300",
      V: "bg-plum-400",
      W: "bg-plum-500",
      X: "bg-plum-600",
      Y: "bg-plum-300",
      Z: "bg-plum-400"
    };
  
    if (letter && colors[letter]) {
      return colors[letter];
    } else {
      const colorValues = Object.values(colors);
      return colorValues[Math.floor(Math.random() * colorValues.length)];
    }
  };
  
export function numberToWords(number) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  // Convert integer part to words
  function convertHundreds(num) {
    let result = "";
    if (num > 99) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num = num % 100;
    }
    if (num > 9 && num < 20) {
      result += teens[num - 10] + " ";
    } else if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num = num % 10;
    }
    if (num > 0 && num < 10) {
      result += ones[num] + " ";
    }
    return result.trim();
  }

  // Main function to convert number to words
  function convertToWords(num) {
    if (num === 0) return "Zero";

    let result = "";
    let thousandIndex = 0;

    while (num > 0) {
      let chunk = num % 1000;
      if (chunk > 0) {
        result =
          convertHundreds(chunk) +
          " " +
          thousands[thousandIndex] +
          " " +
          result;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    return result.trim();
  }

  // Separate the integer and decimal parts
  const [integerPart, decimalPart] = number.toString().split(".");

  // Convert integer part
  let result = convertToWords(parseInt(integerPart)) + " AED";

  // Optional: Handle decimal part (cents)
  if (decimalPart) {
    const cents = parseInt(decimalPart.slice(0, 2)); // take only two decimal digits
    if (cents > 0) {
      result += " and " + convertToWords(cents) + " Cents";
    }
  }

  return result.trim();
}

export function renderDate(date){
  return date? moment(date).format("MMM DD, YYYY"):'N/A';
}
