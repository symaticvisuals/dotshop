import React from "react";
import { useAsyncDebounce } from "react-table";

function OrderItemLayout({
  getTableProps,
  getTableBodyProps,
  headerGroups,
  rows,
  prepareRow,
  state,
  visibleColumns,
  preGlobalFilteredRows,
  setGlobalFilter,
}) {
  return (
    <div className="h-full">
      <table
        key="future-orders"
        {...getTableProps()}
        className="w-full mt-4 p-4 bg-white rounded-2xl font-sans table-auto">
        <thead className="text-left">
          <tr className="my-1">
            <th className="font-sans text-left" colSpan={visibleColumns.length}>
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          {headerGroups.map((headerGroup, id) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={id}
              className="text-left text-sm  h-14 font-sans outline-1 outline-black bg-black text-white">
              {headerGroup.headers.map((column, id) => (
                <th
                  className="font-sans text-left px-4"
                  key={id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="hover:bg-slate-200 text-left pl-3 font-sans odd:bg-slate-100 even:bg-white"
                key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <React.Fragment key={cellIndex}>
                      {cell.column.Header === "Image" ? (
                        <td
                          {...cell.getCellProps()}
                          className="py-2 px-4  text-left  font-sans"
                          key={cellIndex}>
                          <img
                            src={cell.value || ""}
                            className="w-10 h-10"
                            alt="product"
                          />
                        </td>
                      ) : cell.column.Header === "Description" ? (
                        <td
                          {...cell.getCellProps()}
                          className="py-2 px-4  text-left  font-sans truncate ..."
                          key={cellIndex}>
                          {cell.render("Cell")}
                        </td>
                      ) : (
                        <td
                          {...cell.getCellProps()}
                          className="py-2 px-4  text-left  font-sans"
                          key={cellIndex}>
                          {cell.render("Cell")}
                        </td>
                      )}
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderItemLayout;

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="flex gap-4 items-center">
      <input
        value={value || ""}
        className="px-6 w-full font-sans bg-slate-100  py-4"
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "0",
        }}
      />
    </div>
  );
};
