import Cookies from "js-cookie";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./topbar";

function UserLayout() {
  const [cartItems, setCartItems] = useState([]);
  React.useEffect(() => {
    // for every change in the cart items state, we save the cart items to the local storage
    if (!localStorage.getItem("cartItems")) {
      localStorage.setItem("cartItems", JSON.stringify([]));
    }
    //on page reload check if there is a cartItems in the local storage
    //if there is, set the cartItems state to the cartItems in the local storage

    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  React.useEffect(() => {
    if (localStorage.getItem("cartItems")) {
      setCartItems(JSON.parse(localStorage.getItem("cartItems")));
    }
  }, []);

  return (
    <div>
      <TopBar cartItems={cartItems.length} />
      <div className="container mx-auto font-sans">
        <Outlet context={[cartItems, setCartItems]} />
      </div>
    </div>
  );
}

export { UserLayout };
