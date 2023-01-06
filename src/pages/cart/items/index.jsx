import React, { useState } from "react";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";
import { useOutletContext } from "react-router-dom";

function CartItem({ card }) {
  const [cartItems, setCartItems] = useOutletContext();
  const [quantity, setQuantity] = useState(0);

  React.useEffect(() => {
    let findItem = cartItems.find((item) => item.id === card.id);
    if (findItem) {
      setQuantity(findItem.quantity);
    }
  }, [card.id, cartItems]);

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
    <div className=" my-3 flex items-center justify-between  gap-4">
      <div className="object-contain w-[150px] h-[150px]">
        <img src={card.image} alt="" />
      </div>
      <div className=" w-[20vw]">
        <h1 className="font-sans text-lg font-semibold">{card.name}</h1>
        <p className="text-md font-serif">{card.description}</p>
      </div>
      <div className="flex gap-2 items-center">
        <GrSubtractCircle
          className="text-2xl cursor-pointer"
          onClick={() => {
            decreaseQuantity();
          }}
        />
        <h3 className="font-serif font-bold text-xl">{quantity}</h3>
        <GrAddCircle
          className="text-2xl cursor-pointer"
          onClick={() => {
            addItemToCart();
          }}
        />
      </div>
      <div className="flex flex-col items-end">
        <h3 className="font-sans text-lg font-semibold">
          ${parseFloat(card.price * quantity)}
        </h3>
        <button
          className="bg-red-500 text-white font-sans font-semibold px-3 py-1 rounded-md"
          onClick={async () => {
            await setCartItems(() =>
              cartItems.filter((item) => item.id !== card.id)
            );
            if (cartItems.filter((item) => item.id !== card.id).length === 0) {
              localStorage.setItem("cartItems", JSON.stringify([]));
            }
          }}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;
