import React, { useEffect, useState } from "react";
import { DatePicker, Spin } from "antd";
import axios from "axios";
import { get, isEmpty } from "lodash";
import HistoryCards from "../../cards/HistoryCards";

function HistoryOnlineOrder() {
  const { RangePicker } = DatePicker;
  const [onlineOrder, setOnlineOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const onlineord = await axios.get(
        `${process.env.REACT_APP_URL}/getonlineorder`
      );

      setOnlineOrder(get(onlineord, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  console.log("onlineOrder", onlineOrder);

  useEffect(() => {
    fetchData();
  }, []);
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
              {onlineOrder.map((item) => {
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
              })}
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default HistoryOnlineOrder;
