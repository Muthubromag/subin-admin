/* eslint-disable react-hooks/exhaustive-deps */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Switch, Upload, notification } from "antd";
import axios from "axios";
import { get } from "lodash";
import { useEffect, useState } from "react";

function FooterSettings({ data, fetchData }) {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    if (get(data, "[0].logo")) {
      setFileList([
        {
          uid: "-1",
          name: "existing_image",
          status: "done",
          url: get(data, "[0].logo"),
        },
      ]);
    }
    form.setFieldsValue({
      name: get(data, "[0].name"),
      number: get(data, "[0].contactNumber"),
      email: get(data, "[0].email"),
      address: get(data, "[0].address"),
      location: get(data, "[0].location"),
      latitude: get(data, "[0].latitude"),
      longitude: get(data, "[0].longitude"),
      veg: get(data, "[0].veg"),
      nonveg: get(data, "[0].nonveg"),
      isDining: get(data, "[0].isDining"),
    });
  }, [data, form]);

  const handleFinish = async (value) => {
    try {
      console.log({ value });

      const data = new FormData();
      data.append("file", get(value, "img.fileList[0].originFileObj"));
      data.append("address", get(value, "address"));
      data.append("email", get(value, "email"));
      data.append("number", get(value, "number"));
      data.append("name", get(value, "name"));
      data.append("latitude", get(value, "latitude"));
      data.append("longitude", get(value, "longitude"));
      data.append("veg", get(value, "veg"));
      data.append("nonveg", get(value, "nonveg"));
      data.append("isDining", get(value, "isDining"));
      if (Object.keys(value?.location)?.length) {
        Object.keys(value?.location).forEach((key) =>
          data.append(key, value?.location?.[key])
        );
      }
      await axios.post(`${process.env.REACT_APP_URL}/create_footer`, data);
      notification.success({ message: "Footer settings created successfully" });
      fetchData();
    } catch (err) {}
  };

  return (
    <div className="pt-16">
      <Form
        form={form}
        layout="vertical"
        className="w-[80%] h-[80vh] overflow-y-scroll"
        onFinish={handleFinish}
      >
        <Form.Item
          name="img"
          label={<h1 className="!text-white pl-2">Enter Restaurant Logo</h1>}
        >
          <Upload
            onPreview={(e) => {}}
            maxCount={1}
            listType="picture-card"
            multiple={false}
            fileList={fileList}
            onChange={handleChange}
          >
            <div>
              <PlusOutlined className="!text-white" />
              <div style={{ marginTop: 8 }} className="text-white">
                Upload
              </div>
            </div>
          </Upload>
        </Form.Item>
        <div className="flex flex-row gap-2 items-center">
          <Form.Item
            name="veg"
            label={<h1 className="!text-white pl-2">Veg Restaurant</h1>}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              name="veg"
              id="veg"
              defaultChecked={true}
              style={{
                backgroundColor: form.getFieldValue("veg") ? "green" : "#bbb",
              }}
            />
          </Form.Item>
          <Form.Item
            name="nonveg"
            label={<h1 className="!text-white pl-2">Non Veg Restaurant</h1>}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              name="nonveg"
              id="nonveg"
              defaultChecked={true}
              style={{
                backgroundColor: form.getFieldValue("nonveg") ? "red" : "#bbb",
              }}
            />
          </Form.Item>
        </div>
        <Form.Item
          name="isDining"
          label={<h1 className="!text-white pl-2">Dining Availability</h1>}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch
            name="isDining"
            id="isDining"
            defaultChecked={true}
            style={{
              backgroundColor: form.getFieldValue("isDining")
                ? "green"
                : "#bbb",
            }}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label={<h1 className="!text-white pl-2">Enter Restaurant Name</h1>}
        >
          <Input type="text" placeholder="Enter name here" size="large" />
        </Form.Item>
        <Form.Item
          name="number"
          label={<h1 className="!text-white pl-2">Enter Contact Number</h1>}
        >
          <Input type="number" placeholder="Enter number here" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label={<h1 className="!text-white pl-2">Enter Restaurant Email</h1>}
        >
          <Input
            type="email"
            placeholder="Enter restaurant mail"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="address"
          label={<h1 className="!text-white pl-2">Enter Restaurant Address</h1>}
        >
          <Input.TextArea
            type="text"
            placeholder="Enter restaurant address"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name={["location", "map_link"]}
          label={<h1 className="!text-white pl-2">Google Map Link</h1>}
        >
          <Input.TextArea
            type="text"
            placeholder="Enter restaurant link"
            size="large"
            name={"map_link"}
            id={"map_link"}
          />
        </Form.Item>
        <Form.Item
          name="latitude"
          label={<h1 className="!text-white pl-2">Enter latitude</h1>}
        >
          <Input type="text" placeholder="Enter latitude here" size="large" />
        </Form.Item>
        <Form.Item
          name="longitude"
          label={<h1 className="!text-white pl-2">Enter longitude</h1>}
        >
          <Input type="text" placeholder="Enter longitude here" size="large" />
        </Form.Item>
        <Form.Item
          name={["location", "embedUrl"]}
          label={<h1 className="!text-white pl-2">Embeded URL</h1>}
        >
          <Input.TextArea
            type="text"
            placeholder="Enter restaurant embed url"
            size="large"
            name={"embedUrl"}
            id={"embedUrl"}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            className="bg-green-500 text-white w-[150px] float-right"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FooterSettings;
