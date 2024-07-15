export const getRandomColor = (letter) => {
    letter = letter?.toUpperCase();
    const colors = {
      A: "bg-pink-500",
      B: "bg-yellow-500",
      C: "bg-green-500",
      D: "bg-blue-500",
      E: "bg-purple-500",
      F: "bg-red-500",
      G: "bg-indigo-500",
      H: "bg-teal-500",
      I: "bg-cyan-500",
      J: "bg-orange-500",
      K: "bg-amber-500",
      L: "bg-lime-500",
      M: "bg-emerald-500",
      N: "bg-rose-500",
      O: "bg-sky-500",
      P: "bg-violet-500",
      Q: "bg-fuchsia-500",
      R: "bg-rose-500",
      S: "bg-pink-500",
      T: "bg-yellow-500",
      U: "bg-green-500",
      V: "bg-blue-500",
      W: "bg-purple-500",
      X: "bg-red-500",
      Y: "bg-indigo-500",
      Z: "bg-teal-500"
    };
  
    if (letter && colors[letter]) {
      return colors[letter];
    } else {
      const colorValues = Object.values(colors);
      return colorValues[Math.floor(Math.random() * colorValues.length)];
    }
  };
  
