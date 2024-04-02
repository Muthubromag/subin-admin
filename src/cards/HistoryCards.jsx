import React, { useState, useEffect } from "react";

function HistoryCards({
  date,
  order,
  id,
  time,
  deliveryStatus,
  itemPrice,
  preview,
  paymentMode,
}) {
  return (
    <div className="w-80">
      <div className="border-[#ED7802] flex flex-col  rounded-lg bg-white">
        <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
          <div>S.No: {id}</div>
          <div>{date}</div>
          <div>{time}</div>
        </div>
        <div className="p-4 flex  flex-col space-y-3">
          <div className="text-[#828282] font-medium">
            Order Id : <span className="font-bold text-black">{order}</span>{" "}
          </div>
          {deliveryStatus && (
            <div className="text-[#828282] font-medium">
              Delivery Status :{" "}
              <span className="font-bold text-black">{deliveryStatus}</span>{" "}
            </div>
          )}
          {itemPrice && (
            <div className="text-[#828282] font-medium">
              Bill Amount :{" "}
              <span className="font-bold text-black">{itemPrice}</span>{" "}
            </div>
          )}
          {paymentMode && (
            <div className="text-[#828282] font-medium">
              Payment Mode :{" "}
              <span className="font-bold text-black">{paymentMode}</span>{" "}
            </div>
          )}
        </div>
        <div className="mb-2 px-4">
          <button
            className=" bg-[#222222] text-white rounded-lg p-2  !text-[10px]"
            onClick={preview}
          >
            View Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryCards;
