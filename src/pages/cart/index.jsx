import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";
import React from "react";
import { useOutletContext } from "react-router-dom";
import CustomDropDown from "../../components/autocomplete";
import BreadCrump from "../../components/breadcrump";
import { request } from "../../config/helpers/axios-instance";
import GetAllItems from "../../hooks/fetch-all-items";
import GetItemsByItemIds from "../../hooks/fetch-item-by-item-id";
import GetAllAddressesByUserId from "../../hooks/get-all-addresses-by-user-id";
import AddressForm from "./create-address";
import CartItem from "./items";

function Cart() {
  const { data: items } = GetAllItems();
  const { isAuthenticated, loginWithPopup } = useAuth0();
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [cartItems, setCartItems] = useOutletContext();
  const [addressId, setAddressId] = React.useState(null);
  const [filteredPayload, setFilteredPayload] = React.useState([]);
  const [deliveryCharge, setDeliveryCharge] = React.useState(20);
  const [promo, setPromo] = React.useState({
    code: "",
    id: 0,
  });
  const [discount, setDiscount] = React.useState(0);

  React.useEffect(() => {
    if (items?.data?.success) {
      const filtered = items.data.data.filter((item) =>
        cartItems.find((cartItem) => cartItem.id === item.id)
      );
      setFilteredItems(filtered);
    }
  }, [cartItems, items]);

  React.useEffect(() => {
    if (filteredItems) {
      const filtered = filteredItems.map((item) => {
        const findItem = cartItems.find((cartItem) => cartItem.id === item.id);
        return {
          id: item.id,
          quantity: findItem?.quantity,
          price: item.price,
          sellerId: item.sellerId,
        };
      });
      setFilteredPayload(filtered);
    }
  }, [cartItems, filteredItems]);

  const calculateSubTotal = () => {
    let total = 0;
    filteredPayload.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const calculateTax = () => {
    return calculateSubTotal() * 0.05;
  };

  const calculateTotal = () => {
    return parseFloat(
      calculateSubTotal() + calculateTax() + deliveryCharge - discount
    ).toFixed(2);
  };

  const setAddressIdHandler = (id) => {
    setAddressId(id);
  };
  const createCart = async () => {
    if (!isAuthenticated) {
      await loginWithPopup();
      return;
    }
    try {
      let subTotal = calculateSubTotal();
      const response = await request({
        url: "cart",
        method: "POST",
        data: {
          userId: JSON.parse(Cookies.get("user")).id,
          subtotal: subTotal,
        },
      });
      if (response.data.success) {
        const cartId = response.data.data.id;
        return cartId;
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const createOrder = async () => {
    let cartId = await createCart();
    try {
      if (cartId) {
        const orderResponse = await request({
          url: "order",
          method: "POST",
          data: {
            userId: JSON.parse(Cookies.get("user")).id,
            cartId,
            addressId,
            total: calculateTotal(),
            tax: calculateTax(),
            discount,
            deliveryCharge,
            couponId: parseInt(promo.id),
          },
        });
        if (orderResponse.data.success) {
          console.log("order created");
          createCartItems(cartId);
        }
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  const createCartItems = async (cartId) => {
    let orderId = await createCart();
    try {
      if (orderId) {
        const cartitems = filteredPayload.map((item) => {
          return {
            cartId,
            itemId: item.id,
            quantity: item.quantity,
            sellingPrice: item.price,
            orderId: orderId,
            sellerId: item.sellerId,
          };
        });
        const cartItemsResponse = await request({
          url: "cartItem/bulk",
          method: "POST",
          data: cartitems,
        });
        if (cartItemsResponse.data.success) {
          console.log("cart items created");
          localStorage.setItem("cartItems", JSON.stringify([]));
          setCartItems([]);
        } else {
          console.log("cart items not created");
        }
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <div className="mt-5">
        <BreadCrump />
        <h1 className="font-sans text-3xl font-bold text-gray-800">
          Shopping Cart
        </h1>
        <div className="grid grid-cols-4 gap-[50px]">
          <div className=" col-span-3 ">
            {filteredItems.length === 0 && (
              <div className="flex justify-center items-center h-[80vh]">
                <h1 className="font-sans text-3xl font-bold text-gray-800">
                  Your cart is empty
                </h1>
              </div>
            )}
            {filteredItems &&
              filteredItems.map((item, key) => (
                <CartItem key={key} card={item} />
              ))}
          </div>
          {filteredItems.length > 0 && (
            <div className=" col-span-1 sticky top-10  h-[80vh] w-full ">
              {isAuthenticated && (
                <AddressForm
                  setAddressIdHandler={setAddressIdHandler}
                  addressId={addressId}
                />
              )}
              <div className="rounded-lg border w-full h-[auto] m-3 p-5">
                <div className="gap-2">
                  <h3 className="font-sans text-4xl font-bold mt-10">
                    ${calculateTotal()}
                  </h3>
                  <div className="flex justify-between mt-5">
                    <h5 className="font-serif text-xl font-semibold">
                      Subtotal
                    </h5>
                    <h5 className="font-sans text-xl text-right font-bold">
                      ${calculateSubTotal()}
                    </h5>
                  </div>
                  <div className="flex justify-between mt-2">
                    <h5 className="font-serif text-xl font-semibold">
                      Delivery Charge
                    </h5>
                    <h5 className="font-sans text-xl text-right font-bold">
                      ${deliveryCharge}
                    </h5>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between mt-2">
                      <h5 className="font-serif text-xl font-semibold">
                        Discount
                      </h5>
                      <h5 className="font-sans text-xl text-right font-bold">
                        ${discount}
                      </h5>
                    </div>
                  )}
                  <div className="flex justify-between mt-2">
                    <h5 className="font-serif text-xl font-semibold">Tax</h5>
                    <h5 className="font-sans text-xl text-right font-bold">
                      ${calculateTax()}
                    </h5>
                  </div>
                  <div className="flex justify-between mt-3 gap-3">
                    <input
                      type="text"
                      className="py-3 px-4 block w-full border-black border rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="COUPON CODE"
                      onChange={(e) =>
                        setPromo({ ...promo, code: e.target.value })
                      }
                      value={promo.code}
                    />
                    <button
                      className="bg-[#9ACBCF]  border border-black text-black font-sans font-semibold px-3 py-1 rounded-md"
                      onClick={async () => {
                        let userId = JSON.parse(Cookies.get("user")).id;
                        console.log(userId);
                        let response = await request({
                          url: `coupon/code?code=${promo.code}&userId=${userId}`,
                          method: "GET",
                        });

                        if (response.data.success) {
                          setDiscount(response.data.data[0].discount);
                          setPromo({
                            ...promo,
                            code: response.data.data[0].code,
                            id: response.data.data[0].id,
                          });
                        } else {
                          console.log(response);
                          alert(response.data.error);
                        }
                      }}>
                      {discount !== 0 ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {promo !== "" && discount !== 0 && (
                    <button
                      className="underline text-md"
                      onClick={() => {
                        setPromo("");
                        setDiscount(0);
                      }}>
                      Remove Coupon
                    </button>
                  )}
                  <button
                    className="bg-[#FD7F28] w-full border border-black text-black font-sans font-semibold px-3 py-2 rounded-md mt-4 disabled:opacity-50"
                    disabled={!addressId ? true : false}
                    onClick={createOrder}>
                    {isAuthenticated
                      ? `Proceed with ${calculateTotal()}`
                      : "Login to Proceed"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
