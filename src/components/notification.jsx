import React, { useEffect, useState } from "react";
import { get } from "lodash";
import axios from "axios";
import moment from "moment";
import { Spin } from "antd";
import { useLocation } from "react-router-dom";
import { NotificationCard } from "../cards/OrdersCard";

function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  let pathname = location?.pathname;

  const fetchData = async () => {
    try {
      setLoading(true);
      let filter =
        pathname === "/conotifications"
          ? "Call for order"
          : pathname === "/takeawaynotifications"
          ? "Takeaway order"
          : "Online order";
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getnotification?filter=${filter}`
      );
      setData(get(result, "data.data", []));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pathname]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="">
      <div className="hidden lg:inline">
        <div className="  pt-28 pl-[20vw]  md:pl-[28vw] w-[80vw] text-black flex items-center justify-center">
          <Spin spinning={loading}>
            {data.map((res, i) => {
              const headingStyle = {
                color: getRandomColor(),
              };
              return (
                <div
                  key={i}
                  className="w-[95vw] md:w-[70vw] bg-black mt-2 text-white py-4 px-3 rounded-md text-[10px] sm:text-[12px] md:text-[15px] flex justify-between"
                >
                  <div>
                    <h1
                      style={headingStyle}
                      className="font-bold text-[12px] sm:text-[14px] md:text-[18px]"
                    >
                      {res.heading}
                    </h1>
                    <p>{res.status}</p>
                  </div>
                  <div>
                    <p
                      className={`${
                        res.field === "Online order"
                          ? "text-red-500"
                          : res.field === "Dinning order"
                          ? "text-green-500"
                          : res.field === "Call for order"
                          ? "text-blue-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {res.field}
                    </p>
                    <h1>
                      {moment(res.createdAt).format("DD-MM-YYYY, h:mm:ss a")}
                    </h1>
                  </div>
                </div>
              );
            })}
          </Spin>
        </div>
      </div>
      <div className="inline lg:hidden">
        <Spin spinning={loading}>
          <div className=" mt-24 ">
            {data.map((item, index) => {
              // console.log("item", item);
              const dateTimeString = item.createdAt;

              // Split the date and time using the 'T' delimiter
              const [datePart] = dateTimeString.split("T");
              const date = datePart;

              const indianStandardTime = new Date(item.createdAt);

              indianStandardTime.setUTCHours(
                indianStandardTime.getUTCHours() + 5
              ); // IST is UTC+5:30
              indianStandardTime.setUTCMinutes(
                indianStandardTime.getUTCMinutes() + 30
              );

              // Extract hours, minutes, and seconds
              let hours = indianStandardTime.getHours();
              const minutes = indianStandardTime.getMinutes();

              // Convert hours to 12-hour format
              let period = "AM";
              if (hours >= 12) {
                period = "PM";
              }
              hours = hours % 12 || 12;

              hours = hours < 10 ? "0" + hours : hours;
              const formattedTime = `${hours}:${
                minutes < 10 ? "0" + minutes : minutes
              }`;
              return (
                <div className="shadow-2xl p-3 ">
                  <NotificationCard
                    confirmed={item.heading}
                    date={date}
                    time={`${formattedTime}`}
                    orderId={
                      item.status.length > 24
                        ? item.status.slice(0, 24)
                        : item.status
                    }
                    // res={item.field}
                    className={` font-bold ${
                      item.heading === "Cancelled"
                        ? "text-[#FF4F4F]"
                        : item.heading === "Order moved to KDS"
                        ? "text-[#3365C6]"
                        : item.heading === "Order accepted"
                        ? "text-[#3FB408]"
                        : item.heading === "Order ready to pick"
                        ? "text-[#390cffd7]"
                        : "text-[#FF9E0C]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default Notification;
