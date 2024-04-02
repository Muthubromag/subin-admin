import React, { useEffect, useState } from "react";
import { DatePicker, Modal, Pagination, Spin, Image } from "antd";
import axios from "axios";
import { get } from "lodash";
import HistoryCards from "../../cards/HistoryCards";
import { useSelector } from "react-redux";

function HistoryCallOrder() {
  const { RangePicker } = DatePicker;
  const [callforOrder, setCallForOrder] = useState([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const refresher = useSelector((state) => state.user.refreshData);
  const [previewData, setPreviewData] = useState(null);
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const call = await axios.get(`${process.env.REACT_APP_URL}/getcallorder`);
      setCallForOrder(get(call, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = callforOrder.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const closePreviewModal = () => {
    setPreviewData(null);
  };

  const calculateModalWidth = () => {
    const baseWidth = 400;
    const minWidth = 400;
    const maxWidth = 800;

    const dataCount = foodInformationList.length;
    const calculatedWidth = baseWidth + dataCount * 100;

    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  return (
    <div className="pt-28 md:pl-[20vw]">
      <div className="w-full  md:w-[78vw]">
        <Spin spinning={loading}>
          <div className=" w-full  m-auto">
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
            <div className=" p-4 rounded-lg flex flex-wrap lg:justify-between justify-center gap-5">
              {paginatedData.map((item, index) => {
                const dateTimeString = item.createdAt;

                // Split the date and time using the 'T' delimiter
                const [datePart] = dateTimeString.split("T");
                const date = datePart;

                const indianStandardTime = new Date(item.createdAt);
                const hours = indianStandardTime.getHours() % 12 || 12;
                const minutes = indianStandardTime.getMinutes();
                const ampm = indianStandardTime.getHours() >= 12 ? "PM" : "AM";

                const mobilePreviewModal = (orderedFood) => {
                  setPreviewData(!previewData);
                  console.log(orderedFood[0]?.foodName, "orderedFood");
                  setFoodInformationList(orderedFood);
                  setSelectedProduct(orderedFood);
                };
                return (
                  <HistoryCards
                    key={index}
                    id={index + 1}
                    date={date}
                    time={`${hours}:${
                      minutes < 10 ? "0" : ""
                    }${minutes} ${ampm}`}
                    order={item.orderId}
                    deliveryStatus={item.status}
                    itemPrice={item.billAmount}
                    preview={() => mobilePreviewModal(item?.orderedFood)}
                    paymentMode={item.payment_mode}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-4 mb-2">
            <Pagination
              current={currentPage}
              total={callforOrder.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
            />
          </div>
        </Spin>
      </div>
      <Modal
        open={!!previewData}
        onCancel={closePreviewModal}
        footer={null}
        closable={false}
        width={calculateModalWidth()}
      >
        <div>
          <h1 className="font-bold">Ordered Food Details</h1>
          <div className="flex flex-wrap gap-8">
            {foodInformationList?.map((res, i) => {
              console.log(res, "foodimfo");
              return (
                <div className="flex  gap-5 pt-5" key={i}>
                  <div>
                    <Image width={100} src={res.pic} key={i} />
                  </div>
                  <div>
                    <p className="text-black font-bold">
                      Food Name: {res?.foodName}
                    </p>

                    <p className="text-black font-bold">
                      Quantity: {res?.foodQuantity}
                    </p>
                    {/* <p className="text-black font-bold">
                      Type: {res?.orderType}
                    </p> */}
                    <p className="text-black font-bold">Type: {res?.type}</p>
                    {selectedProduct?.instructions?.[0]?.[res?.id]?.length ? (
                      <div key={res?.id} className="w-full flex">
                        <p className="text-black font-bold mr-2">
                          Instruction:{" "}
                        </p>
                        <ul>
                          {selectedProduct?.instructions?.[0]?.[res?.id]?.map(
                            (instructions, index) => {
                              return (
                                <li className="font-bold" key={index}>
                                  {" "}
                                  * {instructions}
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HistoryCallOrder;
