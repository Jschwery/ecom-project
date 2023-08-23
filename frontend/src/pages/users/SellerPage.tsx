import React from "react";
import { useParams } from "react-router-dom";

function SellerPage({}) {
  const seller = useParams();

  //get seller from params, make request to backend for the seller information, such as reviews, and other products

  return (
    <div className="w-full h-screen">
      <div className="flex-col sm:flex-row p-4">
        <div className="w">
          <img className="object-contain" src="" alt="" />
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default SellerPage;
