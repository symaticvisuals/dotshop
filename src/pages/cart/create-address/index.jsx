import Cookies from "js-cookie";
import React from "react";
import { HiLockClosed, HiPlus, HiXCircle } from "react-icons/hi2";
import CustomDropDown from "../../../components/autocomplete";
import { request } from "../../../config/helpers/axios-instance";
import GetAllAddressesByUserId from "../../../hooks/get-all-addresses-by-user-id";

function AddressForm({ addressId, setAddressIdHandler }) {
  const [filteredAdd, setFilteredAdd] = React.useState([]);
  const [creationMode, setCreationMode] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [deliveryAddress, setDeliveryAddress] = React.useState({
    name: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    if (Cookies.get("user") !== undefined)
      setUser(JSON.parse(Cookies.get("user")));
  }, []);
  const { data: addresses } = GetAllAddressesByUserId(user ? user.id : null);
  React.useEffect(() => {
    if (addresses?.data?.success) {
      setFilteredAdd(
        addresses.data.data.map((address) => {
          return {
            ...address,
            id: address.id,
            label: `${address.name}`,
            value: address.id,
          };
        })
      );
    }
  }, [addresses]);

  const setAddressField = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const createAddress = async () => {
    await setDeliveryAddress({
      ...deliveryAddress,
      userId: parseInt(JSON.parse(Cookies.get("user")).id),
    });
    try {
      const response = await request({
        method: "POST",
        url: "/address",
        data: {
          ...deliveryAddress,
          userId: parseInt(JSON.parse(Cookies.get("user")).id),
        },
      });
      setAddressIdHandler(response.data.data.id);
      setCreationMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-lg border w-full h-[auto] m-3 p-5">
      <div className="flex flex-col gap-2 gap-2">
        <div className="flex justify-between items-center">
          <h3 className="font-sans text-lg font-bold">Delivery Address</h3>
          {creationMode ? (
            <HiXCircle
              className="text-2xl cursor-pointer border rounded-full border-black"
              onClick={() => setCreationMode(false)}
            />
          ) : (
            <HiPlus
              className="text-2xl cursor-pointer border rounded-full border-black"
              onClick={() => setCreationMode(true)}
            />
          )}
        </div>
        {!creationMode ? (
          <CustomDropDown
            labelStyle="font-sans text-sm font-medium mb-1 "
            outerStyle="border-none focus:border-none focus:ring-0 w-full "
            inputFieldStyle="border border-black w-full focus:outline-none active:outline-none py-3 px-4 rounded-md"
            renderItem="p-2 rounded-md w-full "
            name="address"
            items={filteredAdd}
            onChange={(e) => {
              setAddressIdHandler(e.target.id);
              console.log(e.target);
              setSelectedAddress(e.target);
            }}
            placeholder="Select Address"
          />
        ) : (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Name"
              name="name"
              value={deliveryAddress.name}
              onChange={setAddressField}
              disabled={addressId ? true : false}
            />
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="City"
            name="city"
            value={addressId ? selectedAddress.city : deliveryAddress.city}
            onChange={setAddressField}
            disabled={addressId ? true : false}
          />
          <input
            type="text"
            className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="State"
            name="state"
            value={addressId ? selectedAddress.state : deliveryAddress.state}
            onChange={setAddressField}
            disabled={addressId ? true : false}
          />
        </div>
        <input
          type="text"
          className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Pincode"
          name="pincode"
          onChange={setAddressField}
          value={addressId ? selectedAddress.pincode : deliveryAddress.pincode}
          disabled={addressId ? true : false}
        />
        {addressId && !creationMode && (
          <button
            className="bg-[#FD7F28] w-full border border-black text-black font-sans font-semibold px-3 py-2 rounded-md mt-3 disabled:bg-gray-500 "
            disabled={addressId ? true : false}>
            Added Address
          </button>
        )}
        {creationMode && (
          <button
            className="bg-[#FD7F28] w-full border border-black text-black font-sans font-semibold px-3 py-2 rounded-md mt-3 disabled:bg-gray-500 "
            onClick={createAddress}
            disabled={addressId ? true : false}>
            Add Address
          </button>
        )}
      </div>
    </div>
  );
}

export default AddressForm;
