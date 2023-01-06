import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import _ from "lodash";
import React from "react";
import { TextField } from "../../../components/text-field";
import { request } from "../../../config/helpers/axios-instance";
import { checkSafe } from "../../../config/helpers/parser";
import GetAllCategories from "../../../hooks/fetch-all-categories";
import GetItemsBySellerId from "../../../hooks/fetch-all-items-by-seller-id";
const Constants = require("./Constants");
function CreateItemForm({ selectedItem, toggleCreateForm }) {
  const { data: categories } = GetAllCategories();
  const { refetch } = GetItemsBySellerId(JSON.parse(Cookies.get("user")).id);
  const createItem = async (data) => {
    const response = await request({
      method: "POST",
      url: "item",
      data,
    });
    return response;
  };

  const updateItem = async (data) => {
    const filteredData = _.pick(data, ["id", ...Constants.NOT_NULL_SCHEMA]);
    console.log(filteredData);
    if (filteredData.id) {
      const response = await request({
        method: "PUT",
        url: `item/${filteredData.id}`,
        data: filteredData,
      });
      return response;
    }
  };

  const onSubmit = async (values) => {
    values.sellerId = JSON.parse(Cookies.get("user")).id;
    const safeResponse = checkSafe(
      values,
      Constants.ITEM_SCHEMA,
      Constants.NOT_NULL_SCHEMA
    );
    if (!safeResponse.success) {
      alert(safeResponse.message);
      return;
    }
    if (selectedItem) {
      const response = await updateItem(safeResponse.data);
      if (response.data.success) {
        toggleCreateForm();
      } else {
        alert("Something went wrong. Please try again later.");
      }
      return;
    }
    const response = await createItem(safeResponse.data);
    if (response.data.success) {
      toggleCreateForm();
      refetch();
    } else {
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="p-5 font-sans">
      <h1 className="font-bold text-xl">Create Item</h1>
      <Formik
        initialValues={selectedItem || Constants.initialValues}
        enableReinitialize
        onSubmit={onSubmit}>
        {(props) => (
          <Form>
            <div className="mt-3 grid grid-cols-1 gap-4 items-center  py-0">
              <div className="grid-cols-1 grid gap-2">
                <TextField
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="Lorem, ipsum."
                  value={props.values.name}
                />
                <TextField
                  label="Description"
                  name="description"
                  type="text"
                  placeholder="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, ipsam?"
                  value={props.values.description}
                />
                <TextField
                  label="Price($)"
                  name="price"
                  type="number"
                  placeholder="100"
                  value={props.values.price}
                />
                <TextField
                  label="Image URL"
                  name="image"
                  type="url"
                  placeholder="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-finish-unselect-gallery-1-202212_GEO_EMEA_FMT_WHH?wid=1280&hei=720&fmt=jpeg&qlt=90&.v=1668550429908"
                  value={props.values.image}
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  placeholder="100"
                  value={props.values.quantity}
                />
                <h6 className="font-sans text-sm font-medium">Category</h6>
                <div className="border-black p-2 border rounded-md">
                  <select
                    name="categoryId"
                    id=""
                    defaultValue={
                      selectedItem
                        ? (props.categoryId = selectedItem.categoryId)
                        : (props.values.categoryId =
                            categories?.data?.data[0].id)
                    }
                    onChange={(e) => {
                      props.setFieldValue("categoryId", e.target.value);
                    }}
                    className="w-full p-0 m-0 focus:outline-none active:outline-none border-none active:border-none focus:border-none focus:ring-0">
                    {categories?.data?.data.map((category) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-[#FD7F28] w-full border border-black text-black font-sans font-semibold px-3 py-2 rounded-md mt-3 ">
                  {selectedItem ? "Update Product" : "Create Product"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateItemForm;
