import moment from "moment";
import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const data = props.data;
  const restaurant = props.footer;
  console.log("sghags--", data, restaurant);
  return (
    <div ref={ref} className="bill_container">
      <h1 className="bill_head"> {restaurant?.name}</h1>
      <div className="bill_center">********NEW ORDER**********</div>
      <div>
        <p>Order {data?.orderId}</p>
      </div>
      <div>
        <p>Ordered By:{data?.customerName}</p>
      </div>
      <div className="bill-row">
        <p>{moment().format("DD-MM-YYYY")}</p>
        <p>{moment().format("hh:mm a")}</p>
      </div>
      <div>==========================================</div>

      <table className="bill_table">
        {data?.orderedFood?.map((od, i) => {
          return (
            <tr key={i} className="bill_table">
              <td className="bill_body1">{od?.foodName}</td>
              <td className="bill_body2">{od?.foodQuantity}</td>
            </tr>
          );
        })}
      </table>

      <div className="bill-row">
        <p>Total {data?.orderedFood?.length}</p>
        <p>Amount {data?.billAmount}</p>
      </div>
    </div>
  );
});
