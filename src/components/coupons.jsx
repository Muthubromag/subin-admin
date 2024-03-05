/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Table,
  Collapse,
  Switch,
  Form,
  Input,
  Modal,
  Upload,
  notification,
  Button,
  Image,
  Spin,
  DatePicker,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  CaretRightOutlined,
  FileAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useSelector } from "react-redux";
import moment from "moment";

function Coupons() {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [data, setData] = useState([]);
  const { Panel } = Collapse;
  const [form] = Form.useForm();
  const [updateId, setUpdateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [active, setActive] = useState("active");
  const [imageKey, setImageKey] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const user = useSelector((state) => state.user.user);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_URL}/getcoupons`);
      setData(get(result, "data.data", []));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleFinish = async (value) => {
    try {
      setLoadingButton(true);
      const data = {
        code: value?.code,
        discountPercentage: value?.discountPercentage,
        validUntil: value?.validUntil,
        status: value?.status,
      };

      const url = updateId
        ? `${process.env.REACT_APP_URL}/updatecoupon/${updateId}`
        : `${process.env.REACT_APP_URL}/createcoupon`;

      const method = updateId ? axios.put : axios.post;

      await method(url, data);

      const successMessage = updateId
        ? "Coupon updated successfully"
        : "Coupon created successfully";

      notification.success({ message: successMessage });
      setUpdateId("");
      form.resetFields();
      fetchData();

      setOpen(!open);

      setIsAvailable(false);
    } catch (err) {
      notification.error({ message: "Something went wrong" });
      if (get(err, "response.data")?.split(" ").includes("exists")) {
        Modal.warning({
          title: get(err, "response.data"),
          content: "Add a new Coupon name",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      }
    } finally {
      setLoadingButton(false);
    }
  };

  const handleEdit = (val) => {
    console.log(val);

    setOpen(!open);

    form.setFieldsValue({
      ...val,
      validUntil: moment(val?.validUntil, "YYYY-MM-DD"),
    });
    setUpdateId(val._id);

    setIsAvailable(val?.status === "active");
  };

  const handleDelete = async (val) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_URL}/deletecoupon/${val._id}`
      );

      notification.success({ message: "Coupon deleted successfully" });
      fetchData();
    } catch (error) {
      notification.error({ message: "Failed to delete Coupon" });
    }
  };

  const handleStatus = async (status, value) => {
    try {
      const formData = {
        code: value.coupon,
        discountPercentage: value.discountPercentage,
        validUntil: value.validUntil,
        status: status ? "active" : "inactive",
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/updatecoupon/${value._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "Status updated successfully" });
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const disabledDate = (current) => {
    const today = moment().startOf("day");
    const twentyFourHoursLater = moment(today).add(24, "hours");

    return current && current < today;
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
      title: <h1 className="text-[10px] md:text-[14px]">Coupon Code</h1>,
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount</h1>,
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}%</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Expiry</h1>,
      dataIndex: "validUntil",
      key: "validUntil",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {moment(name).format("DD-MM-YYYY")}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, value) => {
        return (
          <Switch
            className="text-md"
            checked={status === "active"}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Edit</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <EditNoteOutlinedIcon
            className=" text-green-500 cursor-pointer !text-[24px]"
            onClick={() => handleEdit(values)}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Delete</h1>,
      width: 100,
      align: "center",
      render: (values) => {
        return (
          <DeleteOutlined
            className=" text-red-500 cursor-pointer !text-[18px]"
            onClick={() => handleDelete(values)}
          />
        );
      },
    },
  ];

  const partnerColumns = [
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
      title: <h1 className="text-[10px] md:text-[14px]">Coupon Code</h1>,
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount</h1>,
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}%</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Expiry</h1>,
      dataIndex: "validUntil",
      key: "validUntil",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {moment(name).format("DD-MM-YYYY")}
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Status</h1>,
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, value) => {
        return (
          <Switch
            className="text-md"
            checked={status === "active"}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
      },
    },
  ];

  return (
    <div className="mt-28 md:pl-[20vw]">
      <div className="w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="lg:!w-[78vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">Coupons</h1>
            }
            extra={
              <div
                className="cursor-pointer"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <FileAddOutlined
                  className={`!text-[#CD5C08] !text-xl ${
                    get(user, "name")?.split("@")?.includes("partner")
                      ? "!hidden"
                      : "!block"
                  }`}
                />
              </div>
            }
            key="1"
          >
            <div className="flex flex-col ">
              <div className="flex flex-col gap-y-2">
                <div className="p-2 ">
                  <Spin spinning={loading}>
                    <Table
                      key="id"
                      size="middle"
                      pagination={{
                        pageSize: 5,
                        current: currentPage,
                        onChange: (page) => {
                          setCurrentPage(page);
                        },
                      }}
                      columns={
                        get(user, "name")?.split("@")?.includes("partner")
                          ? partnerColumns
                          : columns
                      }
                      dataSource={data}
                    />
                  </Spin>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      <Modal
        open={open}
        onCancel={() => {
          setOpen(!open);
          form.resetFields();

          setIsAvailable(false);
        }}
        width={400}
        title={<p>{updateId ? "Edit Coupon" : "Add Coupon"}</p>}
        footer={false}
        destroyOnClose
      >
        <Form
          layout="vertical"
          className="pt-3"
          onFinish={handleFinish}
          form={form}
        >
          <Form.Item
            name="code"
            label="Coupon Code"
            rules={[
              {
                required: true,
                message: "Please enter code",
              },
            ]}
          >
            <Input type="text" placeholder="code..." size="large" />
          </Form.Item>
          <Form.Item
            name="discountPercentage"
            label="Discount(%)"
            rules={[
              {
                required: true,
                message: "Please enter discount",
                min: 1,
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              max={100}
              placeholder="discount..."
              size="large"
            />
          </Form.Item>
          <Form.Item label="Coupon Availability" name="status" className="mb-0">
            <Switch
              checked={isAvailable}
              onChange={(checked) => setIsAvailable(checked)}
              style={{
                backgroundColor: isAvailable ? "#1890ff" : "#ccc",
              }}
            />
          </Form.Item>
          <Form.Item
            name="validUntil"
            label="Expiry Date"
            rules={[
              {
                required: true,
                message: "Please choose Date",
              },
            ]}
          >
            <DatePicker
              //   placement="topRight"
              size="large"
              //   defaultValue={moment()}
              //   value={moment()}
              disabledDate={disabledDate}
              onChange={(dates) => {
                form.setFieldsValue({
                  validUntil: dates,
                });
              }}
              suffixIcon={<CalendarOutlined className="booking_input_pic" />}
              placeholder="Select date"
              format={"DD-MM-YYYY"}
              className="antd_input w-full bg-transparent"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex gap-3 items-center justify-end">
              <Button
                className="bg-red-500 text-white"
                onClick={() => {
                  setOpen(!open);
                  form.resetFields();

                  setIsAvailable(false);
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
    </div>
  );
}

export default Coupons;
