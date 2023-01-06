import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import { AdminLayout } from "../layouts/admin";
import { UserLayout } from "../layouts/user";
import AdminOrdersPage from "../pages/admin/orders";
import ItemsPage from "../pages/admin/products";

import Cart from "../pages/cart";
import { Home } from "../pages/home";
import OrdersPage from "../pages/orders";
import ProtectedRoutes from "./auth";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/admin" element={<ProtectedRoutes />}>
        <Route path="" element={<AdminLayout />}>
          <Route path="" element={<Navigate to="/admin/products" replace />} />
          <Route path="products" element={<ItemsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Route>
      {/* <Route path={"/"} element={<Navigate to={"/"} replace />} /> */}
      <Route path={"/"} element={<UserLayout />}>
        <Route path="" element={<Home />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="shopping-cart" element={<Cart />} />
      </Route>

      <Route path="*" element={<div>404</div>} />

      <Route path="*" element={<div>404</div>} />
    </>
  )
);
