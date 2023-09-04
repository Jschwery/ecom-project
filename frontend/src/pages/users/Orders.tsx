import React from "react";
import SignedInNav from "../../components/SignedInNavBar";

function Orders() {
  return (
    <>
      <SignedInNav />

      <div className="w-full h-screen bg-ca2 p-10 pt-20">
        <div className="w-full flex flex-col items-center">
          <h1>Your orders</h1>
          <div className="flex w-full p-4"></div>
        </div>
      </div>
    </>
  );
}

export default Orders;
