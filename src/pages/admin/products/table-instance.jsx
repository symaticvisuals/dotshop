import Cookies from "js-cookie";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import GetItemsBySellerId from "../../../hooks/fetch-all-items-by-seller-id";
import ItemsTaleLayout from "./table-layout";
import { MdDelete, MdEditLocationAlt, MdModeEditOutline } from "react-icons/md";
import { useOutletContext } from "react-router-dom";
import { request } from "../../../config/helpers/axios-instance";

const Constants = require("./Constants");
const React = require("react");
const Cell = (row) => {
  const [selectedItem, setSelectedItem, toggleCreateForm] = useOutletContext();
  const deleteItem = async (id) => {
    const response = await request({
      method: "DELETE",
      url: `item/${id}`,
    });
    return response;
  };
  return (
    <div className="flex justify-start w-full gap-2" id="right-bar">
      <button
        id="create-order"
        className="text-2xl font-sans flex justify-start"
        onClick={() => {
          setSelectedItem(row.row.original);
          toggleCreateForm();
        }}>
        <MdModeEditOutline />
      </button>

      <button
        id="create-order"
        className="text-2xl font-sans flex justify-start"
        onClick={() => {
          deleteItem(row.row.original.id);
        }}>
        <MdDelete />
      </button>
    </div>
  );
};
function ItemsTable({ tableData }) {
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
        <ItemsTaleLayout {...tableInstance} />
      ) : (
        <div>Empty</div>
      )}
    </>
  );
}

export { ItemsTable };
