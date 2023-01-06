/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback } from "react";
import brandLogo from "../../assets/brandLogo.png";
import {
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineUser,
} from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Cookies from "js-cookie";

import { request } from "../../config/helpers/axios-instance";
import { CustomModalForm } from "../../components/custom-modal";
import useModal from "../../hooks/use-modal";
import { FcShipped, FcBusinessman } from "react-icons/fc";

function TopBar({ cartItems }) {
  const {
    user,
    isAuthenticated,
    logout,
    getAccessTokenSilently,
    loginWithPopup,
  } = useAuth0();
  const [roles, setRoles] = React.useState([]);
  const changeRole = (role) => {
    setRoles(role);
  };
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    if (!Cookies.get("isLoggedIn")) {
      if (isAuthenticated) {
        Cookies.set("isLoggedIn", JSON.stringify(true));
        return;
      }
      Cookies.set("isLoggedIn", JSON.stringify(false));
    }

    if (Cookies.get("isLoggedIn")) {
      setIsLoggedIn(JSON.parse(Cookies.get("isLoggedIn")));
    }
  }, [Cookies.get("isLoggedIn"), isAuthenticated]);

  const [userRole, setUserRole] = React.useState([]);
  React.useEffect(() => {
    if (Cookies.get("user")) {
      setUserRole(JSON.parse(Cookies.get("user")).roles ?? []);
    }
  }, [Cookies.get("user")]);

  const login = async (token) => {
    if (!token) return;
    let response = await request({
      method: "POST",
      url: "user/login",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data.success && response.data.data.newUser) {
      toggleCreateForm();
      return;
    }

    if (response.data.success && response.data.data) {
      Cookies.set("isLoggedIn", JSON.stringify(true));
      // if the response.data.data is array then return the first element
      if (Array.isArray(response.data.data)) {
        Cookies.set("user", JSON.stringify(response.data.data[0]));
        setUserRole(response.data.data[0].roles);
      } else {
        Cookies.set("user", JSON.stringify(response.data.data));
        setUserRole(response.data.data.roles);
      }
      if (response.data.data.roles.includes("ADMIN")) {
        window.location.href = "/admin/products";
      }
    }
  };

  const createAccount = async () => {
    const response = await request({
      method: "POST",
      url: "user/createAccount",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      data: {
        roles: [roles],
      },
    });
    if (response.data.success) {
      toggleCreateForm();
      Cookies.set("isLoggedIn", JSON.stringify(true));
      if (Array.isArray(response.data.data)) {
        Cookies.set("user", JSON.stringify(response.data.data[0]));
        setUserRole(response.data.data[0].roles);
      } else {
        Cookies.set("user", JSON.stringify(response.data.data));
        setUserRole(response.data.data.roles);
      }
      if (response.data.data.roles.includes("ADMIN")) {
        window.location.href = "/admin/products";
      }
    }
  };

  const { isShowing: isCreateFormShowing, toggle: toggleCreateForm } =
    useModal();
  React.useEffect(() => {
    if (!Cookies.get("token"))
      if (isAuthenticated) {
        getAccessTokenSilently().then((token) => {
          Cookies.set("token", token);
          login(token);
        });
      }
  }, [isAuthenticated, getAccessTokenSilently, login, Cookies.get("token")]);

  return (
    <div className="bg-[#e6e6e6] w-full h-16 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <div className="object-contain">
            <img src={brandLogo} alt="Brand Logo" className="w-20 h-auto" />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {userRole.includes("ADMIN") ? null : (
            <>
              <Link to="/shopping-cart">
                <button class="font-sans relative inline-flex flex-shrink-0 justify-center items-center h-[3.375rem] w-[3.375rem] rounded-md border font-medium  text-gray-700 shadow-sm align-middle hover:bg-gray-50 transition-all text-sm">
                  <HiOutlineShoppingCart className="text-2xl cursor-pointer" />

                  <span class="absolute top-2 right-0 inline-flex items-center py-0.5 px-1.5 rounded-full text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-rose-500 text-white">
                    {cartItems}
                  </span>
                </button>
              </Link>
              {isAuthenticated && (
                <Link to="orders">
                  <button className="font-sans relative inline-flex flex-shrink-0 justify-center items-center h-[3.375rem] w-[3.375rem] rounded-md border font-medium  text-gray-700 shadow-sm align-middle hover:bg-gray-50 transition-all text-sm">
                    <HiOutlineTruck className="text-2xl cursor-pointer" />
                  </button>
                </Link>
              )}
            </>
          )}
          {console.log(isAuthenticated)}
          {!isAuthenticated && Cookies.get("isLoggedIn") && (
            <button
              className="flex items-center justify-start gap-2 p-2 rounded-full px-3 font-semibold cursor-pointer bg-[#f6f6f6] font-sans text-sm"
              onClick={() => {
                loginWithPopup();

                // loginWithRedirect();
              }}>
              SignUp <HiOutlineUser className="text-xl" />
            </button>
          )}

          <CustomModalForm
            isShowing={isCreateFormShowing}
            hide={toggleCreateForm}
            title="Create User"
            className="modal-form">
            {/* Checkbox to choose signup as user or the seller */}
            <UserTypeForm
              roles={roles}
              changeRole={changeRole}
              createAccount={createAccount}
            />

            {/* Input fields for user */}
          </CustomModalForm>
          {isAuthenticated && (
            <div
              className="object-contain w-12 h-12 rounded-full cursor-pointer"
              onClick={() => {
                logout();
                Cookies.remove("token");
                Cookies.remove("isLoggedIn");
                Cookies.remove("user");
                localStorage.setItem("cartItems", JSON.stringify([]));
              }}>
              <img
                src={
                  (Cookies.get("user") &&
                    JSON.parse(Cookies.get("user")).picture) ||
                  user?.picture
                }
                alt={
                  Cookies.get("user") && JSON.parse(Cookies.get("user")).name
                }
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { TopBar };
const UserTypeForm = ({ changeRole, roles, createAccount }) => {
  return (
    <div className=" p-3 px-5  h-auto bg-[#f5f5f5]">
      <h2 className="text-center  mb-4 font-sans font-semibold text-xl">
        Start using our services
        <br /> by choosing your type
      </h2>
      <ul class="grid gap-6 w-full items-end md:grid-cols-2">
        <li>
          <input
            onChange={(e) => {
              changeRole(e.target.value);
            }}
            type="radio"
            id="USER"
            defaultValue={roles}
            name="hosting"
            value="USER"
            class="hidden peer"
            required
          />
          <label
            for="USER"
            class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-700 cursor-pointer  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 ">
            <div class="block">
              <FcBusinessman className="text-4xl" />
              <div class="w-full text-lg font-semibold">User</div>
              <div class="w-full">Buy Items and Add them to Cart</div>
            </div>
            <svg
              aria-hidden="true"
              class="ml-3 w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
          </label>
        </li>
        <li>
          <input
            type="radio"
            onChange={(e) => {
              changeRole(e.target.value);
            }}
            id="ADMIN"
            name="hosting"
            defaultValue={roles}
            value="ADMIN"
            class="hidden peer"
          />
          <label
            for="ADMIN"
            class="inline-flex justify-between items-center p-5 w-full text-gray-500 bg-white rounded-lg border border-gray-700 cursor-pointer  peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 ">
            <div class="block">
              <FcShipped className="text-4xl" />
              <div class="w-full text-lg font-semibold">Seller</div>
              <div class="w-full">Sell Items with Order Tracking</div>
            </div>
            <svg
              aria-hidden="true"
              class="ml-3 w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
          </label>
        </li>
      </ul>
      <button
        className="w-full mt-4 p-2 rounded-md px-3 font-semibold cursor-pointer bg-[#fd7f28] border border-black font-sans text-sm"
        onClick={createAccount}>
        Sign Up
      </button>
    </div>
  );
};
