import Cookies from "js-cookie";
import React from "react";
import { request } from "../../config/helpers/axios-instance";
import GetUserOrders from "../../hooks/fetch-all-user-orders";

const ItemRow = (props) => {
  return (
    <div className=" grid grid-cols-5 px-4 ">
      {/* name of item */}
      <p className="text-sm col-span-2 font-medium">{props.item.name}</p>
      {/* price of item */}
      <p className="text-sm font-medium">${props.sellingPrice}</p>
      {/* quantity of item */}
      <p className="text-sm font-medium">{props.quantity}</p>
      <p className="text-sm font-medium">{props.status}</p>
    </div>
  );
};
const OrderCard = (props) => {
  return (
    <div className="border border-black h-auto mt-2  rounded-xl">
      <div className="flex justify-between items-center bg-gray-200 p-4 rounded-xl rounded-b-none">
        <h3 className="text-lg font-medium">#OrderId-{props.id}</h3>
        <span class="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-yellow-500 text-white">
          {props.orderStatus}
        </span>
      </div>
      {/* list of items here */}
      <div className="pt-4 flex flex-col gap-2 pb-4">
        {props.cart.cartItems.map((item) => (
          <ItemRow {...item} />
        ))}
      </div>
    </div>
  );
};

function OrdersPage() {
  const { data: ordersPayload } = GetUserOrders(
    Cookies.get("user") && JSON.parse(Cookies.get("user")).id
  );

  const [filteredOrders, setFilteredOrders] = React.useState([]);
  React.useEffect(() => {
    if (ordersPayload?.data?.success) {
      const filtered = ordersPayload.data.data.filter((order) => order);
      setFilteredOrders(filtered);
    }
  }, [ordersPayload]);
  const changeOrderStatus = async (orderId = 0, initialStatus, status) => {
    console.log(orderId, initialStatus, status);
    if (initialStatus === status) {
      return;
    }
    const response = await request({
      method: "PUT",
      url: `order/status/${orderId}`,
      data: {
        status: status,
      },
    });
    if (response.data.success) {
      console.log(response.data);
    }
  };

  React.useEffect(() => {
    // count the status in the cartItems
    if (!ordersPayload?.data?.success) return;
    let test = ordersPayload?.data?.data?.map((order) => {
      let status = "";
      let statusCount = {
        shipped: 0,
        processing: 0,
        pending: 0,
        delivered: 0,
        cancelled: 0,
      };
      order.cart.cartItems.forEach((item) => {
        statusCount[item.status]++;
      });
      console.log(statusCount);
      // if all the items are shipped
      if (statusCount.shipped === order.cart.cartItems.length) {
        status = "shipped";
      }
      // if all the items are delivered
      else if (statusCount.delivered === order.cart.cartItems.length) {
        status = "delivered";
      }
      // if all the items are cancelled
      else if (statusCount.cancelled === order.cart.cartItems.length) {
        status = "cancelled";
      }
      // if all the items are processing
      else if (statusCount.processing === order.cart.cartItems.length) {
        status = "processing";
      }
      // if all the items are pending
      else if (statusCount.pending === order.cart.cartItems.length) {
        status = "pending";
      }
      // if some items are shipped and some are not
      else if (
        statusCount.shipped > 0 &&
        statusCount.shipped < order.cart.cartItems.length
      ) {
        status = "partially shipped";
      }
      // if some items are delivered and some are not
      else if (
        statusCount.delivered > 0 &&
        statusCount.delivered < order.cart.cartItems.length
      ) {
        status = "partially delivered";
      }
      // if some items are cancelled and some are not
      else if (
        statusCount.cancelled > 0 &&
        statusCount.cancelled < order.cart.cartItems.length
      ) {
        status = "partially cancelled";
      }
      // if some items are processing and some are not
      else if (
        statusCount.processing > 0 &&
        statusCount.processing < order.cart.cartItems.length
      ) {
        status = "partially processing";
      }
      // if some items are pending and some are not
      else if (
        statusCount.pending > 0 &&
        statusCount.pending < order.cart.cartItems.length
      ) {
        status = "partially pending";
      }
      changeOrderStatus(order.id, order.orderStatus, status);
      order.orderStatus = status;
      return order;
    });

    setFilteredOrders(test);
  }, [ordersPayload?.data?.data, ordersPayload?.data?.success]);

  return (
    <div className="mt-3">
      <h1 className="font-sans font-bold text-2xl text-gray-800">Orders</h1>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {filteredOrders.map((order) => (
          <OrderCard {...order} />
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
