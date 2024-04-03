/* eslint-disable no-unused-vars */
import {
  Modal,
  Upload,
  Form,
  Input,
  Button,
  notification,
  Table,
  Select,
  Spin,
  Collapse,
  Image,
  Pagination,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  FileAddOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";

import { useSelector } from "react-redux";

import moment from "moment";
import { generateTimeSlots } from "../../utils/util";
import BookingOrderCard from "../../cards/bookingOrderCard";

const { Option } = Select;
function BookingOrder() {
  const refresher = useSelector((state) => state.user.refreshData);
  const slotsOptions = generateTimeSlots({ interval: 2 });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  // const [tabledata, setTableData] = useState([]);
  const [tableBookingData, setTableBookingData] = useState([]);
  const { Panel } = Collapse;
  const user = useSelector((state) => state.user.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [dinning, setDinning] = useState([]);
  const [FoodModal, setFoodModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageKey, setImageKey] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const result1 = await axios.get(
        `${process.env.REACT_APP_URL}/getbooking`
      );
      const result3 = await axios.get(
        `${process.env.REACT_APP_URL}/getdinningorder`
      );
      setDinning(get(result3, "data.data"));

      setTableBookingData(get(result1, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (refresher?.order === "Dining") {
      fetchData(false);
    }
  }, [refresher]);

  const handleFinish = async (value) => {
    try {
      console.log(value);
      const timeSlots = value?.timeSlots?.toString();
      console.log(timeSlots, value);

      setLoadingButton(true);
      const data = new FormData();
      if (updateId) {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj") || null
        );
        data.append("image", imageUrl);
      } else {
        data.append("file", get(value, "img.fileList[0].originFileObj"));
      }
      data.append("tableNo", get(value, "tableNo", ""));
      data.append("seatsAvailable", get(value, "seatsAvailable", ""));
      data.append("timeSlots", timeSlots?.toString());
      const url = updateId
        ? `${process.env.REACT_APP_URL}/updatetable/${updateId}`
        : `${process.env.REACT_APP_URL}/createtable`;

      const method = updateId ? axios.put : axios.post;

      await method(url, data);

      const successMessage = updateId
        ? "Table updated successfully"
        : "Table created successfully";

      notification.success({ message: successMessage });
      setUpdateId("");
      form.resetFields();
      fetchData();
      setImageUrl("");
      setOpen(!open);
      setFileList([]);
    } catch (e) {
      notification.error({ message: "Something went wrong" });
    } finally {
      setLoadingButton(false);
    }
  };

  const handleChangeStatus = async (current, all) => {
    try {
      const formData = {
        booking: current,
      };

      const formData2 = {
        status: true,
      };
      const formData3 = {
        status: false,
      };

      // if (current === "Checkout" || current === "Cancelled") {
      //   await axios.put(
      //     `${process.env.REACT_APP_URL}/updatetable/${all.tableId}`,
      //     formData3
      //   );
      // } else if (current === "CheckIn") {
      //   await axios.put(
      //     `${process.env.REACT_APP_URL}/updatetable/${all.tableId}`,
      //     formData2
      //   );
      // }

      await axios.put(
        `${process.env.REACT_APP_URL}/updatebooking/${all._id}`,
        formData
      );

      notification.success({ message: "booking updated successfully" });
      fetchData();
    } catch (err) {
      notification.error({ message: "something went wrong" });
    }
  };

  const handleOpenFoods = async (id) => {
    setFoodInformationList(
      dinning.filter((res) => {
        return res.bookingId === id;
      })
    );
    setFoodModal(!FoodModal);
  };

  const columns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return <h1 className="text-md">{(currentPage - 1) * 5 + index + 1}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Table No</h1>,
      dataIndex: "tableNo",
      key: "tableNo",
      align: "center",
      render: (name) => {
        return <h1 className="text-md">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Dining Id</h1>,
      dataIndex: "diningID",
      key: "diningID",
      align: "center",
      render: (name, record) => {
        return (
          <p
            className="text-md cursor-pointer"
            onClick={() => handleOpenFoods(record._id)}
          >
            {name}
          </p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Customer Name</h1>,
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      render: (name) => {
        return <h1 className="text-md">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Contact Number</h1>,
      dataIndex: "contactNumber",
      key: "contactNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-md">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "bookingDate",
      key: "bookingDate",
      align: "center",
      render: (time) => {
        return <h1 className="text-md">{moment(time).format("DD-MM-YYYY")}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Slot</h1>,
      dataIndex: "diningTime",
      key: "diningTime",
      align: "center",
      render: (time) => {
        return <h1 className="text-md">{time}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "booking",
      key: "booking",
      align: "center",
      render: (data, allData) => {
        const createdAtTime = new Date(allData.createdAt);
        const currentTime = new Date();
        const timeDifferenceInMinutes = Math.floor(
          (currentTime - createdAtTime) / (1000 * 60)
        );

        return data === "Checkout" ? (
          <Button className="w-[10vw] !bg-green-500 text-white">
            Checkout
          </Button>
        ) : data === "Cancelled" ? (
          <Button className="w-[10vw] !bg-red-500 text-white">Cancel</Button>
        ) : (
          // timeDifferenceInMinutes > 30 ? (
          //   <Select
          //     className="w-[10vw]"
          //     onChange={(e) => handleChangeStatus(e, allData)}
          //     defaultValue={data}
          //   >
          //     <Select.Option value="CheckIn">Checkin</Select.Option>
          //     <Select.Option value="Checkout">Checkout</Select.Option>
          //     {/* <Select.Option value="Cancelled">Cancel</Select.Option> */}
          //   </Select>
          // ) :
          <Select
            className="w-[10vw]"
            defaultValue={data}
            onChange={(e) => handleChangeStatus(e, allData)}
          >
            <Select.Option value="CheckIn">Checkin</Select.Option>
            <Select.Option value="Checkout">Checkout</Select.Option>
            {/* <Select.Option value="Cancelled">Cancel</Select.Option> */}
          </Select>
        );
      },
    },
  ];

  const calculateFoodModalWidth = () => {
    const baseWidth = 600;
    const minWidth = 600;
    const maxWidth = 1200;

    const foodCount = foodInformationList.reduce(
      (sum, res) => sum + res.orderedFood.length,
      0
    );

    const calculatedWidth = baseWidth + foodCount * 100;
    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  const columnsOperations = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return <h1 className="text-md">{index + 1}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Table No</h1>,
      dataIndex: "tableNo",
      key: "tableNo",
      align: "center",
      render: (name) => {
        return <h1 className="text-md">{name}</h1>;
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Dining Id</h1>,
      dataIndex: "diningID",
      key: "diningID",
      align: "center",
      render: (name, record) => {
        return (
          <p
            className="text-md cursor-pointer"
            onClick={() => handleOpenFoods(record._id)}
          >
            {name}
          </p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "bookingDate",
      key: "bookingDate",
      align: "center",
      render: (time) => {
        return <h1 className="text-md">{moment(time).format("DD-MM-YYYY")}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Slot</h1>,
      dataIndex: "diningTime",
      key: "diningTime",
      align: "center",
      render: (time) => {
        return <h1 className="text-md">{time}</h1>;
      },
    },

    // {
    //   title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   align: "center",
    //   render: (updateAt) => {
    //     const formattedDateTime = new Date(updateAt).toLocaleString(undefined, {
    //       day: "numeric",
    //       month: "short",
    //       year: "numeric",
    //       hour: "numeric",
    //       minute: "numeric",
    //       second: "numeric",
    //       hour12: true,
    //     });
    //     return <h1 className="text-md">{formattedDateTime}</h1>;
    //   },
    // },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "booking",
      key: "booking",
      align: "center",
      render: (data, allData) => {
        const createdAtTime = new Date(allData.createdAt);
        const currentTime = new Date();
        const timeDifferenceInMinutes = Math.floor(
          (currentTime - createdAtTime) / (1000 * 60)
        );

        return data === "Checkout" ? (
          <Button className="w-[10vw] !bg-green-500 text-white">
            Checkout
          </Button>
        ) : data === "Cancelled" ? (
          <Button className="w-[10vw] !bg-red-500 text-white">Cancel</Button>
        ) : (
          // timeDifferenceInMinutes > 30 ? (
          //   <Select
          //     className="w-[10vw]"
          //     onChange={(e) => handleChangeStatus(e, allData)}
          //     defaultValue={data}
          //   >
          //     <Select.Option value="CheckIn">Checkin</Select.Option>
          //     <Select.Option value="Checkout">Checkout</Select.Option>
          //     <Select.Option value="Cancelled">Cancel</Select.Option>
          //   </Select>
          // ) :
          <Select
            className="w-[10vw]"
            defaultValue={data}
            onChange={(e) => handleChangeStatus(e, allData)}
          >
            <Select.Option value="CheckIn">Checkin</Select.Option>
            <Select.Option value="Checkout">Checkout</Select.Option>
            {/* <Select.Option value="Cancelled">Cancel</Select.Option> */}
          </Select>
        );
      },
    },
  ];

  const checkinData = tableBookingData.filter(
    (item) => item.booking === "CheckIn"
  );

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tableBookingData.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-28 md:pl-[20vw] ">
      <div className="w-[96vw].md:w-[85vw]">
        <div className="w-[90vw] md:w-[80vw] h-[80vh] hidden lg:inline">
          <Collapse
            defaultActiveKey={["1"]}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined
                rotate={isActive ? 90 : 0}
                className="!text-[#CD5C08]"
              />
            )}
            collapsible="icon"
            className="w-[90vw] md:!w-[78vw] !h-[80vh]"
          >
            <Panel
              header={
                <h1 className="text-md text-[#CD5C08] font-semibold">Table</h1>
              }
              extra={
                <div
                  className={`cursor-pointer ${
                    get(user, "name", "").split("@").includes("frontdesk") ||
                    get(user, "name", "").split("@").includes("partner")
                      ? "hidden"
                      : "inline"
                  }
              `}
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  <FileAddOutlined className="!text-[#CD5C08] !text-xl" />
                </div>
              }
              key="1"
              className="h-[80vh] overflow-y-scroll"
            >
              <Spin spinning={loading}>
                <div className="!h-[68vh]">
                  <div className="pt-8 w-[90vw] md:w-[75vw]">
                    <Table
                      dataSource={tableBookingData}
                      columns={
                        get(user, "name", "")
                          ?.split("@")
                          ?.includes("frontdesk") ||
                        get(user, "name", "")?.split("@")?.includes("partner")
                          ? columnsOperations
                          : columns
                      }
                      pagination={{
                        pageSize: 5,
                        current: currentPage,
                        onChange: (page) => {
                          setCurrentPage(page);
                        },
                      }}
                      scroll={{ x: 800 }}
                      className="overflow-x-scroll"
                    />
                  </div>
                </div>
              </Spin>
            </Panel>
          </Collapse>
        </div>
        <div className="inline lg:hidden">
          <Spin spinning={loading}>
            <>
              {paginatedData.map((item, index) => {
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

                return (
                  <BookingOrderCard
                    id={index + 1}
                    date={date}
                    tableNo={item.tableNo}
                    diningId={item.diningID}
                    slot={item.diningTime}
                    allData={item}
                    data={item.booking}
                    handleChangeStatus={(e) => handleChangeStatus(e, item)}
                  />
                );
              })}
              <div className="mt-4 mb-2">
                <Pagination
                  current={currentPage}
                  total={tableBookingData.length}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          </Spin>
        </div>
      </div>
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => {
          setOpen(!open);
          form.resetFields();
          setFileList([]);
          setUpdateId("");
        }}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            name="tableNo"
            label="Table No"
            rules={[{ required: true, message: "Enter table no" }]}
          >
            <Input type="text" placeholder="Enter table no..." size="large" />
          </Form.Item>
          <Form.Item
            name="seatsAvailable"
            label="seats Availbale"
            rules={[{ required: true, message: "Enter seats" }]}
          >
            <Input
              type="text"
              placeholder="Enter seats available..."
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="img"
            rules={[
              {
                required: updateId === "" ? true : false,
                message: "Select table image",
              },
            ]}
          >
            <Upload
              onChange={handleChange}
              fileList={fileList}
              onPreview={(e) => {}}
              maxCount={1}
              listType="picture-card"
              multiple={false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Select TimeSlots"
            name="timeSlots"
            rules={[{ required: true, message: "Please select your slots!" }]}
          >
            <Select mode="multiple" placeholder="Select slots">
              {slotsOptions?.map((td, i) => {
                return <Option value={td?.time}>{td?.time}</Option>;
              })}

              {/* Add more Option components for additional interests */}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();
                  setImageUrl("");
                  setFileList([]);
                  setUpdateId("");
                }}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                loading={loadingButton}
                className="bg-green-500 text-white"
              >
                {updateId !== "" ? "Update" : "Save"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={FoodModal}
        footer={false}
        closeIcon={false}
        onCancel={() => {
          setFoodModal(!FoodModal);
        }}
        width={calculateFoodModalWidth()}
      >
        <div>
          <h1 className="font-bold">Ordered Food Details</h1>
          {foodInformationList.map((res, i) => {
            return (
              <div>
                <h1 className="pt-10 font-bold text-md">KOT:{i + 1}</h1>
                <div key={i} className="flex flex-wrap justify-between pt-4">
                  {res.orderedFood.map((data, j) => {
                    return (
                      <div className="flex gap-5" key={j}>
                        <div>
                          <Image width={100} src={data.pic} preview={false} />
                        </div>
                        <div>
                          <p>Food Name: {data.foodName}</p>
                          <p>Price: {data.foodPrice}</p>
                          <p>Quantity: {data.foodQuantity}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-5 lg:pt-2">
                    <p>Order GST: {res.gst}</p>
                    <p>Bill Amount: {res.billAmount}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex items-end justify-end pt-2 font-bold">
            <p>
              Total Bill Amount:{" "}
              {foodInformationList.reduce(
                (sum, res) => sum + res.billAmount,
                0
              )}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BookingOrder;
