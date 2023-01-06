import Cookies from "js-cookie";
import React from "react";
import GetItemsBySellerId from "../../../hooks/fetch-all-items-by-seller-id";
import GetSellerItemOrder from "../../../hooks/get-seller-order-items";
import { ItemsTable } from "./table-instance";

function ItemsPage() {
  const { data: items } = GetItemsBySellerId(
    JSON.parse(Cookies.get("user")).id
  );
  const [tableData, setTableData] = React.useState(null);
  const { data: orderItems } = GetSellerItemOrder(
    JSON.parse(Cookies.get("user")).id
  );
  React.useEffect(() => {
    if (items && items.data.success) {
      setTableData(items.data.data);
    }
  }, [items]);
  return (
    <>
      {tableData && tableData.length > 0 ? (
        <ItemsTable tableData={tableData} />
      ) : (
        <div>Empty</div>
      )}
    </>
  );
}

export default ItemsPage;
