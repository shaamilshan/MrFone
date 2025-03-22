import React from "react";

const OfferHeader = () => {

  return (
    <div className="w-full text-xs bg-[#000000] text-white py-4 overflow-hidden relative">
      <div className="flex justify-between mx-2">
        <div className="flex gap-2">
        <div className="border-r pr-2">(09)12345565654</div>
        <div>Store location</div>
        </div>
        <div>Tell a friend about Drou & get 20% off*</div>
        <div className="flex">
        <div>USD</div>
        <div>Login/Signup</div> 
        </div>
      </div>
    </div>
  );
};

export default OfferHeader;
