/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeUserValues } from "../redux/adminUserSlice";
import { get } from "lodash";
import { items } from "../helper/menu";
import { Drawer, Menu } from "antd";
import { useLocation } from "react-router-dom";
import LoadingPage from "../components/loadingPage";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CloseOutlined, LoginOutlined } from "@ant-design/icons";
import menu from "../assets/menu.png";

function Sidenavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState("");
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [get(location, "pathname", "")]);

  const supportFilter = items.filter((item) => {
    if (get(user, "name")?.split("@")?.includes("scratch")) {
      return item.key === "/scratchcard" || item.key === "/";
    }
  });

  const MenuFilter = items.filter((item) => {
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
  const filteredItems = items.filter((item) => {
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
        item.key === "sub2" ||
        item.key === "history" ||
        item.key === "sub10" ||
        item.key === "/feedback" ||
        item.key === "/inventory" ||
        // item.key === "/wallet" ||
        item.key === "/notifications" ||
        item.key === "sub3" ||
        item.key === "sub1" ||
        item.key === "/tablebooking"
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
        <div className=" h-[92vh] bg-[--secondary-color] mt-[8vh] fixed md:mt-[8vh] lg:mt-[8vh]  md:flex flex-col justify-between lg:border-r">
          <div
            className="h-[4vh] md:hidden  w-[100vw] flex items-center shadow-[2px]"
            onClick={() => {
              setModalOpen(!modalOpen);
            }}
          >
            {/* <MenuIcon className="!text-white" /> */}
            <img src={menu} alt="menu" />
          </div>
          <div className="sm:overflow-y-scroll hidden md:block">
            <Menu
              defaultSelectedKeys={get(location, "pathname", "/")}
              mode="inline"
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
                  ? items
                  : MenuFilter
              }
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
            className="!w-[60vw]"
          >
            <div
              className="fixed flex !items-start lg:pt-2 flex-col rounded-r-3xl h-screen
               bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-70 border border-gray-100"
            >
              <div
                className="text-white text-end flex justify-end w-full p-4 "
                onClick={() => {
                  setModalOpen(!modalOpen);
                }}
              >
                <CloseOutlined
                  // spin={true}#CD5C08
                  style={{
                    fontSize: "22px",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                />
              </div>

              <Menu
                defaultSelectedKeys={get(location, "pathname", "/")}
                mode="inline"
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
                    : items
                }
                defaultOpenKeys={open}
                onOpenChange={(keys) => setOpen(keys)}
              />
              <div
                className="text-[#CD5C08]  flex justify-center w-full p-4 mt-8 hover:text-white  "
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
}

export default Sidenavbar;
