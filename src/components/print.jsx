import moment from "moment";
import React, { forwardRef } from "react";
import Logo from "../assets/logo2.png";
export const ComponentToPrint = forwardRef(
  ({ data, restaurant, type }, ref) => {
    // const data = props.data;
    // const restaurant = props.footer;
    // const type = props.type;

    // console.log("sghags--", data, restaurant);

    return type === "kot" ? (
      <div ref={ref} className="bill_container">
        <h1 className="bill_head uppercase"> {restaurant?.name}</h1>
        <div className="bill_center">********** KOT **********</div>
        <div className="bill-row">
          <p className="item_text">Order </p>
          <p className="item_text">{data?.orderId}</p>
        </div>
        {data?.tableNo ? (
          <div className="bill-row">
            <p className="item_text">Table </p>
            <p className="item_text">{data?.tableNo}</p>
          </div>
        ) : null}

        <div className="bill-row">
          <p className="item_text">Ordered By </p>
          <p className="item_text">BROMAG</p>
        </div>
        <div className="bill-row">
          <p className="item_text">{moment().format("DD-MM-YYYY")}</p>
          <p className="item_text">{moment().format("hh:mm a")}</p>
        </div>
        <div>==========================================</div>

        <table className="bill_table">
          <thead className="bill-margin">
            <th className="bill-50 item_text bill_left body_padding">Item</th>
            <th className="bill-50 item_text bill_center body_padding">Qty</th>
          </thead>
          <tbody>
            {data?.orderedFood?.map((od, i) => {
              let instruction =
                data?.orderType === "call"
                  ? od?.instruction
                  : data?.orderType === "online"
                  ? data?.instructions?.[0]?.[od?.id]
                  : data?.instructionsTakeaway?.[0]?.[od?.id];
              console.log({ instruction });
              return (
                <>
                  <tr key={i} className="bill_table">
                    <td className="bill_body1  item_text body_padding">
                      {od?.foodName}
                    </td>
                    <td className="bill_body2 item_text body_padding bill_center">
                      {od?.foodQuantity}
                    </td>
                  </tr>
                  {instruction?.length ? (
                    <tr className="bill_center bill_table  ">
                      <td className="bill_instruction body_padding" colSpan={2}>
                        Instruction : {instruction?.toString()}
                      </td>
                    </tr>
                  ) : null}
                </>
              );
            })}
          </tbody>
          <tfoot>
            <th className="bill-50 item_text bill_left body_padding">Total</th>
            <th className="bill-50 item_text bill_center body_padding">
              {data?.orderedFood?.length}
            </th>
          </tfoot>
        </table>
      </div>
    ) : (
      <div ref={ref} className="bill_container">
        <h1 className="bill_head uppercase"> {restaurant?.name}</h1>
        <div className="bill_center">********** BILL **********</div>
        <div className="bill-row">
          <p className="item_text">Order </p>
          <p className="item_text">{data?.orderId}</p>
        </div>

        <div className="bill-row">
          <p className="item_text">Ordered By </p>
          <p className="item_text">BROMAG</p>
        </div>
        <div className="bill-row">
          <p className="item_text">{moment().format("DD-MM-YYYY")}</p>
          <p className="item_text">{moment().format("hh:mm a")}</p>
        </div>
        {data?.tableNo ? (
          <div className="bill-row">
            <p className="item_text">Table </p>
            <p className="item_text">{data?.tableNo}</p>
          </div>
        ) : null}
        <div>==========================================</div>

        <table className="bill_table">
          <thead className="bill-margin">
            <th className=" item_text bill_left body_padding">Item</th>
            <th className=" item_text bill_center body_padding">Qty</th>
            <th className=" item_text bill_right body_padding">Price</th>
          </thead>
          <tbody>
            {data?.orderedFood?.map((od, i) => {
              return (
                <>
                  <tr key={i} className="bill_table">
                    <td className="item_text body_padding">{od?.foodName}</td>
                    <td className="item_text body_padding bill_center">
                      {od?.foodQuantity}
                    </td>
                    <td className="item_text body_padding bill_center">
                      {Number(od?.foodQuantity) * Number(od?.foodPrice)}
                    </td>
                  </tr>
                </>
              );
            })}

            <tr className="bill_table">
              <td colSpan={2} className="item_text body_padding">
                Taxes
              </td>

              <td className="item_text body_padding bill_center">
                {data?.gst}
              </td>
            </tr>
            {data?.couponAmount ? (
              <tr className="bill_table">
                <td colSpan={2} className="item_text body_padding">
                  Coupon discount
                </td>

                <td className="item_text body_padding bill_center">
                  - {data?.couponAmount}
                </td>
              </tr>
            ) : null}
            {!data?.tableNo &&
            (data?.transaction_charge || data?.transactionCharge) ? (
              <tr className="bill_table">
                <td colSpan={2} className="item_text body_padding">
                  Platform Fee
                </td>

                <td className="item_text body_padding bill_center">
                  {data?.transaction_charge || data?.transactionCharge}
                </td>
              </tr>
            ) : null}
            {((data?.orderType === "call" &&
              data?.deliveryStatus === "Delivery") ||
              data?.orderType === "online") &&
            data?.deliveryCharge ? (
              <tr className="bill_table">
                <td colSpan={2} className="item_text body_padding">
                  Delivery Charges
                </td>

                <td className="item_text body_padding bill_center">
                  {data?.deliveryCharge}
                </td>
              </tr>
            ) : null}
            {!data?.tableNo && (data?.packing_charge || data?.packingCharge) ? (
              <tr className="bill_table">
                <td colSpan={2} className="item_text body_padding">
                  Packing Charges
                </td>

                <td className="item_text body_padding bill_center">
                  {data?.packing_charge || data?.packingCharge}
                </td>
              </tr>
            ) : null}
          </tbody>
          <tfoot>
            <th className="bill-50 item_text bill_left body_padding">Total</th>
            <th className="bill-50 item_text bill_center body_padding">
              {data?.orderedFood?.length}
            </th>
            <th className="bill-50 item_text bill_center body_padding">
              {data?.orderType === "call" ? data?.grandTotal : data?.billAmount}
            </th>
          </tfoot>
        </table>
      </div>
    );
  }
);
