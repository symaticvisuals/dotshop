import Cookies from "js-cookie";
import React from "react";
import GetSellerItemOrder from "../../../hooks/get-seller-order-items";
import { OrderItemTable } from "./table-instance";

function AdminOrdersPage() {
  const [tableData, setTableData] = React.useState(null);
  const { data: orderItems } = GetSellerItemOrder(
    JSON.parse(Cookies.get("user")).id
  );
  React.useEffect(() => {
    if (orderItems && orderItems.data.success) {
      setTableData(orderItems.data.data);
    }
  }, [orderItems]);
  return (
    <>
      {tableData && tableData.length > 0 ? (
        <OrderItemTable tableData={tableData} />
      ) : (
        <div>Empty</div>
      )}
    </>
  );
}

export default AdminOrdersPage;
