import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Spin } from "antd";
import axios from "axios";
import { get, isEmpty } from "lodash";
import HistoryCards from "../../cards/HistoryCards";

function HistorTakeAwayOrder() {
  const { RangePicker } = DatePicker;
  const [takeAway, setTakeAway] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dayWiseData, setDayWiseData] = useState({}); // Store day-wise data in state

  const fetchData = async () => {
    try {
      setLoading(true);

      const take = await axios.get(`${process.env.REACT_APP_URL}/gettakeaway`);

      //   setOnlineOrder(get(onlineord, "data.data", []));
      setTakeAway(get(take, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  console.log("takeAway", takeAway);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const calculateDayWiseData = () => {
      const newData = {};
      takeAway.forEach((entry) => {
        const createdAtDate = new Date(entry.createdAt)
          .toISOString()
          .split("T")[0];
        newData[createdAtDate] = (newData[createdAtDate] || 0) + 1;
      });
      setDayWiseData(newData);
    };
    calculateDayWiseData();
  }, [takeAway]);

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = takeAway.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="pt-28 md:pl-[20vw]">
      <div className="w-[98vw] md:w-[78vw]">
        <Spin spinning={loading}>
          <div className=" w-full lg:w-1/2 m-auto">
            <h1 className="text-center text-[12px] lg:text-[16px] text-[--primary-color] font-bold">
              Last 5 Days Online Order
            </h1>
            <RangePicker
              style={{ marginBottom: "20px" }}
              format="YYYY-MM-DD"
              // onChange={handleDateChange}
              className="flex mt-1 items-center justify-center"
              size="large"
            />
            <div className="!bg-white p-4 rounded-lg ">
              {Object.entries(dayWiseData).map(([date, count]) => (
                <HistoryCards key={date} date={date} order={count} />
              ))}
            </div>
          </div>
          <div className="mt-4 mb-2">
            <Pagination
              current={currentPage}
              total={takeAway.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default HistorTakeAwayOrder;
