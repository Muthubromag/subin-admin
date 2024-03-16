import { Select } from "antd";
import React from "react";

const OrdersCard = ({
  id,
  date,
  time,
  orderId,
  deliveryStatus,
  billAmount,
  location,
  preview,
}) => {
  return (
    <div className="flex mt-8 flex-col ">
      <div className="bg-white w-96 m-auto rounded-lg">
        <div className="flex bg-blue-400 rounded-t-lg justify-between  p-4 ">
          <div>S.No: {id}</div>
          <div>{date}</div>
          <div> {time}</div>
        </div>
        <div className="p-4 flex  flex-col space-y-3">
          <div className="text-[#828282] font-medium">
            Order Id : <span className="font-bold text-black">{orderId}</span>{" "}
          </div>
          <div className="text-[#828282] font-medium">
            Bill Amount :{" "}
            <span className="font-bold text-black">{billAmount}</span>{" "}
          </div>
          {deliveryStatus && (
            <div className="text-[#828282] font-medium">
              Delivery Status :{" "}
              <span className="font-bold text-black">{deliveryStatus}</span>{" "}
            </div>
          )}
          {location && (
            <div className="text-[#828282] font-medium">
              location :{" "}
              <span className="font-bold text-black">{location}</span>{" "}
            </div>
          )}
          <div className="flex justify-between ">
            <div className="bg-[#E1EAFB] rounded-md flex w-44 items-center pl-2 space-x-1">
              <div className="text-[#828282] text-[12px]">Status</div>
              <div className="w-full mobile-selector">
                <Select
                  // value={isMovedToKDS ? "Order received" : status}
                  // onChange={(newStatus) =>
                  //   handleStatusChange(record, newStatus)
                  // }

                  className="w-[100%] !text-sm text-white !border-0"
                  clearBg="red"
                  defaultValue="Order Placed"
                  id="status"
                  options={[
                    { value: "delivery", label: "delivery" },
                    { value: "cancel", label: "cancel" },
                  ]}
                />
              </div>
            </div>
            <div className="">
              <button
                className=" bg-blue-900 text-white rounded-lg p-2 "
                onClick={preview}
              >
                View Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
