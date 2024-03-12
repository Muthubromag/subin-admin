/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import { Button, Form, Input, Upload, notification } from "antd";
import axios from "axios";
import { get } from "lodash";

function Charges() {
  const [form] = Form.useForm();

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

      return;
      //   await axios.post(`${process.env.REACT_APP_URL}/create_footer`, data);
      //   notification.success({ message: "Footer settings created successfully" });
      //   fetchData();
    } catch (err) {}
  };

  return (
    <div className="mt-20 pl-3 md:pl-[20vw] text-white">
      <div className="w-[75vw] flex flex-col  lg:flex-row items-center justify-center lg:items-start lg:justify-start gap-5">
        <div className="flex h-[80vh">
          <div className="pt-16">
            <Form
              form={form}
              layout="vertical"
              className="w-[80%] h-[80vh] overflow-y-scroll"
              onFinish={handleFinish}
            >
              <Form.Item
                name="gst"
                label={<h1 className="!text-white pl-2">GST %</h1>}
              >
                <Input
                  type="number"
                  name="gst"
                  placeholder="gst %"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="delivery"
                label={<h1 className="!text-white pl-2">Delivery</h1>}
              >
                <Input
                  type="number"
                  name="delivery"
                  placeholder="delivery"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="package"
                label={<h1 className="!text-white pl-2">Package</h1>}
              >
                <Input
                  type="number"
                  name="package"
                  placeholder="package"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="transaction"
                label={<h1 className="!text-white pl-2">Transaction</h1>}
              >
                <Input
                  type="number"
                  name="transaction"
                  placeholder="transaction"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="dining"
                label={<h1 className="!text-white pl-2">Dining</h1>}
              >
                <Input
                  type="number"
                  name="dining"
                  placeholder="dining"
                  size="large"
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
        </div>
      </div>
    </div>
  );
}

export default Charges;
