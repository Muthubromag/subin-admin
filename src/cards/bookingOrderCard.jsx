import { Select } from "antd";
import React from "react";

function BookingOrderCard({ id, date, tableNo, diningId, slot }) {
  return (
    <div className="flex mt-8 flex-col p-4 ">
      <div className="bg-white w-96 m-auto rounded-lg">
        <div className="flex bg-[#ED7802] rounded-t-lg justify-between  p-4 ">
          <div>S.No: {id}</div>
          <div>{date}</div>
        </div>

        <div className="p-4 flex  flex-col space-y-3">
          <div className="text-[#828282] font-medium">
            Table No : <span className="font-bold text-black">{tableNo}</span>{" "}
          </div>
          <div className="text-[#828282] font-medium">
            Dining Id : <span className="font-bold text-black">{diningId}</span>{" "}
          </div>

          <div className="text-[#828282] font-medium">
            Slot : <span className="font-bold text-black">{slot}</span>{" "}
          </div>
        </div>
        <div className=" rounded-md flex w-44 items-end p-4 space-x-1">
          <div className="w-full mobile-selector">
            <Select
              // value={isMovedToKDS ? "Order received" : status}
              // onChange={(newStatus) =>
              //   handleStatusChange(record, newStatus)
              // }

              className="w-[100%] !text-sm text-black !border-0"
              clearBg="red"
              defaultValue="Booked"
              id="status"
              options={[
                { value: "Checkout", label: "Checkout" },
                { value: "cancel", label: "cancel" },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingOrderCard;
