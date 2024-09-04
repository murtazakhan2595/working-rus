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
  
