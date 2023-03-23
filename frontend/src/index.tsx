import { Header } from "./components/header";
import { isLoggedIn, removeAuthToken } from "./apis/auth";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { useEffect, useState } from "react";

export function Index() {
  // NOTE: when user is '/', redirect to '/tasks/
  const location = useLocation();
  if (location.pathname == "/") {
    window.location.href = "/tasks";
  }

  // NOTE: when you are not logged in or expired JWT token, redirect to login page
  useEffect(() => {
    const checkLogin = async () => {
      const isLogged = await isLoggedIn();
      if (!isLogged) {
        removeAuthToken();
        window.location.href = "/auth/login";
      }
    };

    checkLogin();
  }, []);

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-slate-200 text-xl">
      <Header />

      <div className="h-full flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
