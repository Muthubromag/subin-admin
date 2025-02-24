/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./authentication/login";
import {
  Banner,
  Dashboard,
  Category,
  Feedback,
  Inventory,
  Notification,
  Product,
  SubCategory,
  Wallet,
  Video,
  User,
  TableBooking,
  OnlineOrder,
  TakeAway,
  Dinning,
  CallForOrder,
  ScratchCard,
  AdminUser,
  Printer,
} from "./components";
import RootLayout from "./layouts/rootLayout";
import { useEffect, useState, useCallback } from "react";
import { Modal, notification } from "antd";
import SignalCellularConnectedNoInternet4BarIcon from "@mui/icons-material/SignalCellularConnectedNoInternet4Bar";
import {
  changeUserValues,
  setFooterData,
  setRefreshData,
} from "./redux/adminUserSlice";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import axios from "axios";
import LoadingPage from "./components/loadingPage";
import Footer from "./Footer";
import { socket } from "./socket";
import Sound from "./assets/notify.mp3";
import Coupons from "./components/coupons";
import Charges from "./components/Charges";
import { requestPermission } from "./firebase/firebaseConfig";
import HistoryOnlineOrder from "./components/orderHistory/onlineOrder";
import HistoryCallOrder from "./components/orderHistory/callforOrder";
import HistoryDinningOrder from "./components/orderHistory/dinningOrder";
import HistorTakeAwayOrder from "./components/orderHistory/takeawauOrder";
import BookingOrder from "./components/viewBooking/bookingOrder";
import TableSlot from "./components/viewBooking/tableSlot";
import { playSound, stopSound } from "./utils/util";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="banner" element={<Banner />} />
      <Route path="user" element={<User />} />
      <Route path="category" element={<Category />} />
      <Route path="charges" element={<Charges />} />
      <Route path="coupons" element={<Coupons />} />
      <Route path="subcategory" element={<SubCategory />} />
      <Route path="wallet" element={<Wallet />} />
      {/* <Route path="tablebooking" element={<TableBooking />} /> */}
      <Route path="tableslot" element={<TableSlot />} />
      <Route path="bookingorder" element={<BookingOrder />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="video" element={<Video />} />
      <Route path="notifications" element={<Notification />} />
      <Route path="conotifications" element={<Notification />} />
      <Route path="takeawaynotifications" element={<Notification />} />
      <Route path="product" element={<Product />} />
      <Route path="onlineorder" element={<OnlineOrder />} />
      <Route path="takeaway" element={<TakeAway />} />
      <Route path="dinning" element={<Dinning />} />
      <Route path="callfororder" element={<CallForOrder />} />
      <Route path="orderhistory/onlineorder" element={<HistoryOnlineOrder />} />
      <Route path="orderhistory/takeaway" element={<HistorTakeAwayOrder />} />
      <Route path="orderhistory/dinning" element={<HistoryDinningOrder />} />
      <Route path="orderhistory/callfororder" element={<HistoryCallOrder />} />
      <Route index path="login" element={<Login />} />
      <Route path="scratchcard" element={<ScratchCard />} />
      <Route path="footer" element={<Footer />} />
      <Route path="adminuser" element={<AdminUser />} />
      <Route path="printer/:id/:name" element={<Printer />} />
    </Route>
  )
);

function App() {
  const [isOfflineModalVisible, setOfflineModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [audio] = useState(new Audio(Sound));
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const fetchFooterData = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL}/get_footer`);
      dispatch(setFooterData(get(result, "data.data")?.[0]));
    } catch (err) {}
  };
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/validateToken`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(changeUserValues(get(result, "data")));
      await fetchFooterData();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const checkData = async () => {
    const token = localStorage.getItem("token");
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/checkOrders`
      );
      if (result?.data) {
        await playSound();
      } else {
        await stopSound();
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, [loading]);
  const initializeSocket = useCallback(() => {
    // console.log("Initializing socket", socket);

    socket.on("connect", (data) => {
      console.log("=== Socket connected ===", data);
      setConnected(true);
    });
  }, [connected]);
  useEffect(() => {
    initializeSocket();

    socket.on("demo", async (data) => {
      console.log("=== Socket setWebsocketData ===");
      console.log("=== Socket message getonline data ===", data);

      // Get existing data from local storage
      const existingData =
        JSON.parse(localStorage.getItem("notificationData")) || [];

      // Add new data to the existing array
      existingData.push(data);

      // Convert the updated array to JSON string
      const jsonData = JSON.stringify(existingData);

      // Store JSON string in local storage
      localStorage.setItem("notificationData", jsonData);

      console.log({ audio });
      if (audio) {
        await audio?.play();
      }
      notification.success({
        message: `${data?.order?.toUpperCase()} - ${data?.status}`,
      });
      await checkData();

      dispatch(setRefreshData(data));
    });

    socket.on("error", (data) => {
      console.log("Socket error", data);
    });
    socket.on("disconnect", (data) => {
      console.log("=== Socket disconnected ===");
      // setConnected(false);
    });
    requestPermission();
  }, []);

  // navigator.usb.getDevices().then((devices) => {
  //   console.log(`Total devices: ${devices.length}`);
  //   if (devices.length > 0) {
  //     devices.forEach((device) => {
  //       console.log(
  //         `Product name: ${device.productName}, serial number ${device.serialNumber}`
  //       );
  //     });
  //   } else {
  //     console.log('No USB devices found.');
  //   }
  // }).catch((error) => {
  //   console.error('Error listing USB devices:', error);
  // });

  // console.log(navigator.usb.onconnect,"wekh")

  useEffect(() => {
    const handleOfflineStatus = () => {
      if (!navigator.onLine) {
        setOfflineModalVisible(true);
      } else {
        setOfflineModalVisible(false);
      }
    };

    window.addEventListener("online", handleOfflineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.removeEventListener("online", handleOfflineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <RouterProvider router={router} />
          <Modal
            title="Offline Notification"
            visible={isOfflineModalVisible}
            onCancel={() => setOfflineModalVisible(false)}
            footer={null}
          >
            <div className="text-md">
              <p className="font-bold flex items-center gap-1">
                No Internet
                <SignalCellularConnectedNoInternet4BarIcon
                  fontSize="14px"
                  className="text-yellow-500"
                />
              </p>
              <div className="pl-10">
                <span className="font-bold">Try:</span>
                <ul className="list-disc">
                  <li>Check Your internet Connection</li>
                  <li>Reconnet your Wifi</li>
                  <button
                    className="bg-blue-500 px-3 rounded-md py-1 text-white text-[12px] ml-[15vw]"
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Refresh
                  </button>
                </ul>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default App;
