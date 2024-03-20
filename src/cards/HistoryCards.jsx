import React, { useState, useEffect } from "react";

function HistoryCards() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    // Set isVisible to true after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg">
      {HistoryOrder.map((item) => {
        const order = item.order;
        return (
          <div
            div
            className="border-[#ED7802] border-2 flex flex-col p-2 mt-2 rounded-lg"
          >
            <div className="">{item.date}</div>
            <div className="bg-[#EDEDED]  rounded-full transition-all duration-500 ease-out md:ease-in">
              <div
                className={`bg-[#ED7802] rounded-full p-2 text-white transition-transform duration-500 transform ${
                  isVisible ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ width: `${order}%` }}
              >
                {order}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HistoryCards;

const HistoryOrder = [
  {
    date: "01/02/2024",
    order: 84,
  },
  {
    date: "01/02/2024",
    order: 14,
  },
  {
    date: "01/02/2024",
    order: 54,
  },
  {
    date: "01/02/2024",
    order: 64,
  },
  {
    date: "01/02/2024",
    order: 34,
  },
];
