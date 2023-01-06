import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import React from "react";

export const RouterContainer = () => <RouterProvider router={router} />;
