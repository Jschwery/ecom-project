import React, { useEffect, useState } from "react";

interface SaleItemProps {
  itemName: string;
  imageUrl: string;
  description: string;
  stars: number;
}

const SaleItem: React.FC<SaleItemProps> = ({
  itemName,
  imageUrl,
  description,
  stars,
}) => {
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  useEffect(() => {
    console.log(showMoreDescription);
  }, [showMoreDescription]);

  return (
    <div
      className={`flex flex-col w-full items-center grow rounded-md shadow-sm shadow-black space-y-1s bg-teal-200 transition-all duration-500 ease-in-out`}
    >
      <h1>{itemName}</h1>
      <img
        className="bg-blue-600 object-contain max"
        src={imageUrl}
        alt={itemName}
        width={"100%"}
      />
      <div className="w-full bg-red-100 rounded-b-md">
        <div className="flex flex-col items-start justify-between pl-4">
          <h3>{itemName}</h3>
          <div className="flex items-center ">
            <div className="star-ratings text-4xl sm:text-xl md:text-2xl">
              <div className="fill-ratings" style={{ width: "50%" }}>
                <span>★★★★★</span>
              </div>
              <div className="empty-ratings">
                <span>★★★★★</span>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3 mx-1 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>

            <h5 className="cursor-pointer text-blue-600">{200}</h5>
          </div>
          <p className="flex items-start leading-5">
            <span
              style={{ fontSize: "0.8em", verticalAlign: "top" }}
            >{`$`}</span>
            <span style={{ fontSize: "1.5em" }}>{11}</span>
            <span style={{ fontSize: "0.8em", verticalAlign: "top" }}>
              {99}
            </span>
          </p>
          <div className="w-full flex justify-end bg-red-100 pr-2 pb-1 rounded-b-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 hover:text-green-600 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleItem;
