import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CustomModalForm } from "../../components/custom-modal";
import useModal from "../../hooks/use-modal";
import { TopBar } from "../user/topbar";
import CreateItemForm from "./create-item";

function AdminLayout() {
  const { isShowing: isCreateFormShowing, toggle: toggleCreateForm } =
    useModal();
  const [selectedItem, setSelectedItem] = React.useState(null);
  return (
    <div>
      <TopBar />
      <div className=" container mx-auto mt-2">
        <div className="flex items-center justify-between">
          <div className="flex font-sans">
            <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 ">
              <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
                <NavLink
                  className=" hs-tab-active:bg-white hs-tab-active:text-gray-700 py-3 px-4 inline-flex items-center gap-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 font-medium rounded-md hover:hover:text-blue-600 "
                  id="segment-item-1"
                  to="/admin/products"
                  data-hs-tab="#segment-1"
                  aria-controls="segment-1"
                  role="tab">
                  Products
                </NavLink>

                <NavLink
                  className="hs-tab-active:bg-white hs-tab-active:text-gray-700   py-3 px-4 inline-flex items-center gap-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 font-medium rounded-md hover:hover:text-blue-600  "
                  id="segment-item-2"
                  data-hs-tab="#segment-2"
                  aria-controls="segment-2"
                  to="/admin/orders"
                  role="tab">
                  Orders
                </NavLink>
              </nav>
            </div>
          </div>
          <div className="font-sans">
            <button
              type="button"
              onClick={() => {
                setSelectedItem(null);
                toggleCreateForm();
              }}
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border-2 border-gray-900 font-semibold text-gray-800 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm ">
              Create Item
            </button>
          </div>
        </div>
        <CustomModalForm
          isShowing={isCreateFormShowing}
          hide={toggleCreateForm}
          title="Create User"
          className="modal-form">
          <CreateItemForm
            selectedItem={selectedItem}
            toggleCreateForm={toggleCreateForm}
          />
        </CustomModalForm>

        <Outlet context={[selectedItem, setSelectedItem, toggleCreateForm]} />
      </div>
    </div>
  );
}

export { AdminLayout };
