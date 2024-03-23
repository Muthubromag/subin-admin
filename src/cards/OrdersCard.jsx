import { Button, Image, Select, Switch } from "antd";
import React from "react";
import { get, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  Inventory,
  printBill,
  handleStatusChange,
  statusOptionsList,
  orderstatus,
}) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const getNextStatusOptionsPartner = (currentStatus) => {
    // const statusOptions = [
    //   "Order accepted",
    //   "Order moved to KDS",
    //   "Order ready to preparing",
    //   "Order ready to pack",
    //   "Order ready to pick",
    // ];
    const statusOptions = statusOptionsList;

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const nextStatusOptions = getNextStatusOptionsPartner(deliveryStatus);
  const isDelivered = deliveryStatus === "Delivered";
  const isCancelled = deliveryStatus === "Cancelled";
  const isMovedToKDS = deliveryStatus === "Order moved to KDS";
  const isAfterKds =
    deliveryStatus === "Order ready to pick" ||
    deliveryStatus === "Order out for delivery" ||
    deliveryStatus === "Order reached nearest to you";

  return (
    <div className="flex mt-8 flex-col ">
      <div className="bg-white w-96 m-auto rounded-lg">
        <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
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

          {billAmount && !get(user, "name", "")?.split("@")?.includes("kds") ? (
            <div className="text-[#828282] font-medium">
              Bill Amount:
              <span className="font-bold text-black"> ₹ {billAmount}</span>{" "}
            </div>
          ) : null}

          {orderstatus && (
            <div className="text-[#828282] font-medium">
              Delivery Status :{" "}
              <span className="font-bold text-black">{orderstatus}</span>{" "}
            </div>
          )}
          {get(user, "name", "")?.split("@")?.includes("kds") && Inventory && (
            <div className="text-[#828282] font-medium">
              Inventory:{" "}
              <span className="font-bold text-black">{Inventory}</span>{" "}
            </div>
          )}
          {location && (
            <div className="text-[#828282] font-medium">
              location :{" "}
              <span className="font-bold text-black">{location}</span>{" "}
            </div>
          )}
          {deliveryStatus && (
            <div className="text-[#828282] font-medium">
              Status :{" "}
              <span className="font-bold text-black">{deliveryStatus}</span>{" "}
            </div>
          )}
          <div className="flex justify-between ">
            <div className="bg-[#575757] rounded-md flex  items-center pl-2 space-x-1">
              <div className="text-[#fff] text-[10px]">Status</div>
              <div className="w-full mobile-selector">
                {!isCancelled && !isDelivered && (
                  <Select
                    value={isMovedToKDS ? "Order received" : deliveryStatus}
                    onChange={handleStatusChange}
                    className="w-[100%]"
                    id="status"
                  >
                    {!isAfterKds &&
                      nextStatusOptions?.map((option, i) => (
                        <Select.Option key={i} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                  </Select>
                )}

                {isCancelled ? (
                  <Button className="bg-red-500 text-white border-none w-[100%]">
                    Cancelled
                  </Button>
                ) : isDelivered ? (
                  <Button className="bg-green-500 text-white border-none w-[100%]">
                    Delivered
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>

            {get(user, "name", "")?.split("@")?.includes("kds") ? null : (
              <div>
                <button
                  className="bg-[#ED7802] text-black  w-full rounded-lg p-2  !text-[12px]"
                  onClick={() => {
                    navigate(`/printer/${printBill}/online`);
                  }}
                >
                  Print Bill
                </button>
              </div>
            )}

            <div className="">
              <button
                className=" bg-[#222222] text-white rounded-lg p-2  !text-[10px]"
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
}) =>
  // get(user, "name", "")?.split("@")?.includes("kds")
  // ? kdsColumns
  // : get(user, "name", "")
  //     ?.split("@")
  //     ?.includes("frontdesk") ||
  //   get(user, "name", "")
  //     ?.split("@")
  //     ?.includes("partner")
  // ? columnsOperation
  // : columns

  {
    return (
      <div className="flex mt-8 flex-col p-2 w-96 ">
        <div className="bg-white w-full m-auto rounded-lg">
          <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
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
                    offer
                      ? "font-bold text-black"
                      : " text-[#828282] font-medium"
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
    <div className="flex mt-8 flex-col  p-4">
      <div className="bg-white w-full m-auto rounded-lg ">
        <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
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
    <div className="bg-white flex space-y-2 flex-col p-2 rounded-md w-96 m-auto">
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

export const InventerCard = ({
  id,
  name,
  date,
  foodimg,
  category,
  provided,
  consumed,
  available,
}) => {
  return (
    <div className="flex mt-8 flex-col p-2 w-96 ">
      <div className="bg-white w-full m-auto rounded-lg">
        <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
          <div>S.No: {id}</div>

          {/* <div>{date}</div> */}
        </div>
        <div className="p-4 flex  flex-col space-y-3">
          <div className="flex items-center space-x-2 justify-between">
            <div className="flex flex-col">
              <div className="text-[#828282] font-medium text-md">
                Name : <span className="font-bold text-black ">{name}</span>{" "}
              </div>
              <div className="text-[#828282] font-medium text-md">
                Category :{" "}
                <span className="font-bold text-black ">{category}</span>{" "}
              </div>
            </div>
            <div className="img-crd w-32 flex justify-end ">
              <Image
                alt="food_img"
                className=" w-32 rounded-md h-28 border-2 border-[#CD5C08]  "
                src={foodimg}
              />
            </div>
          </div>
          <div className="flex border-dashed border-2 justify-between p-4">
            <div className="text-[#5895FF] font-bold  ">
              Provided : <span className="">{provided}</span>{" "}
            </div>
            <div className="text-[#FF4F4F] font-bold  ">
              Consumed : <span className="">{consumed}</span>{" "}
            </div>
            <div className="text-[#3FB408] font-bold  ">
              Available : <span className="">{available}</span>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
