/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { get, isEmpty } from "lodash";
import {
  BrunchDiningOutlined as BrunchDiningOutlinedIcon,
  FastfoodOutlined as FastfoodOutlinedIcon,
  LunchDiningOutlined as LunchDiningOutlinedIcon,
  AppSettingsAltRounded as AppSettingsAltRoundedIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
  LaptopChromebookRounded as LaptopChromebookRoundedIcon,
  TableBarRounded as TableBarRoundedIcon,
  PhoneCallbackRounded as PhoneCallbackRoundedIcon,
  VolunteerActivismRounded as VolunteerActivismRoundedIcon,
  TableRestaurantRounded as TableRestaurantRoundedIcon,
} from "@mui/icons-material";
import { Spin, Statistic, Table } from "antd";
import CountUp from "react-countup";
import moment from "moment";
import { useSelector } from "react-redux";
import OrdersChat from "../charts/barChart";
import CallOrdersChat from "../charts/pieChart";
import DinningOrderChart from "../charts/dinningOrderChart";
import TakeAwayChart from "../charts/takeAwayChart";
import UserChart from "../charts/usersChart";
import { useNavigate } from "react-router-dom";
import TableOrders from "./tableOrders";
import LoadingPage from "./loadingPage";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import WalletDepositsChart from "../charts/walletChart";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import deleivered from "../assets/delivered.jpg";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [cusines, setCusines] = useState([]);
  const [subCusines, setSubCusines] = useState([]);
  const [food, setFood] = useState([]);
  const [totalWeb, setTotalWeb] = useState([]);
  const [totalApp, setTotalApp] = useState([]);
  const [onlineOrder, setOnlineOrder] = useState([]);
  const [dinning, setDinning] = useState([]);
  const [takeAway, setTakeAway] = useState([]);
  const [callforOrder, setCallForOrder] = useState([]);
  const [table, setTable] = useState([]);
  const formatter = (value) => <CountUp end={value} separator="," />;
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [totalSales, setTotalSales] = useState("");
  const [todaySales, setTodaySales] = useState("");
  const [yesterdaySales, setYesterdaySales] = useState("");
  const [lastWeekSales, setLastWeekSales] = useState("");
  const [lastMonthSales, setLastMonthSales] = useState("");
  const [lastYearSales, setLastYearSales] = useState("");
  const [deliveredOrders, setDeliveredOrders] = useState("");
  const [pendingOrders, setPendingOrders] = useState("");
  const [cancelledOrders, setCancelledOrders] = useState("");
  const [scratchCards, setScratchCards] = useState([]);
  const [totalCompletedOrderPrice, setTotoalCompletedOrderPrice] = useState("");
  const [totalCancelOrderPrice, setTotalCancelOrderPrice] = useState("");
  const [totalPendingOrderPrice, setTotalPendingOrderPrice] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = await axios.get(`${process.env.REACT_APP_URL}/getalluser`);
      const cat = await axios.get(`${process.env.REACT_APP_URL}/getcategory`);
      const subcat = await axios.get(
        `${process.env.REACT_APP_URL}/getsubcategory`
      );
      const food = await axios.get(`${process.env.REACT_APP_URL}/getproduct`);
      const onlineord = await axios.get(
        `${process.env.REACT_APP_URL}/getonlineorder`
      );
      const dinningord = await axios.get(
        `${process.env.REACT_APP_URL}/getdinningorder`
      );
      const take = await axios.get(`${process.env.REACT_APP_URL}/gettakeaway`);
      const call = await axios.get(`${process.env.REACT_APP_URL}/getcallorder`);
      const table = await axios.get(`${process.env.REACT_APP_URL}/getbooking`);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getscratch?search=all`
      );
      setScratchCards(get(result, "data.data", []));
      setUsers(get(user, "data.message", []));
      setCusines(get(cat, "data.data", []));
      setSubCusines(get(subcat, "data.data", []));
      setFood(get(food, "data.data", []));
      setOnlineOrder(get(onlineord, "data.data", []));
      setCallForOrder(get(call, "data.data", []));
      setDinning(get(dinningord, "data.data", []));
      setTakeAway(get(take, "data.data", []));
      setTable(get(table, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isEmpty(localStorage.getItem("token"))) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    // total sales
    const totalDeliveredOnlineOrder = onlineOrder

      .filter((res) => {
        return get(res, "status") === "Delivered";
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const totalDeliveredCallForOrder = callforOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" ||
          get(res, "status") === "Foods Handoff"
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const totalDeliveredDinningOrder = dinning
      .filter((res) => {
        return get(res, "status") === "Order served";
      })
      .reduce((total, order) => total + get(order, "item_price"), 0);

    const totalDeliveredTakeOrder = takeAway
      .filter((res) => {
        return get(res, "status") === "Foods Handoff";
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    // Today Order

    const todays = moment().startOf("day");

    const todayDeliveredOnlineOrder = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isSame(todays, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const todayDeliveredCallForOrder = callforOrder
      .filter((res) => {
        return (
          (get(res, "status") === "Delivered" ||
            get(res, "status") === "Foods Handoff") &&
          moment(res.createdAt).isSame(todays, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const todayDeliveredDinningOrder = dinning
      .filter((res) => {
        return (
          get(res, "status") === "Order served" &&
          moment(res.createdAt).isSame(todays, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    const todayDeliveredTakeOrder = takeAway
      .filter((res) => {
        return (
          get(res, "status") === "Foods Handoff" &&
          moment(res.createdAt).isSame(todays, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    // end Today order

    // yesterday sales
    const yesterday = moment().subtract(1, "day").startOf("day");

    const totalDeliveredYesterdayOnlineOrder = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isSame(yesterday, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const totalDeliveredYesterdayCallForOrder = callforOrder
      .filter((res) => {
        return (
          (get(res, "status") === "Delivered" ||
            get(res, "status") === "Foods Handoff") &&
          moment(res.createdAt).isSame(yesterday, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const totalDeliveredYesterdayDinningOrder = dinning
      .filter((res) => {
        return (
          get(res, "status") === "Order served" &&
          moment(res.createdAt).isSame(yesterday, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    const totalDeliveredYesterdayTakeOrder = takeAway
      .filter((res) => {
        return (
          get(res, "status") === "Foods Handoff" &&
          moment(res.createdAt).isSame(yesterday, "day")
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    console.log(
      "yesterday",
      totalDeliveredYesterdayOnlineOrder,
      totalDeliveredYesterdayDinningOrder,
      totalDeliveredYesterdayTakeOrder,
      totalDeliveredYesterdayCallForOrder
    );

    // Last week sales
    const currentWeekStart = moment().startOf("week");
    const previousWeekStart = moment(currentWeekStart).subtract(1, "week");
    const totalDeliveredLastWeekOnlineOrder = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isBetween(
            previousWeekStart,
            currentWeekStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const totalDeliveredLastWeekCallForOrder = callforOrder
      .filter((res) => {
        return (
          (get(res, "status") === "Delivered" ||
            get(res, "status") === "Foods Handoff") &&
          moment(res.createdAt).isBetween(
            previousWeekStart,
            currentWeekStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const totalDeliveredLastWeekDinningOrder = dinning
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isBetween(
            previousWeekStart,
            currentWeekStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    const totalDeliveredLastWeekTakeOrder = takeAway
      .filter((res) => {
        return (
          get(res, "status") === "Foods Handoff" &&
          moment(res.createdAt).isBetween(
            previousWeekStart,
            currentWeekStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    // Last month sales
    const currentMonthStart = moment().startOf("month");
    const previousMonthStart = moment(currentMonthStart).subtract(1, "month");

    const totalDeliveredLastMonthOnlineOrder = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isBetween(
            previousMonthStart,
            currentMonthStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const totalDeliveredLastMonthCallForOrder = callforOrder
      .filter((res) => {
        return (
          (get(res, "status") === "Delivered" ||
            get(res, "status") === "Foods Handoff") &&
          moment(res.createdAt).isBetween(
            previousMonthStart,
            currentMonthStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const totalDeliveredLastMonthDinningOrder = dinning
      .filter((res) => {
        return (
          get(res, "status") === "Order served" &&
          moment(res.createdAt).isBetween(
            previousMonthStart,
            currentMonthStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    const totalDeliveredLastMonthTakeOrder = takeAway
      .filter((res) => {
        return (
          get(res, "status") === "Foods Handoff" &&
          moment(res.createdAt).isBetween(
            previousMonthStart,
            currentMonthStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    // Last year sales

    const currentYearStart = moment().startOf("year");
    const previousYearStart = moment(currentYearStart).subtract(1, "year");

    const totalDeliveredLastYearOnlineOrder = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" &&
          moment(res.createdAt).isBetween(
            previousYearStart,
            currentYearStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "itemPrice")), 0);

    const totalDeliveredLastYearCallForOrder = callforOrder
      .filter((res) => {
        return (
          (get(res, "status") === "Delivered" ||
            get(res, "status") === "Foods Handoff") &&
          moment(res.createdAt).isBetween(
            previousYearStart,
            currentYearStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "billAmount")), 0);

    const totalDeliveredLastYearDinningOrder = dinning
      .filter((res) => {
        return (
          get(res, "status") === "Order served" &&
          moment(res.createdAt).isBetween(
            previousYearStart,
            currentYearStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    const totalDeliveredLastYearTakeOrder = takeAway
      .filter((res) => {
        return (
          get(res, "status") === "Foods Handoff" &&
          moment(res.createdAt).isBetween(
            previousYearStart,
            currentYearStart,
            null,
            "[]"
          )
        );
      })
      .reduce((total, order) => total + Number(get(order, "item_price")), 0);

    // Total sales for last year
    const totalDeliveredLastYearSales =
      totalDeliveredLastYearOnlineOrder +
      totalDeliveredLastYearDinningOrder +
      totalDeliveredLastYearTakeOrder +
      totalDeliveredLastYearCallForOrder;

    setTotalSales(
      totalDeliveredOnlineOrder +
        totalDeliveredDinningOrder +
        totalDeliveredTakeOrder +
        totalDeliveredCallForOrder,
      "pow"
    );
    setTodaySales(
      todayDeliveredOnlineOrder +
        todayDeliveredDinningOrder +
        todayDeliveredTakeOrder +
        todayDeliveredCallForOrder,
      "pow"
    );
    setYesterdaySales(
      totalDeliveredYesterdayOnlineOrder +
        totalDeliveredYesterdayDinningOrder +
        totalDeliveredYesterdayTakeOrder +
        totalDeliveredYesterdayCallForOrder,
      "pow"
    );
    setLastWeekSales(
      totalDeliveredLastWeekOnlineOrder +
        totalDeliveredLastWeekDinningOrder +
        totalDeliveredLastWeekTakeOrder +
        totalDeliveredLastWeekCallForOrder,
      "pow"
    );

    setLastMonthSales(
      totalDeliveredLastMonthOnlineOrder +
        totalDeliveredLastMonthDinningOrder +
        totalDeliveredLastMonthTakeOrder +
        totalDeliveredLastMonthCallForOrder
    );
    setLastYearSales(totalDeliveredLastYearSales, "pow");
  }, [onlineOrder, dinning, callforOrder, takeAway]);

  useEffect(() => {
    const totalDeliveredOnlineOrder = onlineOrder.filter((res) => {
      return get(res, "status") === "Delivered";
    });

    const totalDeliveredCallForOrder = callforOrder.filter((res) => {
      return (
        get(res, "status") === "Delivered" ||
        get(res, "status") === "Foods Handoff"
      );
    });

    const totalDeliveredDinningOrder = dinning.filter((res) => {
      return get(res, "status") === "Order served";
    });

    const totalDeliveredTakeOrder = takeAway.filter((res) => {
      return get(res, "status") === "Foods Handoff";
    });

    const totalDelivered =
      get(totalDeliveredOnlineOrder, "length", "") +
      get(totalDeliveredCallForOrder, "length", "") +
      get(totalDeliveredTakeOrder, "length", "") +
      get(totalDeliveredDinningOrder, "length", "");

    setDeliveredOrders(totalDelivered);

    // Start Total Order Amount

    const totalOnlineItemPrice = onlineOrder
      .filter((res) => {
        return get(res, "status") === "Delivered";
      })
      .reduce((total, order) => {
        return total + order.itemPrice;
      }, 0);
    const totalCallorderItemPrice = callforOrder
      .filter((res) => {
        return (
          get(res, "status") === "Delivered" ||
          get(res, "status") === "Foods Handoff"
        );
      })
      .reduce((total, order) => {
        return total + Number(order.billAmount);
      }, 0);
    const totalDinningorderItemPrice = dinning
      .filter((res) => {
        return get(res, "status") === "Order served";
      })
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);
    const totalTakeAwayorderItemPrice = takeAway
      .filter((res) => {
        return get(res, "status") === "Foods Handoff";
      })
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);

    setTotoalCompletedOrderPrice(
      totalOnlineItemPrice +
        totalCallorderItemPrice +
        totalDinningorderItemPrice +
        totalTakeAwayorderItemPrice
    );

    // End Total Order Amount

    // Total cancelled
    const totalCancelledOnlineOrder = onlineOrder.filter(
      (res) => get(res, "status") === "Cancelled"
    );

    const totalCancelledCallForOrder = callforOrder.filter(
      (res) => get(res, "status") === "Cancelled"
    );

    const totalCancelledDinningOrder = dinning.filter(
      (res) => get(res, "status") === "Cancelled"
    );

    const totalCancelledTakeOrder = takeAway.filter(
      (res) => get(res, "status") === "Cancelled"
    );

    const totalCancelled =
      get(totalCancelledOnlineOrder, "length", "") +
      get(totalCancelledCallForOrder, "length", "") +
      get(totalCancelledDinningOrder, "length", "") +
      get(totalCancelledTakeOrder, "length", "");
    setCancelledOrders(totalCancelled);

    // Start Total cancel Price

    const totalcancelOnlineItemPrice = onlineOrder
      .filter((res) => get(res, "status") === "Cancelled")
      .reduce((total, order) => {
        return total + order.itemPrice;
      }, 0);
    const totalcancelCallorderItemPrice = callforOrder
      .filter((res) => get(res, "status") === "Cancelled")
      .reduce((total, order) => {
        return total + Number(order.billAmount);
      }, 0);
    const totalcancelDinningorderItemPrice = dinning
      .filter((res) => get(res, "status") === "Cancelled")
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);
    const totalcancelTakeAwayorderItemPrice = takeAway
      .filter((res) => get(res, "status") === "Cancelled")
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);

    setTotalCancelOrderPrice(
      totalcancelOnlineItemPrice +
        totalcancelCallorderItemPrice +
        totalcancelDinningorderItemPrice +
        totalcancelTakeAwayorderItemPrice
    );

    console.log(
      totalcancelOnlineItemPrice,
      totalcancelCallorderItemPrice,
      totalcancelDinningorderItemPrice,
      totalcancelTakeAwayorderItemPrice,
      "CancelAMount"
    );

    // End Total Cancel Price

    //Pending Orders

    const totalPendingOnlineOrder = onlineOrder.filter((res) => {
      return (
        get(res, "status") !== "Cancelled" && get(res, "status") !== "Delivered"
      );
    });

    const totalPendingCallOrder = callforOrder.filter((res) => {
      return (
        get(res, "status") !== "Cancelled" &&
        get(res, "status") !== "Delivered" &&
        get(res, "status") !== "Foods Handoff"
      );
    });

    const totalPendingDinningOrder = dinning.filter((res) => {
      return (
        get(res, "status") !== "Cancelled" &&
        get(res, "status") !== "Order served"
      );
    });

    const totalPendingTakeAwayOrder = takeAway.filter((res) => {
      return (
        get(res, "status") !== "Cancelled" &&
        get(res, "status") !== "Foods Handoff"
      );
    });

    const totalPending =
      get(totalPendingOnlineOrder, "length", "") +
      get(totalPendingCallOrder, "length", "") +
      get(totalPendingDinningOrder, "length", "") +
      get(totalPendingTakeAwayOrder, "length", "");
    setPendingOrders(totalPending);

    // Start PendingOrder Amount

    const totalPendingOnlineItemPrice = onlineOrder
      .filter((res) => {
        return (
          get(res, "status") !== "Cancelled" &&
          get(res, "status") !== "Delivered"
        );
      })
      .reduce((total, order) => {
        return total + order.itemPrice;
      }, 0);
    const totalPendingCallorderItemPrice = callforOrder
      .filter((res) => {
        return (
          get(res, "status") !== "Cancelled" &&
          get(res, "status") !== "Delivered" &&
          get(res, "status") !== "Foods Handoff"
        );
      })
      .reduce((total, order) => {
        return total + Number(order.billAmount);
      }, 0);
    const totalPendingDinningorderItemPrice = dinning
      .filter((res) => {
        return (
          get(res, "status") !== "Cancelled" &&
          get(res, "status") !== "Order served"
        );
      })
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);
    const totalPendingTakeAwayorderItemPrice = takeAway
      .filter((res) => {
        return (
          get(res, "status") !== "Cancelled" &&
          get(res, "status") !== "Foods Handoff"
        );
      })
      .reduce((total, order) => {
        return total + Number(order.item_price);
      }, 0);

    setTotalPendingOrderPrice(
      totalPendingOnlineItemPrice +
        totalPendingCallorderItemPrice +
        totalPendingDinningorderItemPrice +
        totalPendingTakeAwayorderItemPrice
    );

    // End PendingOrder Amount
  }, [onlineOrder, dinning, callforOrder, takeAway]);

  useEffect(() => {
    setTotalWeb(
      users.filter((res) => {
        return res;
      })
    );
    setTotalApp(
      users.filter((res) => {
        return get(res, "status") === "app";
      })
    );
  }, [users]);

  const totalMenu = [
    {
      id: 1,
      heading: "Cuisines",
      value: get(cusines, "length"),
      color: "bg-red-500",
      icon: <BrunchDiningOutlinedIcon className="!text-[25px]" />,
    },
    {
      id: 2,
      heading: "Sub cuisines",
      value: get(subCusines, "length"),
      color: "bg-green-500",
      icon: <FastfoodOutlinedIcon className="!text-[25px]" />,
    },
    {
      id: 3,
      heading: "Dishes",
      value: get(food, "length"),
      color: "bg-violet-500",
      icon: <LunchDiningOutlinedIcon className="!text-[25px]" />,
    },
  ];

  const totalUsers = [
    {
      id: 1,
      heading: "Web users",
      value: get(totalWeb, "length"),
      color: "bg-pink-500",
      icon: <PeopleAltRoundedIcon className="!text-[30px]" />,
    },
    // {
    //   id: 2,
    //   heading: "App users",
    //   value: get(totalApp, "length"),
    //   color: "bg-yellow-500",
    //   icon: <AppSettingsAltRoundedIcon className="!text-[30px]" />,
    // },
  ];

  const totalForKds = [
    {
      id: 6,
      heading: "Online order",
      value: get(onlineOrder, "length"),
      color: "bg-blue-500",
      icon: <LaptopChromebookRoundedIcon className="!text-[30px]" />,
    },
    {
      id: 7,
      heading: "Dinning order",
      value: get(dinning, "length"),
      color: "bg-amber-600",
      icon: <TableBarRoundedIcon className="!text-[30px]" />,
    },
    {
      id: 8,
      heading: "Call for order",
      value: get(callforOrder, "length"),
      color: "bg-orange-500",
      icon: <PhoneCallbackRoundedIcon className="!text-[30px]" />,
    },
    {
      id: 9,
      heading: "Takeaway order",
      value: get(takeAway, "length"),
      color: "bg-lime-500",
      icon: <VolunteerActivismRoundedIcon className="!text-[30px]" />,
    },
    {
      id: 10,
      heading: "Table Bookings",
      value: get(table, "length"),
      color: "bg-teal-400",
      icon: <TableRestaurantRoundedIcon className="!text-[30px]" />,
    },
  ];

  const columns = [
    {
      title: <h1 className="text-[8px] md:text-[14px]">S.No</h1>,
      key: "serialNumber",
      align: "center",
      render: (_, __, index) => {
        return <h1 className="text-[8px] md:text-[14px]">{index + 1}</h1>;
      },
    },

    {
      title: <h1 className="text-[8px] md:text-[14px]">Name</h1>,
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (name) => {
        return <h1 className="text-[8px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[8px] md:text-[14px]">Mobile Number</h1>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      render: (name) => {
        return <h1 className="text-[8px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[8px] md:text-[14px]">Email</h1>,
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (name) => {
        return <h1 className="text-[8px] md:text-[14px]">{name}</h1>;
      },
    },
  ];

  return (
    <div className="pb-5 md:pl-[20vw]  flex items-center justify-center md:items-start md:justify-start mt-28 md:mt-24 mb-48 lg:mb-0 ">
      {!localStorage.getItem("token") ? (
        <LoadingPage />
      ) : (
        <Spin spinning={loading}>
          <div
            className={`flex  flex-wrap  items-center justify-center md:items-start md:justify-start  gap-4 md:w-[80vw]  `}
          >
            {/* Start Total Orders */}
            <div
              className={`w-96 m-auto lg:m-0 lg:w-full py-4 px-4   ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }  rounded-md
              `}
              style={{
                boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8px )",
                webkitBackdropFilter: "blur( 8px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                background: "rgba( 255, 255, 255, 0.35 )",
              }}
            >
              <h1 className="text-white font-bold text-center text-lg mb-6">
                Total Order's
              </h1>
              <div className="w-full">
                <div className="flex lg:flex-row flex-col gap-5 items-center justify-between pt-2 ">
                  <div className="flex flex-col gap-5  justify-between p-4  w-full bg-blue-400  rounded-2xl">
                    <div className="flex gap-5  justify-between   ">
                      <Statistic
                        title={
                          <h1 className="text-white font-semibold text-[16px]">
                            Total orders
                          </h1>
                        }
                        value={deliveredOrders + cancelledOrders}
                        valueStyle={{
                          color: "white",
                          textAlign: "start",
                        }}
                        formatter={formatter}
                      />
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={deliveredOrders + cancelledOrders}
                          text={`${Number(
                            deliveredOrders + cancelledOrders
                          ).toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "24px",
                            pathColor: "blue",
                            textColor: "black",
                            trailColor: "#e4e4e4",
                          })}
                        />
                      </div>
                    </div>
                    <h1 className="text-lg">
                      Total Amount:{" "}
                      {totalCompletedOrderPrice + totalCancelOrderPrice}
                    </h1>
                  </div>

                  <div className="flex gap-5 flex-col  justify-between p-4  w-full bg-green-400  rounded-2xl">
                    <div className="flex gap-5  justify-between">
                      <Statistic
                        title={
                          <h1 className="text-white font-semibold text-[16px]">
                            Completed orders
                          </h1>
                        }
                        value={deliveredOrders}
                        valueStyle={{
                          color: "white",
                          textAlign: "start",
                        }}
                        formatter={formatter}
                      />
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={deliveredOrders}
                          text={`${Number(deliveredOrders).toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "24px",
                            pathColor: "green",
                            textColor: "black",
                            trailColor: "#e4e4e4",
                          })}
                        />
                      </div>
                    </div>
                    <h1 className="text-lg">
                      Total Amount: {totalCompletedOrderPrice}
                    </h1>
                  </div>

                  <div className="flex gap-5 flex-col  justify-between p-4 bg-orange-200  w-full  rounded-2xl">
                    <div className="flex gap-5  justify-between">
                      <Statistic
                        title={
                          <h1 className="text-orange-500 font-semibold text-[16px]">
                            Pending orders
                          </h1>
                        }
                        value={pendingOrders}
                        valueStyle={{
                          color: "#ff6100ed ",
                          textAlign: "start",
                        }}
                        formatter={formatter}
                      />
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={pendingOrders}
                          text={`${Number(pendingOrders).toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "24px",
                            pathColor: "orange",
                            textColor: "black",
                            trailColor: "#e4e4e4",
                          })}
                        />
                      </div>
                    </div>
                    <h1 className="text-lg">
                      Total Amount: {totalPendingOrderPrice}
                    </h1>
                  </div>

                  <div className="flex gap-5 flex-col justify-between p-4 bg-red-400  w-full rounded-2xl">
                    <div className="flex gap-5 justify-between ">
                      <Statistic
                        title={
                          <h1 className="text-white font-semibold text-[16px]">
                            Cancelled orders
                          </h1>
                        }
                        value={cancelledOrders}
                        valueStyle={{
                          color: "white",
                          textAlign: "start",
                        }}
                        formatter={formatter}
                      />
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={cancelledOrders}
                          text={`${Number(cancelledOrders).toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "16px",
                            pathColor: "red",
                            textColor: "white",
                            trailColor: "rgba(255,255,255,0.2)",
                          })}
                        />
                      </div>
                    </div>
                    <h1 className="text-lg">
                      Total Amount: {totalCancelOrderPrice}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            {/* End Total Orders */}

            {/* <div
              className={`w-96 m-auto lg:m-0 lg:w-[330px] py-4 px-4 h-[308px] bg-gradient-to-r from-red-800 via-red-500 to-white/50 rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("partner") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }  `}
            >
              <h1 className="text-white font-bold text-center">
                Total Wallet Deposits
              </h1>
              <div className="flex items-center justify-center">
                <div className="flex w-[300px] flex-col items-center justify-center pt-1">
                  <div className="flex flex-col">
                    <Statistic
                      title={
                        <h1 className="text-white text-center font-semibold text-[12px]">
                          Total Amount
                        </h1>
                      }
                      value={98219}
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                    <div className="text-white flex justify-between px-1 text-[10px] pt-1 border-b pb-2">
                      <p> Last deposit on 20-13-2023</p>
                      <p className="text-blue-800 font-bold cursor-pointer">
                        View Deposits
                        <NavigateNextIcon className="!text-[14px]" />
                      </p>
                    </div>
                    <div>
                      <h1 className="text-white font-bold text-center pt-3 text-[15px]">
                        Last Five Deposits
                      </h1>
                      <WalletDepositsChart />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* start Total sales */}
            <div
              className={`w-96 m-auto lg:m-0 lg:w-full py-4 px-4   rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
              style={{
                boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8px )",
                webkitBackdropFilter: "blur( 8px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                background: "rgba( 255, 255, 255, 0.35 )",
              }}
            >
              <h1 className="text-white font-bold text-lg text-center mb-4">
                Sales
              </h1>
              <div className="flex  justify-between ">
                <div className="flex w-full lg:flex-row flex-col gap-5 items-center justify-between pt-2 ">
                  <div className="flex bg-white p-2 rounded-lg white w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center">
                          Total sales
                        </h1>
                      }
                      value={totalSales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex bg-white  p-2 rounded-lg bgwhite w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center w-full">
                          Today sales
                        </h1>
                      }
                      value={todaySales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>

                  <div className="flex  p-2 rounded-lg bg-white w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center w-full">
                          Yesterday sales
                        </h1>
                      }
                      value={yesterdaySales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex  p-2 rounded-lg bg-white w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center w-full">
                          Last week sales
                        </h1>
                      }
                      value={lastWeekSales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex  p-2 rounded-lg bg-white w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center w-full">
                          Last month sales
                        </h1>
                      }
                      value={lastMonthSales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex  p-2 rounded-lg bg-white w-full">
                    <Statistic
                      className="w-[100%]"
                      title={
                        <h1 className="text-black font-semibold text-[18px] text-center">
                          Last year sales
                        </h1>
                      }
                      value={lastYearSales}
                      valueStyle={{
                        color: "black",
                        textAlign: "center",
                        fontSize: "18px",
                      }}
                      formatter={formatter}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* end Total sales */}

            {/* Start Orders */}
            <div
              className={`w-96 m-auto lg:m-0 lg:w-[500px] py-4 px-4 rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              } `}
              style={{
                boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8px )",
                webkitBackdropFilter: "blur( 8px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                background: "rgba( 255, 255, 255, 0.35 )",
              }}
            >
              <h1 className="text-white font-bold text-center mb-4">Order's</h1>
              <div className="flex flex-wrap gap-10">
                {totalForKds.map((res, i) => {
                  const percentage = (res.value / 100) * 100;
                  return (
                    <div
                      key={i}
                      className="flex w-full items-center  justify-around gap-5 border-b"
                    >
                      <div className="flex flex-col items-center justify-center pt-2 ">
                        <span className="!text-white">{res.icon}</span>
                        <Statistic
                          title={
                            <h1 className="text-white font-semibold text-[14px]">
                              {res.heading}
                            </h1>
                          }
                          value={get(res, "value")}
                          valueStyle={{
                            color: "white",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                          formatter={formatter}
                        />
                      </div>
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage.toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "16px",
                            pathColor: "rgba(75,192,192,1)",
                            textColor: "white",
                            trailColor: "rgba(255,255,255,0.2)",
                          })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Start Orders */}
            {/* Start Total Menu */}
            <div
              className={` w-96 m-auto lg:m-0 py-4 px-4 ${
                get(user, "name", "")?.split("@")?.includes("menu")
                  ? "w-[75vw] flex flex-row gap-16 justify-between px-20"
                  : " h-[308px]"
              }  ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                // get(user, "name", "")?.split("@")?.includes("partner") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
              style={{
                boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8px )",
                webkitBackdropFilter: "blur( 8px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                background: "rgba( 255, 255, 255, 0.35 )",
              }}
            >
              <h1
                className={`text-white font-bold text-center ${
                  get(user, "name", "")?.split("@")?.includes("menu")
                    ? "hidden"
                    : "block"
                }`}
              >
                Total Menu's
              </h1>
              <div className="">
                {totalMenu.map((res, i) => {
                  const percentage = (res.value / 100) * 100;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center gap-5 ${
                        get(user, "name", "")?.split("@")?.includes("menu") &&
                        res.heading !== "Dishes"
                          ? "border-r pr-8"
                          : !get(user, "name", "")?.split("@")?.includes("menu")
                          ? "border-b"
                          : ""
                      }`}
                    >
                      <div
                        className={`flex ${
                          get(user, "name", "")?.split("@")?.includes("menu")
                            ? "w-[100px]"
                            : "w-[150px]"
                        } flex-col items-center justify-center pt-2 `}
                      >
                        <span className="!text-white">{res.icon}</span>
                        <Statistic
                          title={
                            <h1 className="text-white font-semibold text-[14px]">
                              {res.heading}
                            </h1>
                          }
                          value={get(res, "value")}
                          valueStyle={{
                            color: "white",
                            textAlign: "center",
                            fontSize: "15px",
                          }}
                          formatter={formatter}
                        />
                      </div>
                      <div style={{ width: "70px" }}>
                        <CircularProgressbar
                          value={percentage}
                          text={`${percentage.toFixed(1)}%`}
                          styles={buildStyles({
                            textSize: "16px",
                            pathColor: "rgba(75,192,192,1)",
                            textColor: "white",
                            trailColor: "rgba(255,255,255,0.2)",
                          })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Start Total menu */}

            {/* Start Total User */}
            <div
              className={` w-96 m-auto lg:m-0 lg:w-[220px] py-4 px-4  rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
              style={{
                boxShadow: " 0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                backdropFilter: "blur( 8px )",
                webkitBackdropFilter: "blur( 8px )",
                borderRadius: "10px",
                border: "1px solid rgba( 255, 255, 255, 0.18 )",
                background: "rgba( 255, 255, 255, 0.35 )",
              }}
            >
              <h1 className="text-white font-bold text-center">
                Total Users's
              </h1>
              {totalUsers.map((res, i) => {
                const percentage = (res.value / 100) * 100;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-center border-b"
                  >
                    <div className="flex w-[150px] flex-col items-center justify-center pt-8 ">
                      <span className="!text-white">{res.icon}</span>
                      <Statistic
                        title={
                          <h1 className="text-white font-semibold text-[14px]">
                            {res.heading}
                          </h1>
                        }
                        value={get(res, "value")}
                        valueStyle={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                        formatter={formatter}
                      />
                    </div>
                    <div style={{ width: "70px" }}>
                      <CircularProgressbar
                        value={percentage}
                        text={`${percentage.toFixed(1)}%`}
                        styles={buildStyles({
                          textSize: "16px",
                          pathColor: "rgba(75,192,192,1)",
                          textColor: "white",
                          trailColor: "rgba(255,255,255,0.2)",
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* End Total User */}

            <div
              className={`py-4 px-4 w-[90vw] md:w-[75vw] flex flex-wrap bg-gradient-to-r from-yellow-500 via-yellow-300 to-white/50 rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk")
                  ? "block"
                  : "hidden"
              } `}
            >
              {totalForKds.map((res, i) => {
                const percentage = (res.value / 100) * 100;
                return (
                  <div
                    key={i}
                    className="flex w-[95vw] md:w-[50%] lg:w-[33.33%] border-r gap-5"
                  >
                    <div className="flex w-full md:w-[160px] flex-col items-center justify-center pt-2">
                      <span className="text-white">{res.icon}</span>
                      <Statistic
                        title={
                          <h1 className="text-white font-semibold text-[14px]">
                            {res.heading}
                          </h1>
                        }
                        value={get(res, "value")}
                        valueStyle={{
                          color: "white",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                        formatter={formatter}
                      />
                    </div>
                    <div style={{ width: "70px" }}>
                      <CircularProgressbar
                        value={percentage}
                        text={`${percentage.toFixed(1)}%`}
                        styles={buildStyles({
                          textSize: "16px",
                          pathColor: "rgba(75,192,192,1)",
                          textColor: "white",
                          trailColor: "rgba(255,255,255,0.2)",
                        })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* <div
              className={`w-96 m-auto lg:m-0  py-4 px-4 ${
                get(user, "name", "")?.split("@")?.includes("scratch")
                  ? "lg:w-[75vw]"
                  : "h-[500px]"
              }  bg-gradient-to-r from-fuchsia-800 via-fuchsia-500 to-white/50 rounded-md ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("partner") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
            >
              <h1
                className={`${
                  get(user, "name", "")?.split("@")?.includes("scratch")
                    ? "hidden"
                    : "block"
                } text-white font-bold text-center`}
              >
                Scratch Cards
              </h1>
              <div className="flex items-center justify-center ">
                <div
                  className={`flex ${
                    get(user, "name", "")?.split("@")?.includes("scratch")
                      ? "flex-row gap-10 flex-wrap"
                      : "w-[330px] flex-col gap-4 items-center justify-center"
                  }  pt-2 `}
                >
                  <div className="flex  border-b pb-2">
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[18px]">
                          Total scratch cards
                        </h1>
                      }
                      value={scratchCards.length}
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex gap-5 border-b pb-2">
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[18px]">
                          Winner scratch cards
                        </h1>
                      }
                      value={
                        scratchCards.filter((res) => {
                          return get(res, "status") === true;
                        }).length
                      }
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex gap-5 border-b pb-2">
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[18px]">
                          Not winner scratch cards
                        </h1>
                      }
                      value={
                        scratchCards.filter((res) => {
                          return get(res, "status") === false;
                        }).length
                      }
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex gap-5 border-b pb-2">
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[18px]">
                          Not expired cards
                        </h1>
                      }
                      value={
                        scratchCards.filter((res) => {
                          return res.expired === false;
                        }).length
                      }
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </div>
                  <div className="flex gap-5 border-b pb-2">
                    <Statistic
                      title={
                        <h1 className="text-white font-semibold text-[18px]">
                          Expired cards
                        </h1>
                      }
                      value={
                        scratchCards.filter((res) => {
                          return res.expired === true;
                        }).length
                      }
                      valueStyle={{
                        color: "white",
                        textAlign: "center",
                      }}
                      formatter={formatter}
                    />
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div
              className={`w-96 m-auto lg:m-0 lg:w-[270px]${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
            >
              <TableOrders />
            </div> */}
            {/* <div
              className={`hidden lg:inline  flex flex-wrap items-center justify-center md:items-start md:justify-between md:px-28 gap-8 ${
                get(user, "name", "")?.split("@")?.includes("kds") ||
                get(user, "name", "")?.split("@")?.includes("frontdesk") ||
                get(user, "name", "")?.split("@")?.includes("scratch") ||
                get(user, "name", "")?.split("@")?.includes("menu") ||
                get(user, "name", "")?.split("@")?.includes("banner") ||
                get(user, "name", "")?.split("@")?.includes("rider")
                  ? "hidden"
                  : "block"
              }`}
            > */}
            {/* <div>
                <OrdersChat ordersData={onlineOrder} />
              </div>

              <div>
                <DinningOrderChart ordersData={onlineOrder} />
              </div> */}
            {/* <div
              className={`md:w-[35vw] xl:w-[17vw] ${
                get(user, "name", "")?.split("@")?.includes("partner")
                  ? "hidden"
                  : "block"
              }`}
            >
              <UserChart ordersData={onlineOrder} />
            </div> */}
            {/* <div className="md:w-[35vw]">
                <h1 className="text-center text-[--primary-color] font-bold">
                  Last 5 users
                </h1>
                <Table
                  dataSource={users.slice(-5)}
                  pagination={false}
                  columns={columns}
                  scroll={{ x: 300 }}
                />
              </div>
              <div className="md:w-[35vw] xl:w-[20vw]">
                <TakeAwayChart ordersData={onlineOrder} />
              </div>
              <div className="md:w-[35vw] xl:w-[20vw]">
                <CallOrdersChat ordersData={onlineOrder} />
              </div> */}
            {/* </div> */}
          </div>
        </Spin>
      )}
    </div>
  );
}

export default Dashboard;
