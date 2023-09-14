import React, { useEffect, useState } from "react";

interface Props {
  hideSvg?: boolean;
  dealPackage?: {
    imagePath: string;
    imageGrow: boolean;
    dealLink: string;
    dealHeader: string;
    dealSubheader: string;
    dealPercentage: string;
  }[];
  images?: string[] | string;
  imageGrow?: boolean;
}

function PictureCarousel({
  images: originalImages = [],
  imageGrow,
  hideSvg,
  dealPackage = [],
}: Props) {
  const dealImages = dealPackage.map((dp) => dp.imagePath);
  const images = [
    ...dealImages,
    ...(typeof originalImages === "object" ? originalImages : [originalImages]),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideTimer, setSlideTimer] = useState<number | null>(null);

  const nextImage = () => {
    clearTimeout(slideTimer as unknown as number);
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    clearTimeout(slideTimer as unknown as number);
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const onSlideClick = () => {
    if (currentImageIndex < dealPackage.length) {
      window.location.pathname = dealPackage[currentImageIndex].dealLink;
    }
  };

  useEffect(() => {
    if (images.length > 1) {
      const timer = setTimeout(() => {
        nextImage();
      }, 3000);

      setSlideTimer(timer as unknown as number);

      return () => {
        clearTimeout(slideTimer as unknown as number);
      };
    }
  }, [currentImageIndex]);

  useEffect(() => {
    console.log("the imgs");
    console.log(images.length);

    console.log(images);
  }, [images]);

  return (
    <div className="flex h-[250px] w-full !mx-8 justify-center items-center md:mx-3">
      {images && images.length > 0 && (
        <>
          <button
            onClick={prevImage}
            className={`flex-shrink-0 px-3 p-2 ${
              !(images.length > 1) ? "hidden" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {currentImageIndex < dealPackage.length &&
          dealPackage[currentImageIndex] ? (
            <div
              onClick={onSlideClick}
              className="flex-shrink-0 w-full cursor-pointer shadow-md shadow-black h-full flex items-center justify-center relative"
            >
              <img
                src={images[currentImageIndex]}
                alt={`Deal ${currentImageIndex}`}
                className={`absolute  top-0 left-0  w-full h-full ${
                  imageGrow ? "object-cover" : "object-contain"
                }`}
              />
              <div className="relative z-10">
                <h1 className="text-ca9">
                  {dealPackage[currentImageIndex].dealHeader}
                </h1>
                <h3>{dealPackage[currentImageIndex].dealSubheader}</h3>
              </div>
            </div>
          ) : (
            <img
              src={images[currentImageIndex] || "/images/logo2.svg"}
              alt={`Slide ${currentImageIndex}`}
              className={`flex-shrink-0 w-full h-full ${
                imageGrow ? "object-cover" : "object-contain"
              }`}
            />
          )}

          <button
            onClick={nextImage}
            className={`flex-shrink-0 p-2 ${
              !(images.length > 1) ? "hidden" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`w-6 h-6${hideSvg ? "hidden" : "visible"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

export default PictureCarousel;
