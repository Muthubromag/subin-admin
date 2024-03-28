/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeUserValues } from "../redux/adminUserSlice";
import { get } from "lodash";
import { getMenus, items } from "../helper/menu";
import { Drawer, Menu } from "antd";
import { useLocation } from "react-router-dom";
import LoadingPage from "../components/loadingPage";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, LoginOutlined } from "@ant-design/icons";
import menu from "../assets/menu.png";

const Sidenavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState("");
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [menus, setMenus] = useState([]);

  console.log({ menus });
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
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMenu = async () => {
    const menusData = await getMenus();
    setMenus(menusData);
  };

  useEffect(() => {
    fetchMenu();
    fetchData();
  }, []);

  useEffect(() => {}, [get(location, "pathname", "")]);

  const supportFilter = menus.filter((item) => {
    if (get(user, "name")?.split("@")?.includes("scratch")) {
      return item.key === "/scratchcard" || item.key === "/";
    }
  });

  const MenuFilter = menus.filter((item) => {
    if (get(user, "name")?.split("@")?.includes("menu")) {
      return (
        item.key === "sub1" ||
        item.key === "sub10" ||
        item.key === "/" ||
        item.key === "/video" ||
        item.key === "/feedback" ||
        item.key === "/banner"
      );
    } else if (get(user, "name")?.split("@")?.includes("banner")) {
      return item.key === "/banner" || item.key === "/";
    }
  });
  const filteredItems = menus.filter((item) => {
    if (get(user, "name")?.split("@")?.includes("kds")) {
      return (
        item.key === "/" ||
        item.key === "sub2" ||
        item.key === "/inventory" ||
        item.key === "sub10" ||
        item.key === "sub3"
      );
    } else if (get(user, "name")?.split("@")?.includes("frontdesk")) {
      return (
        item.key === "/" ||
        item.key === "sub2" ||
        item.key === "/tablebooking" ||
        item.key === "sub3" ||
        item.key === "sub10"
      );
    } else if (get(user, "name")?.split("@")?.includes("partner")) {
      return (
        item.key === "/" ||
        item.key === "/user" ||
        item.key === "sub2" ||
        item.key === "history" ||
        item.key === "sub10" ||
        item.key === "/feedback" ||
        item.key === "/inventory" ||
        // item.key === "/wallet" ||
        item.key === "/notifications" ||
        item.key === "sub3" ||
        item.key === "sub1" ||
        item.key === "sub5"
      );
    }

    return true;
  });

  const handeLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    sessionStorage.removeItem("selectedKey");
    navigate("/login");
  };

  return (
    <div>
      {!localStorage.getItem("token") ? (
        <LoadingPage />
      ) : (
        <div className="menunavdrawer h-[100vh] mt-[8vh] fixed md:mt-[8vh]   md:flex flex-col justify-between lg:border-r">
          <div
            className="h-[4vh] md:hidden  w-[100vw] flex items-center shadow-[2px]"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <img src={menu} alt="menu" />
          </div>
          <div className="sm:overflow-y-scroll hidden md:block">
            <Menu
              defaultSelectedKeys={get(location, "pathname", "/")}
              mode="inline"
              theme="dark"
              items={
                get(user, "name")?.split("@")?.includes("scratch") ||
                get(user, "name")?.split("@")?.includes("rider")
                  ? supportFilter
                  : get(user, "name")?.split("@")?.includes("kds") ||
                    get(user, "name")?.split("@")?.includes("frontdesk") ||
                    get(user, "name")?.split("@")?.includes("partner")
                  ? filteredItems
                  : get(user, "name")?.split("@")?.includes("menu") ||
                    get(user, "name")?.split("@")?.includes("banner")
                  ? MenuFilter
                  : get(user, "name")?.split("@")?.includes("admin")
                  ? menus
                  : MenuFilter
              }
              className="h-screen"
              defaultOpenKeys={open}
              onOpenChange={(keys) => setOpen(keys)}
            />
          </div>

          <Drawer
            open={modalOpen}
            placement="left"
            onClose={() => {
              setModalOpen(!modalOpen);
            }}
            destroyOnClose
            footer={false}
            closable={false}
            closeIcon={false}
            title={false}
            className=" menudrawer !bg-inherit !w-0"
          >
            <div
              className="fixed flex !items-start  flex-col rounded-r-3xl overflow-hidden h-full
               bg-[#001529] rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-70 border border-gray-100"
            >
              <div
                className="text-white text-end flex justify-end w-full p-2 
     
                "
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              >
                <CloseOutlined
                  // spin={true}#CD5C08
                  style={{
                    fontSize: "18px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <Menu
                defaultSelectedKeys={get(location, "pathname", "/")}
                mode="inline"
                theme="dark"
                items={
                  get(user, "name")?.split("@")?.includes("scratch") ||
                  get(user, "name")?.split("@")?.includes("rider")
                    ? supportFilter
                    : get(user, "name")?.split("@")?.includes("kds") ||
                      get(user, "name")?.split("@")?.includes("frontdesk") ||
                      get(user, "name")?.split("@")?.includes("partner")
                    ? filteredItems
                    : get(user, "name")?.split("@")?.includes("menu") ||
                      get(user, "name")?.split("@")?.includes("banner")
                    ? MenuFilter
                    : menus
                }
                defaultOpenKeys={open}
                onOpenChange={(keys) => setOpen(keys)}
                className="overflow-y-scroll h-screen"
              />
              <div
                className="text-[#CD5C08]  flex justify-center w-full  mt-2 mb-4 hover:text-white  "
                onClick={() => {
                  handeLogout();
                }}
              >
                Logout &nbsp;{" "}
                <LoginOutlined
                  style={{
                    fontSize: "24px",
                    color: "#CD5C08",
                    fontWeight: "bold",
                    hover: {
                      color: "#fff",
                    },
                  }}
                />
              </div>
            </div>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default Sidenavbar;
