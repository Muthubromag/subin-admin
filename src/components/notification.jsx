import React, { useEffect, useState } from "react";
import { get } from "lodash";
import axios from "axios";
import moment from "moment";
import { Badge, Button, Pagination, Spin } from "antd";
import { useLocation } from "react-router-dom";
import { NotificationCard } from "../cards/OrdersCard";

function Notification() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  let pathname = location?.pathname;
  const [currentPage, setCurrentPage] = useState(1);
  const [statusName, setStatusName] = useState("");

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

  console.log("data", data);

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
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const statusOrder = data.filter((item) => item.heading === statusName);
  console.log("statusOrder", statusOrder);

  return (
    <div className="w-full">
      <div className=" w-full lg:pt-28 pt-36 lg:pl-[20vw] p-4  text-black flex items-center justify-center">
        <Spin spinning={loading}>
          {statusName === "" ? (
            <div className="flex justify-between flex-wrap lg:flex-row gap-5 ">
              <Badge
                count={
                  data.filter((item) => item.heading === "Order accepted")
                    .length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full text-center lg:w-36 h-20 flex  "
                  onClick={() => setStatusName("Order accepted")}
                >
                  Order accepted
                </div>
              </Badge>
              <Badge
                count={
                  data.filter((item) => item.heading === "Order moved to KDS")
                    .length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full text-center lg:w-36 h-20 flex  "
                  onClick={() => setStatusName("Order moved to KDS")}
                >
                  Order moved to KDS
                </div>
              </Badge>
              <Badge
                count={
                  data.filter((item) => item.heading === "Order ready to pack")
                    .length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full lg:w-36 h-20 flex  text-center "
                  onClick={() => setStatusName("Order ready to pack")}
                >
                  Order ready to pack
                </div>
              </Badge>
              <Badge
                count={
                  data.filter((item) => item.heading === "Order ready to pick")
                    .length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full lg:w-36 h-20 flex  text-center"
                  onClick={() => setStatusName("Order ready to pick")}
                >
                  Order ready to pick
                </div>
              </Badge>
              <Badge
                count={
                  data.filter(
                    (item) => item.heading === "Order out for delivery"
                  ).length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full lg:w-36 h-20 flex  text-center"
                  onClick={() => setStatusName("Order out for delivery")}
                >
                  Order out for delivery
                </div>
              </Badge>
              <Badge
                count={
                  data.filter((item) => item.heading === "Delivered").length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full lg:w-36 h-20 flex  text-center"
                  onClick={() => setStatusName("Delivered")}
                >
                  Delivered
                </div>
              </Badge>
              <Badge
                count={
                  data.filter((item) => item.heading === "Cancelled").length
                }
              >
                <div
                  className="border-2 border-red-400 text-white p-4 rounded-lg w-full lg:w-36 h-20 flex  text-center"
                  onClick={() => setStatusName("Cancelled")}
                >
                  Cancelled
                </div>
              </Badge>
            </div>
          ) : (
            <div className="">
              <Button
                onClick={() => setStatusName("")}
                className=" text-white mb-4"
              >
                Back
              </Button>
              <div className="text-white">
                {statusOrder.map((res, i) => {
                  return (
                    <div
                      key={i}
                      className="w-[95vw] md:w-[70vw] bg-white mt-2 text-black py-4 px-3 rounded-md text-[10px] sm:text-[12px] md:text-[15px] flex justify-between"
                    >
                      <div>
                        <h1 className="font-bold text-[12px] sm:text-[14px] md:text-[18px]">
                          {res.heading}
                        </h1>
                        <p>{res.status}</p>
                      </div>
                      <div>
                        <p>{res.field}</p>
                        <h1>
                          {moment(res.createdAt).format(
                            "DD-MM-YYYY, h:mm:ss a"
                          )}
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                current={currentPage}
                total={data.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
}

export default Notification;
