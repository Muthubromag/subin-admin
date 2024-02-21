/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// pending edit types
import React, { useEffect, useState } from "react";
import {
  Collapse,
  Form,
  Input,
  Select,
  Table,
  Upload,
  Button,
  Image,
  notification,
  Spin,
  Switch,
  Drawer,
  Space,
  Radio,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  CaretRightOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { get, isEmpty } from "lodash";
import axios from "axios";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useSelector } from "react-redux";

function Product() {
  const { Panel } = Collapse;
  const [open, setOpen] = useState(false);
  const [isFoodTypesExist, setIsFoodTypesExist] = useState(false);
  const [isVeg, setIsVeg] = useState(false);
  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const { Option } = Select;
  const [imageUrl, setImageUrl] = useState(null);
  const [updateId, setUpdateId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState([]);
  const [selectedSubCategory, setselectedSubCategory] = useState("");
  const [data, setData] = useState([]);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [filteredSubcategory, setFilteredSubcatrgory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const [dummy, setDummy] = useState(false);
  const user = useSelector((state) => state.user.user);

  const [types, setTypes] = useState([
    { type: "", price: "" },
    { type: "", price: "" },
  ]);

  const handleTypeChange = (index, event) => {
    const newTypes = [...types];
    newTypes[index].type = event.target.value;
    setTypes(newTypes);
  };

  const handlePriceChange = (index, event) => {
    const newTypes = [...types];
    newTypes[index].price = event.target.value;
    console.log(newTypes, "newtypes");
    setTypes(newTypes);
  };

  const addTypeField = () => {
    setTypes([...types, { type: "", price: "" }]);
  };

  const removeTypeField = (index) => {
    const newTypes = [...types];
    newTypes.splice(index, 1);
    setTypes(newTypes);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        `${process.env.REACT_APP_URL}/getcategory`
      );
      const result1 = await axios.get(
        `${process.env.REACT_APP_URL}/getsubcategory`
      );
      const result2 = await axios.get(
        `${process.env.REACT_APP_URL}/getproduct`
      );

      // console.log(result.data, "aaaaaaaaaaaaa")
      // console.log(result1.data, "bbbbbbbbbbbb")
      // console.log(result2.data, "ccccccccccccc")

      setCategory(get(result, "data.data", []));
      setSubCategory(get(result1, "data.data", []));
      setData(get(result2, "data.data", []));
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
    console.log(value, "value");
   
    try {
      setLoadingButton(true);
      const discountedPrice = value.price - value.price * (value.offer / 100);
      const data = new FormData();

      if (updateId !== "") {
        data.append(
          "file",
          get(value, "img.fileList[0].originFileObj") || null
        );
        data.append("image", imageUrl);
      } else {
        data.append("file", get(value, "img.fileList[0].originFileObj"));
      }
      data.append("name", value.name);
      data.append("price", value?.price || "");
      data.append("categoryId", value.categoryId);
      data.append("subCategoryId", value.subCategoryId);
      data.append("isMultiTyped", isFoodTypesExist);
      data.append("types", JSON.stringify(value?.types));
      data.append("isVeg", isVeg);
      data.append(
        "subCategoryName",
        subCategory.filter((res) => {
          return res._id === value.subCategoryId;
        })[0].name
      );
      data.append(
        "categoryName",
        category.filter((res) => {
          return res._id === value.categoryId;
        })[0].name
      );
      data.append("status", value.status || false);
      data.append("offer", value.offer || "");

      // types.forEach((type, index) => {
      //   data.append(`type[${index}]`, type.type);
      //   data.append(`price[${index}]`, type.price);
      // });

      // types.forEach((type, index) => {
      //   data.append(`types[${index}][type]`, type.type);
      //   data.append(`types[${index}][price]`, type.price);
      // });

      const url = updateId
        ? `${process.env.REACT_APP_URL}/updateproduct/${updateId}`
        : `${process.env.REACT_APP_URL}/createproduct`;

      const method = updateId ? axios.put : axios.post;

      await method(url, data);

      const successMessage = updateId
        ? "Product updated successfully"
        : "Product created successfully";
      notification.success({ message: successMessage });
      setUpdateId("");
      form.resetFields();
      fetchData();
      setImageUrl("");
      setOpen(!open);
      setFileList([]);
      setIsAvailable(false);
    } catch (e) {
      if (get(e, "response.data")?.split(" ").includes("limit")) {
        Modal.warning({
          title: get(e, "response.data"),
          content:
            "if you really wanna add Menu you have to delete existing one",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      }

      if (get(e, "response.data")?.split(" ").includes("500")) {
        Modal.warning({
          title: get(e, "response.data"),
          content:
            "if you really wanna add Menu you have to delete existing one",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      } else if (get(e, "response.data")?.split(" ").includes("exists")) {
        Modal.warning({
          title: get(e, "response.data"),
          content: "Add a new menu name",
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

  const populateTypes = (existingTypes) => {
    setTypes(
      existingTypes.map((type) => ({ type: type?.type, price: type?.price }))
    );
  };

  const handleEdit = (values) => {
    console.log("txt", { values });
    setImageUrl(values.image);
    form.setFieldsValue(values);
    setOpen(!open);
    setUpdateId(values._id);
    setCurrentImage(values.image);
    setIsAvailable(values.status);
    setSelectedCategory(values.categoryId);
    setselectedSubCategory(values.subCategoryId);
    if (values?.types && values?.types?.length > 0) {
      populateTypes(values.types);
    }
    setFileList([
      {
        uid: "-1",
        name: "existing_image",
        status: "done",
        url: values.image,
      },
    ]);
  };

  const handleStatus = async (status, value) => {
    try {
      const formData = {
        name: value.name,
        image: value.image,
        status: status,
        active: true,
      };

      await axios.put(
        `${process.env.REACT_APP_URL}/updateproduct/${value._id}`,
        formData
      );
      fetchData();
      notification.success({ message: "Status updated successfully" });
    } catch (err) {
      notification.error({ message: "Something went wrong" });
    }
  };

  const handleDelete = async (val) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/getbanner`
      );

      const isMenuMapped = response.data.data.some(
        (banner) => banner.productId === val._id
      );

      if (isMenuMapped) {
        Modal.warning({
          title: "This Menu Mapped With Banner",
          content: "if you really wanna delete this delete banner first",
          okButtonProps: {
            style: {
              backgroundColor: "blue",
              color: "white",
            },
          },
        });
      } else {
        let data = {
          image: get(val, "image"),
        };
        await axios.delete(
          `${process.env.REACT_APP_URL}/deleteproduct/${val._id}`,
          { data }
        );
        notification.success({ message: "Product deleted successfully" });
        fetchData();
      }
    } catch (error) {
      notification.error({ message: "Failed to delete Subcategory" });
    }
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
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Category</h1>,
      dataIndex: "isVeg",
      key: "isVeg",
      align: "center",
      render: (isVeg) => {
        console.log({ isVeg });
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {isVeg ? "Veg" : "Non Veg"}
          </h1>
        );
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Types</h1>,
      key: "types",
      dataIndex: "types",
      align: "center",
      render: (_, record) => (
        <div>
          {record.types.map((type, index) => {
            return <p key={index}>{`${index + 1}: ${type.Type}`}</p>;
          })}
        </div>
      ),
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Original Price</h1>,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price, wholeData) => {
        console.log("nameeeeeeeeeeeeeee-------11", wholeData?.types);
        return (
          <>
            {price && price !== "undefined" && Number(price) ? (
              <h1 className="text-[10px] md:text-[14px]">{price}</h1>
            ) : (
              <div>
                {wholeData?.types.map((type, index) => {
                  console.log("type", type);
                  return <p key={index}>{`${type?.TypePrice}`}</p>;
                })}
              </div>
            )}
          </>
        );
      },
    },

    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount</h1>,
      dataIndex: "offer",
      key: "offer",
      align: "center",
      render: (singleDiscount, wholeData) => {
        console.log("the whole dataaaaaaaaaaa", wholeData);
        // return <h1 className="text-[10px] md:text-[14px]">{singleDiscount}%</h1>;
        return (
          <>
            {wholeData?.types && wholeData?.types?.length !== 0 ? (
              <div>
                {wholeData.types.map((type, index) => {
                  return <p key={index}>{`${type.TypeOfferPercentage}%`}</p>;
                })}
              </div>
            ) : (
              <h1 className="text-[10px] md:text-[14px]">{singleDiscount}%</h1>
            )}
          </>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount Price</h1>,
      dataIndex: "discountPrice",
      key: "discountPrice",
      align: "center",
      render: (singleDiscountPrice, wholeData) => {
        return (
          <>
            {wholeData?.types && wholeData?.types?.length !== 0 ? (
              <div>
                {wholeData.types.map((type, index) => {
                  return <p key={index}>{`${type.TypeOfferPrice}`}</p>;
                })}
              </div>
            ) : (
              <h1 className="text-[10px] md:text-[14px]">
                {singleDiscountPrice}
              </h1>
            )}
          </>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Cuisine Name</h1>,
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              category.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Subcuisine Name</h1>,
      dataIndex: "subCategoryId",
      key: "subCategoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              subCategory.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
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
            className="text-[10px] md:text-[14px]"
            checked={status}
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
            onClick={() => {
              handleEdit(values);
            }}
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
      title: <h1 className="text-[10px] md:text-[14px]">Image</h1>,
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (name) => {
        return (
          <Image
            alt="logo"
            className="!w-[80px] border-2 border-[#CD5C08] h-auto rounded-md"
            src={name}
          />
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Name</h1>,
      dataIndex: "name",
      key: "name",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Original Price</h1>,
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount</h1>,
      dataIndex: "offer",
      key: "offer",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}%</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Discount Price</h1>,
      dataIndex: "discountPrice",
      key: "discountPrice",
      align: "center",
      render: (name) => {
        return <h1 className="text-[10px] md:text-[14px]">{name}</h1>;
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Cuisine Name</h1>,
      dataIndex: "categoryId",
      key: "categoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              category.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Subcuisine Name</h1>,
      dataIndex: "subCategoryId",
      key: "subCategoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              subCategory.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
          </h1>
        );
      },
    },
    {
      title: <h1 className="text-[10px] md:text-[14px]">Subcuisine Name</h1>,
      dataIndex: "subCategoryId",
      key: "subCategoryId",
      align: "center",
      render: (name) => {
        return (
          <h1 className="text-[10px] md:text-[14px]">
            {
              subCategory.filter((res) => {
                return res._id === name;
              })[0]?.name
            }
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
            className="text-[10px] md:text-[14px]"
            checked={status}
            onChange={(checked) => handleStatus(checked, value)}
          />
        );
      },
    },
  ];

  const handleSubcategoryFilter = (e) => {
    setDummy(true);
    const temp = subCategory;
    setFilteredSubcatrgory(
      temp.filter((res) => {
        return res.categoryId === e;
      })
    );
  };

  return (
    <div className="mt-28 md:pl-[20vw]">
      <div className="w-[95vw] md:w-[80vw]">
        <Collapse
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              rotate={isActive ? 90 : 0}
              className="!text-[#CD5C08]"
            />
          )}
          collapsible="icon"
          className="md:!w-[78vw]"
        >
          <Panel
            header={
              <h1 className="text-md !text-[#CD5C08] font-semibold">Menu</h1>
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
                scroll={{ x: 400 }}
              />
            </Spin>
          </Panel>
        </Collapse>

        <Drawer
          open={open}
          destroyOnClose
          title={updateId ? "Edit Menu" : "Add Menu"}
          onClose={() => {
            setOpen(!open);
            form.resetFields();
            setImageUrl(null);
            setIsAvailable(false);
            setFileList([]);
            setUpdateId("");
          }}
        >
          <Form onFinish={handleFinish} layout="vertical" form={form}>
            <Form.Item
              label="Cuisine Name"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please Choose a category name",
                },
              ]}
            >
              <Select
                placeholder="Select Category"
                size="large"
                onChange={(e) => {
                  setSelectedCategory(e);
                  handleSubcategoryFilter(e);
                }}
              >
                {category.map((res, i) => {
                  return (
                    <Option value={res._id} key={i}>
                      {res?.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.Item
              label="Subcuisine Name"
              name="subCategoryId"
              rules={[
                {
                  required: true,
                  message: "Please choose a category name",
                },
              ]}
            >
              <Select
                placeholder="Select SubCategory"
                size="large"
                onChange={(e) => {
                  setselectedSubCategory(e);
                }}
              >
                {isEmpty(filteredSubcategory) && !dummy
                  ? subCategory.map((res, i) => (
                      <Option value={res._id} key={i}>
                        {res.name}
                      </Option>
                    ))
                  : filteredSubcategory.map((res, i) => (
                      <Option value={res._id} key={i}>
                        {res.name}
                      </Option>
                    ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Menu Name"
              rules={[
                {
                  required: true,
                  message: "Please enter subCategory",
                },
              ]}
            >
              <Input type="text" placeholder="Product name..." size="large" />
            </Form.Item>

            {/* <Button onClick={()=>setIsFoodTypesExist(!isFoodTypesExist)}>Toggle</Button> */}
            <div className="flex justify-center items-center gap-4">
              <Switch
                default
                checked={isVeg}
                checkedChildren="Veg"
                unCheckedChildren="Non-Veg"
                className={`mb-10 w-32`}
                onChange={() => {
                  setIsVeg(!isVeg);
                }}
                style={{ backgroundColor: isVeg ? "#008000" : "#FF0000" }}
              />

              <Switch
                checked={isFoodTypesExist}
                checkedChildren="Multiple Type"
                unCheckedChildren="Single Type"
                className={`mb-10 w-32 `}
                onChange={() => {
                  setIsFoodTypesExist(!isFoodTypesExist);
                }}
                style={{
                  backgroundColor: isFoodTypesExist ? "#CD5C08" : "#000000",
                }}
              />
            </div>

            {!isFoodTypesExist && (
              <>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    {
                      required: true,
                      message: "Please enter price",
                    },
                  ]}
                >
                  <Input type="number" placeholder="Price..." size="large" />
                </Form.Item>
                <Form.Item
                  name="offer"
                  label="Offer"
                  initialValue={0}
                  rules={[
                    {
                      required: false,
                      message: "Please enter offer",
                    },
                  ]}
                >
                  <Input type="number" placeholder="offer..." size="large" />
                </Form.Item>
              </>
            )}

            {/*  */}

            {isFoodTypesExist && (
              <>
                <Form.List name="types" initialValue={[""]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <div key={index}>
                          {/* style={{ display: 'flex', marginBottom: 8 }} */}
                          <Space
                            key={key}
                            align="baseline"
                            className="form-commodity-row"
                          >
                            <Form.Item
                              {...restField}
                              label=""
                              name={[name, "Type"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Enter Valid Type",
                                  pattern: /^[A-Za-z\s]+$/,
                                },
                              ]}
                            >
                              <Input placeholder="Type" />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              type="number"
                              name={[name, "TypePrice"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Enter Valid Price",
                                  pattern: new RegExp(/^[0-9]+$/),
                                },
                              ]}
                            >
                              <Input placeholder="Price" />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, "TypeOfferPercentage"]}
                              initialValue={0}
                              rules={[
                                {
                                  required: true,
                                  message: "Enter valid Offer Percentage",
                                  pattern: new RegExp(
                                    /^[0-9]$|^[1-9][0-9]?$|^99$/
                                  ),
                                },
                              ]}
                            >
                              <Input placeholder="Offer" />
                            </Form.Item>

                            <MinusCircleOutlined
                              className="minus-circle"
                              onClick={() => remove(name)}
                            />
                          </Space>
                        </div>
                      ))}
                      <Form.Item className="mt-3 text-center">
                        <Button
                          shape="round"
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                        >
                          Add More Type
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                {/* {
                  types.map((type, index) => (
              <div key={index} className="flex items-center gap-2 ">
                <Form.Item
                  label={`Type ${index + 1}`}
                  name={["types", index, "type"]}
                  key={`type${index}`}
                >
                  {" "}
                  <Input
                    type="text"
                    placeholder="Type name..."
                    size="large"
                      
                    onChange={(e) => handleTypeChange(index, e)}
                  />
                </Form.Item>
                <Form.Item
                  label={`Price ${index + 1}`}
                  name={["types", index, "price"]}
                  key={`price${index}`}
                >
                  {" "}
                  <Input
                    type="number"
                    placeholder="Price"
                    className=" px-3 py-2 border rounded-lg"
                    value={type?.price}
                    onChange={(e) => handlePriceChange(index, e)}
                  />
                </Form.Item>
                <button
                  type="button"
                  onClick={() => removeTypeField(index)}
                  className="px-3 py-2 bg-red-500  rounded-full mt-1 text-white"
                  >
                  X
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addTypeField}
              className="px-2 py-2 bg-gray-500 text-white rounded-lg"
            >
              Add Type
                </button> */}
              </>
            )}

            {/*  */}
            <Form.Item
              label="Menu Availability"
              name="status"
              className="mb-0 mt-2"
            >
              <Switch
                checked={isAvailable}
                onChange={(checked) => setIsAvailable(checked)}
              />
            </Form.Item>

            <Form.Item
              name="img"
              rules={[
                {
                  required: updateId === "" ? true : false,
                  message: "Select menu image",
                },
              ]}
            >
              <Upload
                onChange={handleChange}
                fileList={fileList}
                onPreview={(e) => {}}
                maxCount={10} // Set your preferred maximum count here
                listType="picture-card"
                multiple={true} // Allow multiple file selection
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <div className="flex gap-3 items-center justify-end">
                <Button
                  className="bg-red-500 text-white"
                  onClick={() => {
                    setOpen(!open);
                    form.resetFields();
                    setImageUrl("");
                    setUpdateId("");
                    setIsAvailable(false);
                    setFileList([]);
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
        </Drawer>
      </div>
    </div>
  );
}

export default Product;
