import Cookies from "js-cookie";
import React, { useState } from "react";
import { HiShoppingCart } from "react-icons/hi2";
import { useOutletContext } from "react-router-dom";
import GetAllCategories from "../../hooks/fetch-all-categories";
import GetAllItems from "../../hooks/fetch-all-items";

function Home() {
  const { data: categories } = GetAllCategories();
  const { data: itemsPayload } = GetAllItems();
  const [items, setItems] = React.useState(null);
  React.useEffect(() => {
    if (itemsPayload?.data?.success)
      setItems(itemsPayload?.data?.data?.map((item) => item));
  }, [itemsPayload]);
  return (
    <div className="py-3">
      <div className="flex mb-3"></div>
      <h1 className="text-xl font-semibold">Shop Your Favourite Items!</h1>
      {/* // e-commerce items with image, name , description and add button */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-full lg:grid-cols-5 gap-4 mt-3">
        {
          // map through items
          items && items.map((item, key) => <ItemCard key={key} card={item} />)
        }
      </div>
    </div>
  );
}

const ItemCard = ({ card }) => {
  const findCardItem = () => {
    let data = JSON.parse(localStorage.getItem("cartItems"));
    let item = data.find((item) => item.id === card.id);
    // if item is found in cartItems, return quantity
    // else return 1
    return item ? item.quantity : 0;
  };
  const checkCardItem = () => {
    let data = JSON.parse(localStorage.getItem("cartItems"));
    let item = data.find((item) => item.id === card.id);
    // if item is found in cartItems, return true
    return item ? true : false;
  };
  const [addToCart, setAddToCart] = useState(checkCardItem());
  const [quantity, setQuantity] = useState(findCardItem());
  const [cartItems, setCartItems] = useOutletContext();

  const addItemToCart = () => {
    if (cartItems.length === 0) {
      setCartItems([{ id: card.id, quantity: quantity + 1 }]);
      setQuantity(quantity + 1);
      return;
    }
    let findItem = cartItems.find((item) => item.id === card.id);
    if (findItem) {
      setCartItems(
        cartItems.map((item) => {
          if (item.id === card.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
      );
      setQuantity(quantity + 1);
    } else {
      setCartItems([...cartItems, { id: card.id, quantity: quantity + 1 }]);
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = async () => {
    if (quantity === 1) {
      setAddToCart(false);
      await setCartItems(cartItems.filter((item) => item.id !== card.id));
      setQuantity(0);
      if (cartItems.filter((item) => item.id !== card.id).length === 0) {
        localStorage.setItem("cartItems", JSON.stringify([]));
      }
      return;
    }
    if (quantity > 1) {
      setCartItems(
        cartItems.map((item) => {
          if (item.id === card.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
      );
      setQuantity(quantity - 1);
    }
  };

  return (
    <div class="flex flex-col  h-full bg-white border shadow-sm rounded-xl ">
      <div className="bg-gray-200">
        <img
          class="w-full h-52 object-contain rounded-t-xl "
          src={card.image}
          alt="Description"
        />
      </div>
      <div className="p-4 pt-2 flex-grow flex flex-col justify-between">
        <div class=" flex justify-between items-center">
          <div className="">
            <h3 class="text-lg font-semibold text-gray-800 ">{card.name}</h3>
            <p className="text-xs text-ellipsis overflow-hidden">
              {card.description}
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          {/* // create a rating component */}
          {addToCart && (
            <div className="flex items-center gap-2 mt-3">
              <button
                className="bg-[#ec7c1a] text-white rounded-full w-8 h-8 flex justify-center items-center"
                onClick={() => {
                  decreaseQuantity();
                }}>
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                className="bg-[#ec7c1a] text-white rounded-full w-8 h-8 flex justify-center items-center"
                onClick={() => {
                  addItemToCart();
                }}>
                +
              </button>
            </div>
          )}

          {!addToCart && (
            <button
              class="mt-3 py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-black font-semibold bg-white text-black hover:bg-[#ec7c1a] focus:outline-none focus:ring-2 focus:ring-[#ec7c1a] focus:ring-offset-2 transition-all text-sm hover:scale-105 ease-out duration-500 transform"
              onClick={() => {
                setAddToCart(true);
                setQuantity(1);
                addItemToCart();
              }}>
              Add to Cart <HiShoppingCart />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { Home };
