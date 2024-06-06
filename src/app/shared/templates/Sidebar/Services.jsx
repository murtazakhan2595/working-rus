import React from "react";

const images = [
  { src: "image1.jpg", title: "Heading 1" },
  { src: "image2.jpg", title: "Heading 2" },
  { src: "image3.jpg", title: "Heading 3" },
  { src: "image4.jpg", title: "Heading 4" },
  { src: "image5.jpg", title: "Heading 5" },
  { src: "image6.jpg", title: "Heading 6" },
  { src: "image7.jpg", title: "Heading 7" },
  { src: "image8.jpg", title: "Heading 8" },
  { src: "image9.jpg", title: "Heading 9" },
  { src: "image10.jpg", title: "Heading 10" },
];

const Services = () => {
  return (
    <div className="flex flex-wrap w-full h-screen">
      {images.map((item, index) => (
        <div
          className="flex flex-col items-center justify-center w-1/5 p-4 border border-gray-300"
          key={index}
        >
          <img
            src={item.src}
            alt={item.title}
            className="max-w-full h-auto mb-2"
          />
          <h3 className="text-center">{item.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Services;
