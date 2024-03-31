import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Spin } from "antd";
import axios from "axios";
import { get } from "lodash";
import HistoryCards from "../../cards/HistoryCards";

function HistoryDinningOrder() {
  const { RangePicker } = DatePicker;
  const [dinning, setDinning] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dayWiseData, setDayWiseData] = useState({}); // Store day-wise data in state

  const fetchData = async () => {
    try {
      setLoading(true);

      // const call = await axios.get(`${process.env.REACT_APP_URL}/getcallorder`);
      const dinningord = await axios.get(
        `${process.env.REACT_APP_URL}/getdinningorder`
      );

      setDinning(get(dinningord, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  console.log("onlineOrder", dinning);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const calculateDayWiseData = () => {
      const newData = {};
      dinning.forEach((entry) => {
        const createdAtDate = new Date(entry.createdAt)
          .toISOString()
          .split("T")[0];
        newData[createdAtDate] = (newData[createdAtDate] || 0) + 1;
      });
      setDayWiseData(newData);
    };
    calculateDayWiseData();
  }, [dinning]);

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dinning.slice(startIndex, endIndex);

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
              {/* {paginatedData.map((item) => {
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

                function countOccurrences(data, dateToCount) {
                  var count = 1;
                  for (var i = 0; i < data.length; i++) {
                    if (data[i].date === dateToCount) {
                      count++;
                    }
                  }
                  return count;
                }

                // Date to count occurrences for
                var dateToCount = date;
                console.log(dateToCount, "dateToCount");
                // Count occurrences of the specified date
                var occurrences = countOccurrences(item, dateToCount);
                console.log(occurrences, "occurrences");

                return <HistoryCards date={date} order={occurrences} />;
              })} */}
              {Object.entries(dayWiseData).map(([date, count]) => (
                <HistoryCards key={date} date={date} order={count} />
              ))}
            </div>
          </div>
          <div className="mt-4 mb-2">
            <Pagination
              current={currentPage}
              total={dinning.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default HistoryDinningOrder;
