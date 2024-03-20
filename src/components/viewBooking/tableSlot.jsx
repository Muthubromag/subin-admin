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
} from "antd";
import React, { useEffect, useState } from "react";
import {
  FileAddOutlined,
  PlusOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { get } from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useSelector } from "react-redux";
import { Card } from "antd";
import moment from "moment";
import { generateTimeSlots } from "../../utils/util";
const { Meta } = Card;

const { Option } = Select;
function TableSlot() {
  const refresher = useSelector((state) => state.user.refreshData);
  const slotsOptions = generateTimeSlots({ interval: 2 });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);
  const { Panel } = Collapse;
  const user = useSelector((state) => state.user.user);
  const [fileList, setFileList] = useState([]);
  const [imageKey, setImageKey] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`${process.env.REACT_APP_URL}/gettable`);

      setTableData(get(result, "data.data", []));
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

  const handleEdit = (values) => {
    setUpdateId(values._id);
    setImageUrl(values.image);
    setCurrentImage(values.image);
    form.setFieldsValue({
      ...values,
      timeSlots: values?.timeSlots.map((td) => td?.time),
    });
    setOpen(!open);
    setImageKey(values.table_image_key);
    setFileList([
      { uid: "-1", name: "existing_image", status: "done", url: values.image },
    ]);
  };

  const handleDelete = async (val) => {
    try {
      let data = {
        image: get(val, "image"),
      };
      await axios.delete(
        `${process.env.REACT_APP_URL}/deletetable/${val._id}`,
        { data }
      );
      notification.success({ message: "Table deleted successfully" });
      fetchData();
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  return (
    <div className="pt-28 md:pl-[20vw] w-[96vw] md:w-[85vw] ">
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
                className="cursor-pointer"
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
                <div className="flex gap-10  items-center justify-center flex-wrap md:justify-start  !overflow-x-scroll">
                  {tabledata &&
                    tabledata.map((res, i) => {
                      return (
                        <Card
                          style={{
                            width: 260,
                            backgroundColor: "black",
                            color: "white",
                            textAlign: "center",
                          }}
                          key={i}
                          cover={
                            <div className="h-[170px]">
                              <img
                                alt="example"
                                src={res.image}
                                className="h-[100%] w-[100%] p-3"
                              />
                            </div>
                          }
                          actions={[
                            <EditNoteIcon
                              key="edit"
                              className={`!text-green-500 cursor-pointer ${
                                get(user, "name", "")
                                  .split("@")
                                  .includes("frontdesk") ||
                                get(user, "name", "")
                                  .split("@")
                                  .includes("partner")
                                  ? "pointer-events-none"
                                  : "pointer-events-auto"
                              }`}
                              onClick={() => {
                                handleEdit(res);
                              }}
                            />,
                            <DeleteIcon
                              key="delete"
                              onClick={() => {
                                handleDelete(res);
                              }}
                              className={`!text-red-500 cursor-pointer ${
                                get(user, "name", "")
                                  .split("@")
                                  .includes("frontdesk") ||
                                get(user, "name", "")
                                  .split("@")
                                  .includes("partner")
                                  ? "pointer-events-none"
                                  : "pointer-events-auto"
                              }`}
                            />,
                            <Button
                              className={`!text-white ${
                                res.status === true
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              } border-none text-[12px] !w-[70px] !h-[30px]`}
                            >
                              {res.status === true ? "Booked" : "Available"}
                            </Button>,
                          ]}
                        >
                          <Meta
                            title={`Table:${res.tableNo}`}
                            description={`${res.seatsAvailable} Seaters`}
                          />
                        </Card>
                      );
                    })}
                </div>
              </div>
            </Spin>
          </Panel>
        </Collapse>
      </div>
      <div className="inline lg:hidden">
        <Spin spinning={loading}>
          <div className="!h-[68vh]">
            <div className="flex gap-10  items-center justify-center flex-wrap md:justify-start  !overflow-x-scroll">
              {tabledata &&
                tabledata.map((res, i) => {
                  return (
                    <Card
                      style={{
                        width: 260,
                        backgroundColor: "white",
                        color: "black",
                        textAlign: "center",
                      }}
                      key={i}
                      cover={
                        <div className="h-[170px]">
                          <img
                            alt="example"
                            src={res.image}
                            className="h-[100%] w-[100%] p-3"
                          />
                        </div>
                      }
                      actions={[
                        <EditNoteIcon
                          key="edit"
                          className={`!text-green-500 cursor-pointer ${
                            get(user, "name", "")
                              .split("@")
                              .includes("frontdesk") ||
                            get(user, "name", "").split("@").includes("partner")
                              ? "pointer-events-none"
                              : "pointer-events-auto"
                          }`}
                          onClick={() => {
                            handleEdit(res);
                          }}
                        />,
                        <DeleteIcon
                          key="delete"
                          onClick={() => {
                            handleDelete(res);
                          }}
                          className={`!text-red-500 cursor-pointer ${
                            get(user, "name", "")
                              .split("@")
                              .includes("frontdesk") ||
                            get(user, "name", "").split("@").includes("partner")
                              ? "pointer-events-none"
                              : "pointer-events-auto"
                          }`}
                        />,
                        <Button
                          className={`!text-white ${
                            res.status === true ? "bg-red-500" : "bg-green-500"
                          } border-none text-[12px] !w-[70px] !h-[30px]`}
                        >
                          {res.status === true ? "Booked" : "Available"}
                        </Button>,
                      ]}
                    >
                      <Meta
                        title={`Table:${res.tableNo}`}
                        description={`${res.seatsAvailable} Seaters`}
                      />
                    </Card>
                  );
                })}
            </div>
          </div>
        </Spin>
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
    </div>
  );
}

export default TableSlot;
