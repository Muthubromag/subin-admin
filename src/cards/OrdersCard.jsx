import { Image, Select, Switch } from "antd";
import React from "react";

export const OrdersCard = ({
  id,
  date,
  time,
  orderId,
  bookingID,
  tableNo,
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
          {bookingID && (
            <div className="text-[#828282] font-medium">
              Booking Id :{" "}
              <span className="font-bold text-black">{bookingID}</span>{" "}
            </div>
          )}
          {tableNo && (
            <div className="text-[#828282] font-medium">
              Table No : <span className="font-bold text-black">{tableNo}</span>{" "}
            </div>
          )}
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

export const MenuManageCards = ({
  id,
  name,
  price,
  offer,
  foodimg,
  status,
  switchChange,
  discountPrice,
}) => {
  return (
    <div className="flex mt-8 flex-col ">
      <div className="bg-white w-96 m-auto rounded-lg">
        <div className="flex bg-blue-400 rounded-t-lg justify-between  p-4 ">
          <div>S.No: {id}</div>
          <div>{name}</div>
        </div>
        <div className="p-4 flex  flex-col space-y-3">
          <div className="flex items-center space-x-2 justify-between">
            <div className="img-crd w-32">
              <Image
                alt="food_img"
                className=" w-32 rounded-md h-28 border-2 border-[#CD5C08]  "
                src={foodimg}
              />
            </div>
            <div className="flex flex-col">
              <div
                className={`${
                  offer ? "font-bold text-black" : " text-[#828282] font-medium"
                }`}
              >
                {name}
              </div>
              {price && (
                <div className="text-[#828282] text-sm">
                  Price :{" "}
                  <span className="font-normal text-black"> ₹ {price}</span>{" "}
                </div>
              )}
              {offer && (
                <div className="text-[#828282] text-sm">
                  offer :{" "}
                  <span className="font-normal text-black">{offer}%</span>{" "}
                </div>
              )}
              {discountPrice && (
                <div className="text-[#828282]  text-sm">
                  discountPrice :{" "}
                  <span className="font-normal text-black">
                    {" "}
                    ₹ {discountPrice}
                  </span>{" "}
                </div>
              )}
            </div>

            <Switch
              className="text-md"
              checked={status}
              onChange={switchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const FeedBackCard = ({
  id,
  date,
  time,
  name,
  mobile,
  rating,
  message,
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
            Name : <span className="font-bold text-black">{name}</span>{" "}
          </div>

          <div className="text-[#828282] font-medium">
            Mobile Number :{" "}
            <span className="font-bold text-black">{mobile}</span>{" "}
          </div>

          <div className="text-[#828282] font-medium">
            Ratings : <span className="font-bold text-black">{rating}</span>{" "}
          </div>

          <div className="  p-2 bg-[#E1EAFB] rounded-md">
            <div className="text-[#305087] font-medium ">Message</div>
            <p className="text-[10px] text-[#404040]">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotificationCard = ({
  confirmed,
  time,
  orderId,
  orderStatus,
  date,
  res,
  className,
}) => {
  return (
    <div className="bg-white flex space-y-2 flex-col p-2 rounded-md w-[350px]">
      <div className="flex justify-between">
        <h1 className={className}>{confirmed}</h1>
        <p>{time}</p>
      </div>
      <div className="text-[#828282] font-medium">
        Order Id : <span className="font-bold text-black">{orderId}</span>{" "}
      </div>
      <div className="text-[#828282] font-medium">{orderStatus}</div>
      <div className="flex justify-end">{date}</div>
    </div>
  );
};
