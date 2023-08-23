import React, { useState } from "react";

interface Props {
  images: string[];
}

function PictureCarousel({ images }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div>
      <button onClick={prevImage}>Previous</button>
      <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex}`} />
      <button onClick={nextImage}>Next</button>
    </div>
  );
}

export default PictureCarousel;

{
  /* <svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
stroke-width="1.5"
stroke="currentColor"
className="w-6 h-6"
>
<path
  stroke-linecap="round"
  stroke-linejoin="round"
  d="M15.75 19.5L8.25 12l7.5-7.5"
/>
</svg>
<svg
xmlns="http://www.w3.org/2000/svg"
fill="none"
viewBox="0 0 24 24"
stroke-width="1.5"
stroke="currentColor"
className="w-6 h-6"
>
<path
  stroke-linecap="round"
  stroke-linejoin="round"
  d="M8.25 4.5l7.5 7.5-7.5 7.5"
/>
</svg> */
}
