import { useGlobalFilter, useSortBy, useTable } from "react-table";

import { request } from "../../../config/helpers/axios-instance";
import OrderItemLayout from "./table-layout";

const Constants = require("./Constants");
const React = require("react");
const Cell = (row) => {
  const changeStatus = async (e) => {
    let status = e.target.value;
    const response = await request({
      method: "PUT",
      url: `cartItem/status/${row.row.original.id}`,
      data: {
        status: status,
      },
    });

    if (response.data.success) {
      console.log(response.data);
    }
  };
  return (
    <div className="flex justify-start w-full gap-2" id="right-bar">
      <select
        className="border border-gray-300 rounded-md p-1"
        defaultValue={row.row.original.status}
        onChange={(e) => {
          changeStatus(e);
        }}>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
};
function OrderItemTable({ tableData }) {
  const [columns, data] = React.useMemo(() => {
    let columns = Constants.COLUMNS;
    columns = [
      ...columns,
      {
        Header: "Action",
        accessor: "action",
        Cell: (row) => Cell(row),
      },
    ];

    return [columns, tableData];
  }, [tableData]);

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy);
  return (
    <>
      {tableData && tableData.length > 0 ? (
        <OrderItemLayout {...tableInstance} />
      ) : (
        <div>Empty</div>
      )}
    </>
  );
}

export { OrderItemTable };
