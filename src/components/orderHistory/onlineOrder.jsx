import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
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
    <div className="mt-28 pl-[20vw] !w-full m-auto">
      <div className="w-full m-auto">
        <h1 className="text-center text-[12px] lg:text-[16px] text-[--primary-color] font-bold">
          Last 5 Days Online Order
        </h1>
        <RangePicker
          style={{ marginBottom: "20px" }}
          format="YYYY-MM-DD"
          // onChange={handleDateChange}
          className="flex mt-1 items-center justify-center w-[600px]"
          size="large"
        />
        <HistoryCards />
      </div>
    </div>
  );
}

export default HistoryOnlineOrder;
