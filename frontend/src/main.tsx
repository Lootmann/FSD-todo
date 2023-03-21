import React from "react";
import ReactDOM from "react-dom/client";
import { AuthIndex } from "./auths";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Index as TaskIndex } from "./tasks";
import { Index } from ".";
import { Login } from "./auths/login";
import { Logout } from "./auths/logout";
import { Signup } from "./auths/signup";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "/tasks",
        element: <TaskIndex />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthIndex />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/signup",
        element: <Signup />,
      },
      {
        path: "/auth/logout",
        element: <Logout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
