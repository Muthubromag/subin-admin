/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  notification,
} from "antd";
import axios from "axios";
import { get } from "lodash";

function Charges() {
  const [data, setData] = useState(null);
  const [form] = Form.useForm();

  const fetchCharges = async (load = true) => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_URL}/charges`);
      let charges = get(result, "data.charges", [])?.[0];
      form.setFieldsValue(charges);
      setData(charges);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, []);

  //   useEffect(() => {
  //     form.setFieldsValue({
  //       gst: get(data, "[0].gst"),
  //       delivery: get(data, "[0].delivery"),
  //       packing: get(data, "[0].packing"),
  //       transaction: get(data, "[0].transaction"),
  //       dining: get(data, "[0].dining"),
  //     });
  //   }, [data, form]);

  const handleFinish = async (value) => {
    try {
      console.log({ value });

      await axios.post(`${process.env.REACT_APP_URL}/addCharges`, value);
      setData(value);
      notification.success({ message: "Charges updated successfully" });
    } catch (err) {}
  };

  return (
    <div className="mt-20 pl-3 md:pl-[20vw] text-white">
      <div className="w-[75vw] flex flex-col  lg:flex-row items-center justify-center lg:items-start lg:justify-start gap-5">
        <div className="flex w-full">
          <Form
            form={form}
            layout="vertical"
            className="w-full"
            onFinish={handleFinish}
          >
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["gst", "value"]}
                label={<h1 className="!text-white pl-2">Taxes %</h1>}
                rules={[{ type: "number" }]}
                className="w-[50%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="gst"
                  placeholder="gst"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>

              <Form.Item
                label={<h1 className="ps-3 text-white">Tax Mode</h1>}
                name={["gst", "mode"]}
                className="w-[50%] "
                initialValue={"percentage"}
              >
                <Radio.Group name="mode" defaultValue={"percentage"}>
                  <Radio value="percentage" className="text-white ps-2">
                    Percentage
                  </Radio>
                  <Radio value="fixed" className="text-white ps-1">
                    Fixed
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["packing", "value"]}
                label={<h1 className="!text-white pl-2">Restaurant packing Charges</h1>}
                rules={[{ type: "number" }]}
                className="w-[50%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="packing"
                  placeholder="packing"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>

              <Form.Item
                label={<h1 className="ps-3 text-white">Packing Mode</h1>}
                name={["packing", "mode"]}
                className="w-[50%] "
                initialValue={"percentage"}
              >
                <Radio.Group name="mode" defaultValue={"percentage"}>
                  <Radio value="percentage" className="text-white ps-2">
                    Percentage
                  </Radio>
                  <Radio value="fixed" className="text-white ps-1">
                    Fixed
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["transaction", "value"]}
                label={<h1 className="!text-white pl-2">Platform Fee </h1>}
                rules={[{ type: "number" }]}
                className="w-[50%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="transaction"
                  placeholder="transaction"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>

              <Form.Item
                label={<h1 className="ps-3 text-white">Platform  Mode</h1>}
                name={["transaction", "mode"]}
                className="w-[50%] "
                initialValue={"percentage"}
              >
                <Radio.Group name="mode" defaultValue={"percentage"}>
                  <Radio value="percentage" className="text-white ps-2">
                    Percentage
                  </Radio>
                  <Radio value="fixed" className="text-white ps-1">
                    Fixed
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["dining", "value"]}
                label={<h1 className="!text-white pl-2">Dining</h1>}
                rules={[{ type: "number" }]}
                className="w-[50%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="dining"
                  placeholder="dining"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>

              <Form.Item
                label={<h1 className="ps-3 text-white">Dining Mode</h1>}
                name={["dining", "mode"]}
                className="w-[50%] "
                initialValue={"percentage"}
              >
                <Radio.Group name="mode" defaultValue={"percentage"}>
                  <Radio value="percentage" className="text-white ps-2">
                    Percentage
                  </Radio>
                  <Radio value="fixed" className="text-white ps-1">
                    Fixed
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="text-white">Delivery Charges</div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["delivery", "min_km"]}
                label={<h1 className="!text-white pl-2">Minimum Km</h1>}
                rules={[{ type: "number" }]}
                className="w-[30%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="min_km"
                  placeholder="min"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>
              <Form.Item
                name={["delivery", "min_price"]}
                label={<h1 className="!text-white pl-2">Minimum Price</h1>}
                rules={[{ type: "number" }]}
                className="w-[30%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="min_price"
                  placeholder="min_price"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>
            </div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["delivery", "max_km"]}
                label={<h1 className="!text-white pl-2">Maximum Km</h1>}
                rules={[{ type: "number" }]}
                className="w-[30%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="max_km"
                  placeholder="max"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>
              <Form.Item
                name={["delivery", "max_price"]}
                label={<h1 className="!text-white pl-2">Maximum Price</h1>}
                rules={[{ type: "number" }]}
                className="w-[30%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="max_price"
                  placeholder="max_price"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>
            </div>
            <div className="flex flex-row gap-2 items-center mt-2">
              <Form.Item
                name={["delivery", "extra_charges"]}
                label={<h1 className="!text-white pl-2">Extra Km Charges</h1>}
                rules={[{ type: "number" }]}
                className="w-[30%]"
                initialValue={0}
              >
                <InputNumber
                  type="number"
                  name="extra_charges"
                  placeholder="max"
                  size="large"
                  min={0}
                  className="w-full"
                  defaultValue={0}
                />
              </Form.Item>
            </div>

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
      </div>
    </div>
  );
}

export default Charges;
