import React, { useEffect, useState } from "react";
import {
  Button,
  Select,
  Form,
  Table,
  notification,
  Modal,
  Spin,
  Space,
  Image,
  Pagination,
} from "antd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { get, isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { OrdersCard } from "../cards/OrdersCard";
import { playSound, stopSound } from "../utils/util";

function TakeAway() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const user = useSelector((state) => state.user.user);
  const [kdsOrders, setKdsOrders] = useState([]);
  const refresher = useSelector((state) => state.user.refreshData);
  const [timeSlot, setTimeSlot] = useState("");
  const [timeOrders, setTimeOrders] = useState("");
  const [foodInformationList, setFoodInformationList] = useState([]);
  const [getInventory, setGetInventory] = useState([]);
  const [openInventory, setOpenInventory] = useState(false);
  const [form] = Form.useForm();
  const [inventortUpdateId, setInventoryUpdateId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [updateIdForConsumed, setUpdateIdForConsumed] = useState("");
  const [selectedProduct, setSelectedProduct] = useState({});
  const [quantity, setQuantity] = useState("");
  const [filteredInventoryCategory, setFilteredInventoryCategory] = useState(
    []
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeForm] = Form.useForm();
  const navigate = useNavigate();

  const fetchData = async (load = true) => {
    try {
      setLoading(load);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/gettakeaway`
      );
      console.log(result, " iam amama");
      setData(get(result, "data.data", []));

      const inventory = await axios.get(
        `${process.env.REACT_APP_URL}/getinventory`
      );

      setGetInventory(get(inventory, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   // Check for orders with status "received" and play sound
  //   const ordersToCheck = data.filter(
  //     (order) => order.status === "Order placed"
  //   );
  //   if (ordersToCheck.length > 0) {
  //     playSound();
  //   } else {
  //     stopSound();
  //   }
  // }, [data]);
  useEffect(() => {
    if (refresher?.order === "takeaway") {
      fetchData(false);
    }
  }, [refresher]);

  useEffect(() => {
    setKdsOrders(
      data.filter((res) => {
        return res.status !== "Order accepted" && res.status !== "Order placed";
      })
    );
  }, [data]);

  const handleTimeSlot = async (val) => {
    try {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;
      const formData = {
        timePicked: val,
        status: "Order ready to preparing",
        startTime: formattedTime,
        preparingStart: moment().format("YYYY-MM-DD HH:mm:ss"),
        preparingEnd: moment()
          .add(val, "seconds")
          .format("YYYY-MM-DD HH:mm:ss"),
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/updatetakeaway/${timeOrders._id}`,
        formData
      );
      const formData2 = {
        heading: "Order ready to preparing",
        field: "Takeaway order",
        status: `${timeOrders.orderId}'S  Order ready to preparing`,
      };
      await axios.post(
        `${process.env.REACT_APP_URL}/createnotification`,
        formData2
      );

      notification.success({ message: "order status updated successfully" });
      fetchData();
      setTimeSlot(!timeSlot);
      timeForm.resetFields();
    } catch (e) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const handleStatusChange = async (Id, Status) => {
    console.log(Id, Status, "ssdsd");
    if (Status === "Order ready to preparing") {
      setTimeSlot(!timeSlot);
      setTimeOrders(Id);
      return;
    } else if (Status === "Order ready to pack") {
      const now = new Date();
      const currentHours = ("0" + now.getHours()).slice(-2) % 12;
      const currentMinutes = ("0" + now.getMinutes()).slice(-2);
      const currentSeconds = ("0" + now.getSeconds()).slice(-2);
      const formattedTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

      const formData = {
        stopTime: formattedTime,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatetakeaway/${Id._id}`,
        formData
      );
      fetchData();
      localStorage.removeItem("timerId");
      localStorage.removeItem("timerExpiration");
    }

    if (Status === "Order ready to pickup") {
      setOpenInventory(!openInventory);
      setInventoryUpdateId(Id._id);
    }

    try {
      const formData = {
        status: Status,
      };
      await axios.put(
        `${process.env.REACT_APP_URL}/updatetakeaway/${Id._id}`,
        formData
      );
      const formData2 = {
        heading: Status,
        field: "Takeaway order",
        status: `${Id.orderId}'S  ${Status}`,
      };
      await axios.post(
        `${process.env.REACT_APP_URL}/createnotification`,
        formData2
      );
      notification.success({ message: "order status updated successfully" });
      fetchData();
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const statusOptions = ["Order accepted", "Order moved to KDS"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const getNextStatusOptionsAfterKds = (currentStatus) => {
    const statusOptions = ["Picked"];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const openPreviewModal = (orderedFood, instructions) => {
    setPreviewData(!previewData);
    setFoodInformationList(orderedFood);
    setSelectedProduct(instructions);
    console.log(
      { instructions: instructions?.instructionsTakeaway, orderedFood },
      "i am insstruu"
    );
  };
  const closePreviewModal = () => {
    setPreviewData(null);
  };

  const handleInventory = async (values) => {
    try {
      if (updateIdForConsumed !== "" && quantity !== "") {
        const formData = {
          consumed:
            Number(
              getInventory.filter((res) => {
                return get(res, "_id", "") === updateIdForConsumed;
              })[0].consumed
            ) + quantity,
          available:
            Number(
              getInventory.filter((res) => {
                return get(res, "_id", "") === updateIdForConsumed;
              })[0].available
            ) - quantity,
        };

        await axios.put(
          `${process.env.REACT_APP_URL}/updateinventory/${updateIdForConsumed}`,
          formData
        );
        fetchData();
        setUpdateIdForConsumed("");
        notification.success({ message: "inventory updated successfully" });
      }
      await axios.put(
        `${process.env.REACT_APP_URL}/updatetakeaway/${inventortUpdateId}`,
        values
      );
      notification.success({
        message: "Add inventory in takeawayorder successfully",
      });
      fetchData();
      setOpenInventory(!openInventory);
      setInventoryUpdateId("");
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const handleSetCategory = (value) => {
    setFilteredInventoryCategory(
      getInventory.filter((res) => {
        return get(res, "_id", "") === value;
      })
    );
  };

  const getNextStatusOptionsPartner = (currentStatus) => {
    const statusOptions = [
      "Order accepted",
      "Order moved to KDS",
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pickup",
      "Delivered",
    ];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const getStatusOptions = (currentStatus) => {
    const statusOptions = [
      "Order accepted",
      "Order moved to KDS",
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pickup",
      "Foods Handoff",
    ];
    const partnerOptions = [
      "Order accepted",
      "Order moved to KDS",
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pickup",
      "Foods Handoff",
    ];
    const kdsOptions = [
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pickup",
    ];
    let iskds = get(user, "name", "")?.split("@")?.includes("kds");
    let isPartner = get(user, "name", "")?.split("@")?.includes("partner");
    let isFrontdesk = get(user, "name", "")?.split("@")?.includes("frontdesk");

    let options = iskds
      ? kdsOptions
      : isPartner || isFrontdesk
      ? partnerOptions
      : statusOptions;

    const currentIndex = options.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  const columns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">User Id</h1>,
      dataIndex: "BromagUserID",
      key: "BromagUserID",
      align: "center",
      render: (name, data) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Customer Name</h1>,
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Mobile Number</h1>,
      dataIndex: "mobileNumber",
      key: "mobileNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood, instructionsTakeaway) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood, instructionsTakeaway)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill</h1>,
      align: "center",
      dataIndex: "_id",
      render: (name) => {
        return (
          <>
            <div
              className="lg:w-[20vw] flex flex-col"
              onClick={() => {
                navigate(`/printer/${name}/takeaway`);
              }}
            >
              Print Bill
            </div>
          </>
        );
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Amount</h1>,
      dataIndex: "billAmount",
      key: "billAmount",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Payment mode</h1>,
      dataIndex: "payment_mode",
      key: "payment_mode",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">TIme</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getStatusOptions(status);
        const nextOptionsAfterKds = getNextStatusOptionsAfterKds(status);
        const isDelivered = status === "Foods Handoff";
        const isCancelled = status === "Cancelled";
        const isPick = status === "Order ready to pickup";
        const isbeforeKds =
          status === "Order accepted" || status === "Order placed";

        return (
          <>
            {isCancelled ? (
              <Button className="bg-red-500 text-white border-none w-[100%]">
                Cancelled
              </Button>
            ) : isDelivered ? (
              <Button className="bg-green-500 text-white border-none w-[100%]">
                Foods Handoff
              </Button>
            ) : (
              <Select
                value={status}
                onChange={(newStatus) => handleStatusChange(record, newStatus)}
                className="w-[100%]"
                id="status"
              >
                {nextStatusOptions.map((option, i) => (
                  <Select.Option key={i} value={option}>
                    {option}
                  </Select.Option>
                ))}
                <Select.Option value="Cancelled">Cancelled</Select.Option>
              </Select>
            )}
          </>
        );
      },
    },
  ];

  const columnsOperations = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill Amount</h1>,
      dataIndex: "item_price",
      key: "item_price",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Bill</h1>,
      align: "center",
      dataIndex: "_id",
      render: (name) => {
        return (
          <>
            <div
              className="lg:w-[10vw] flex flex-col"
              onClick={() => {
                navigate(`/printer/${name}/takeaway`);
              }}
            >
              Print Bill
            </div>
          </>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Payment mode</h1>,
      dataIndex: "payment_mode",
      key: "payment_mode",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood, instructionsTakeaway) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood, instructionsTakeaway)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getStatusOptions(status);
        const nextOptionsAfterKds = getNextStatusOptionsAfterKds(status);
        const isDelivered = status === "Foods Handoff";
        const isCancelled = status === "Cancelled";
        const isPick = status === "Order ready to pickup";

        const isbeforeKds =
          status === "Order accepted" || status === "Order placed";

        const nextStatusOptionspartner = getNextStatusOptionsPartner(status);
        const isMovedToKDS = status === "Order moved to KDS";
        const isAfterKds =
          status === "Order ready to pickup" ||
          status === "Order out for delivery" ||
          status === "Order reached nearest to you";

        const rolefront = get(user, "name", "")
          ?.split("@")
          ?.includes("frontdesk");

        console.log("rolefront", rolefront);

        return (
          <>
            {isCancelled ? (
              <Button className="bg-red-500 text-white border-none w-[100%]">
                Cancelled
              </Button>
            ) : isDelivered ? (
              <Button className="bg-green-500 text-white border-none w-[100%]">
                Foods Handoff
              </Button>
            ) : (
              <Select
                value={status}
                onChange={(newStatus) => handleStatusChange(record, newStatus)}
                className="w-[100%]"
                id="status"
              >
                {nextStatusOptions.map((option, i) => (
                  <Select.Option key={i} value={option}>
                    {option}
                  </Select.Option>
                ))}
                <Select.Option value="Cancelled">Cancelled</Select.Option>
              </Select>
            )}
          </>
        );
      },
    },
  ];

  const getNextStatusOptionsinKds = (currentStatus) => {
    const statusOptions = [
      "Order ready to preparing",
      "Order ready to pack",
      "Order ready to pickup",
    ];

    const currentIndex = statusOptions.indexOf(currentStatus);

    return currentIndex < statusOptions.length - 1
      ? [statusOptions[currentIndex + 1]]
      : [];
  };

  useEffect(() => {
    if (
      data.find((res) => res.status === "Order ready to preparing") !==
      undefined
    ) {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [data]);

  const kdsColumns = [
    {
      title: <h1 className="text-[10px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {(currentPage - 1) * 5 + index + 1}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Date</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const formattedDate = `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()}`;
        return <p className="text-[10px] md:text-[14px]">{formattedDate}</p>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Order Id</h1>,
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Ordered Foods</h1>,
      dataIndex: "orderedFood",
      key: "orderedFood",
      align: "center",
      render: (orderedFood, instructionsTakeaway) => (
        <div className="group bg-white ml-10 shadow-md w-[80px] rounded-md flex flex-col items-center justify-center h-[35px]">
          <Button
            onClick={() => openPreviewModal(orderedFood, instructionsTakeaway)}
            type="link"
            size="small"
            className="!text-black  flex items-center justify-center"
            id="order_food"
          >
            <VisibilityIcon className="!text-[15px]" />
            <p className="ml-2 text-[12px md:text-[14px]">View</p>
          </Button>
        </div>
      ),
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Inventory</h1>,
      dataIndex: "inventory",
      key: "inventory",
      align: "center",
      render: (inventory) => {
        return (
          <div>
            {isEmpty(inventory) ? (
              <p className="text-[10px] md:text-[14px]">No inventories</p>
            ) : (
              <p className="text-[10px] md:text-[14px]">
                {inventory
                  .map(
                    (item) =>
                      `${
                        getInventory.filter((res) => {
                          return get(res, "_id", "") === item.productName;
                        })[0]?.productName
                      }: ${item.quantity}`
                  )
                  .join(", ")}
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Time</h1>,
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (createdAt) => {
        const date = new Date(createdAt);
        const hours = date.getHours() % 12 || 12;
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? "PM" : "AM";

        return (
          <p className="text-[10px] md:text-[14px]">{`${hours}:${
            minutes < 10 ? "0" : ""
          }${minutes} ${ampm}`}</p>
        );
      },
    },
    {
      title: (
        <h1 className="text-[10px] w-[200px] md:text-[14px]">Time Slot</h1>
      ),
      dataIndex: "timePicked",
      key: "timePicked",
      align: "center",
      render: (name, record) => {
        const formattedTime = currentTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        const timeMoment = moment(record.startTime, "HH:mm:ss");
        const totalSeconds =
          timeMoment.seconds() +
          timeMoment.minutes() * 60 +
          timeMoment.hours() * 3600;
        const endTime = totalSeconds + Number(record.timePicked);

        const timeString1 = record.startTime;
        const timeString2 = record.stopTime;

        const timeMoment1 = moment(timeString1, "HH:mm:ss");
        const timeMoment2 = moment(timeString2, "HH:mm:ss");

        const totalSeconds1 =
          timeMoment1.hours() * 3600 +
          timeMoment1.minutes() * 60 +
          timeMoment1.seconds();
        const totalSeconds2 =
          timeMoment2.hours() * 3600 +
          timeMoment2.minutes() * 60 +
          timeMoment2.seconds();

        const timeDifferenceInSeconds = Math.abs(totalSeconds2 - totalSeconds1);

        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        const minutes = Math.floor((timeDifferenceInSeconds % 3600) / 60);
        const seconds = timeDifferenceInSeconds % 60;

        return (
          <div className="text-[10px]  md:text-[14px]">
            {get(record, "timePicked") === undefined ? (
              <div>No slots</div>
            ) : record.status === "Order ready to preparing" ? (
              <div>
                <p className="text-green-500 font-bold">
                  Start Time:{get(record, "startTime")}
                </p>
                <p className="text-blue-500 font-bold">
                  Destination:
                  {`${Math.floor(endTime / 3600) % 12}:${Math.floor(
                    (endTime % 3600) / 60
                  )}:${endTime % 60}`}
                </p>
                <p className="text-red-500 font-bold">Clock: {formattedTime}</p>
              </div>
            ) : (
              <div>
                <p className=" font-semibold">Time Picked:{name / 60} Mins</p>
                <p className="flex items-center justify-center font-semibold">
                  Time Taken:
                  <span
                    className={`${hours === 0 ? "hidden" : "block"}`}
                  >{`${hours}hrs`}</span>
                  <span
                    className={`${minutes === 0 ? "hidden" : "block"} ${
                      hours === 0 ? "pl-0" : "pl-1"
                    }`}
                  >{`${minutes}mins`}</span>
                  <span
                    className={`${minutes === 0 ? "pl-0" : "pl-1"}`}
                  >{`${seconds}secs`}</span>
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const nextStatusOptions = getNextStatusOptionsinKds(status);
        const isDelivered = status === "Picked";
        const isCancelled = status === "Cancelled";
        const isMovedToKDS = status === "Order moved to KDS";

        return (
          <div>
            {!isCancelled && !isDelivered && (
              <Select
                value={isMovedToKDS ? "Order received" : status}
                onChange={(newStatus) => handleStatusChange(record, newStatus)}
                className="w-[100%]"
                id="status"
              >
                {nextStatusOptions.map((option, i) => (
                  <Select.Option key={i} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            )}

            {isCancelled ? (
              <Button className="bg-red-500 text-white border-none w-[100%]">
                Cancelled
              </Button>
            ) : isDelivered ? (
              <Button className="bg-green-500 text-white border-none w-[100%]">
                Picked
              </Button>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
  ];

  const qty = [
    {
      id: 1,
      qty: 1,
    },
    {
      id: 2,
      qty: 2,
    },
    {
      id: 3,
      qty: 3,
    },
    {
      id: 4,
      qty: 4,
    },
    {
      id: 5,
      qty: 5,
    },
  ];

  const handleAddField = async () => {
    try {
      if (updateIdForConsumed !== "" && quantity !== "") {
        const formData = {
          consumed:
            Number(
              getInventory.filter((res) => {
                return get(res, "_id", "") === updateIdForConsumed;
              })[0].consumed
            ) + quantity,
          available:
            Number(
              getInventory.filter((res) => {
                return get(res, "_id", "") === updateIdForConsumed;
              })[0].available
            ) - quantity,
        };

        await axios.put(
          `${process.env.REACT_APP_URL}/updateinventory/${updateIdForConsumed}`,
          formData
        );
        notification.success({ message: "inventory updated successfully" });
      }
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const calculateModalWidth = () => {
    const baseWidth = 400;
    const minWidth = 400;
    const maxWidth = 800;

    const dataCount = foodInformationList.length;

    const calculatedWidth = baseWidth + dataCount * 100;

    return Math.max(minWidth, Math.min(calculatedWidth, maxWidth));
  };

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-28 md:pl-[20vw]">
      <div className="w-[98vw] md:w-[78vw]">
        <Spin spinning={loading}>
          <div className=" hidden lg:inline">
            <Table
              columns={
                get(user, "name", "")?.split("@")?.includes("kds")
                  ? kdsColumns
                  : get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                    get(user, "name", "")?.split("@")?.includes("partner")
                  ? columnsOperations
                  : columns
              }
              dataSource={
                get(user, "name", "")?.split("@")?.includes("kds")
                  ? kdsOrders
                  : data
              }
              pagination={{
                pageSize: 5,
                current: currentPage,
                onChange: (page) => {
                  setCurrentPage(page);
                },
              }}
              scroll={{
                x:
                  get(user, "name", "")?.split("@")?.includes("partner") ||
                  get(user, "name", "")?.split("@")?.includes("kds") ||
                  get(user, "name", "")?.split("@")?.includes("frontdesk")
                    ? 800
                    : 1800,
              }}
              className="overflow-x-scroll"
            />
          </div>
          <div className="inline lg:hidden">
            {paginatedData.map((item, index) => {
              const dateTimeString = item.createdAt;

              // Split the date and time using the 'T' delimiter
              const [datePart] = dateTimeString.split("T");
              const date = datePart;

              const indianStandardTime = new Date(dateTimeString);
              const hours = indianStandardTime.getHours() % 12 || 12;
              const minutes = indianStandardTime.getMinutes();
              const ampm = indianStandardTime.getHours() >= 12 ? "PM" : "AM";

              const statusOptionsFDS = ["Order accepted", "Order moved to KDS"];

              const statusOptions = [
                "Order accepted",
                "Order moved to KDS",
                "Order ready to preparing",
                "Order ready to pack",
                "Foods Handoff",
              ];
              return (
                <>
                  <OrdersCard
                    key={index}
                    id={index + 1}
                    date={date}
                    // time={`${formattedTime} ${period}`}
                    time={`${hours}:${
                      minutes < 10 ? "0" : ""
                    }${minutes} ${ampm}`}
                    orderId={item.orderId}
                    billAmount={
                      get(user, "name", "")?.split("@")?.includes("partner") ||
                      get(user, "name", "")?.split("@")?.includes("frontdesk")
                        ? item?.item_price
                        : item.billAmount
                    }
                    preview={() => openPreviewModal(item?.orderedFood)}
                    deliveryStatus={item.status}
                    Inventory={`${
                      getInventory[0]?.productName
                        ? getInventory[0]?.productName
                        : ""
                    } ${
                      item?.inventory[0]?.quantity > 0
                        ? item?.inventory[0]?.quantity
                        : 0
                    }`}
                    handleStatusChange={(newstatus) =>
                      handleStatusChange(item, newstatus)
                    }
                    statusOptionsList={
                      get(user, "name", "")?.split("@")?.includes("frontdesk")
                        ? statusOptionsFDS
                        : statusOptions
                    }
                    printBill={item._id}
                    pathName="takeaway"
                  />
                </>
              );
            })}
            <div className="mt-4 mb-2">
              <Pagination
                current={currentPage}
                total={data.length}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
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
            {foodInformationList.map((res, i) => {
              console.log({
                res,
                inst: selectedProduct?.instructionsTakeaway?.[0]?.[res?.id],
                selectedProduct,
              });
              return (
                <div className="flex  gap-5 pt-5" key={i}>
                  <div>
                    <Image width={100} src={res.pic} />
                  </div>
                  <div>
                    <p className="text-black font-bold">
                      Food Name: {res?.foodName}
                    </p>

                    <p className="text-black font-bold">
                      Quantity: {res?.foodQuantity}
                    </p>
                    <p className="text-black font-bold">Type: {res?.type}</p>
                    {/* <p className="text-black font-bold">Type: {res?.type}</p> */}
                    {selectedProduct?.instructionsTakeaway?.[0]?.[res?.id]
                      ?.length ? (
                      <div key={res?.id} className="w-full flex">
                        <p className="text-black font-bold mr-2">
                          Instruction:{" "}
                        </p>
                        <ul>
                          {selectedProduct?.instructionsTakeaway?.[0]?.[
                            res?.id
                          ]?.map((instructions, index) => {
                            return (
                              <li className="font-bold" key={index}>
                                {" "}
                                * {instructions}
                              </li>
                            );
                          })}
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
      <Modal
        title="Pick Time slot"
        open={timeSlot}
        footer={false}
        closable={false}
      >
        <Form layout="vertical" form={timeForm} id="timeSlot_form">
          <Form.Item name="timeSlot" label={"Select Time Slot"}>
            <Select
              onChange={handleTimeSlot}
              placeholder="Select timeSlot"
              className="w-[100%]"
              size="large"
              id="time_slot"
            >
              <Select.Option value="600">10 Minutes</Select.Option>
              <Select.Option value="1200">20 Minutes</Select.Option>
              <Select.Option value="1800">30 Minutes</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={openInventory}
        footer={false}
        closable={true}
        form={form}
        onCancel={() => setOpenInventory(false)}
      >
        <Form
          name="dynamic_form_nest_item"
          onFinish={handleInventory}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          layout="vertical"
          id="inventories"
        >
          <h2>Add Inventories</h2>
          <Form.List name="inventory">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "productName"]}
                      rules={[
                        {
                          required: true,
                          message: "name is required",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Product</p>}
                      className="w-[100%]"
                    >
                      <Select
                        placeholder="Select product"
                        id="product"
                        onChange={(value) => {
                          setUpdateIdForConsumed(value);
                          handleSetCategory(value);
                        }}
                      >
                        {getInventory.map((res, i) => {
                          return (
                            <Select.Option value={get(res, "_id", "")} key={i}>
                              {res.productName}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "category"]}
                      rules={[
                        {
                          required: true,
                          message: "category is required",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Category</p>}
                      className="w-[100%]"
                    >
                      <Select id="category" placeholder="Select category">
                        {filteredInventoryCategory.map((res, i) => {
                          return (
                            <Select.Option value={res.category} key={i}>
                              {res.category}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing last name",
                        },
                      ]}
                      label={<p className="text-[12px]">Select Quantity</p>}
                      className="!w-[100%]"
                    >
                      <Select
                        placeholder="Select quantity"
                        onChange={(value) => {
                          setQuantity(value);
                        }}
                        id="qty"
                      >
                        {qty.map((res, i) => {
                          return (
                            <Select.Option value={res.qty} key={i}>
                              {res.qty}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      handleAddField();
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                    id="field"
                  >
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-green-500 float-right"
              id="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TakeAway;
