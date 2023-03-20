import React, { useEffect } from "react";
import { Header } from "../components/header";
import { isLogin } from "../apis/auth";
import { Outlet } from "react-router-dom";

export function Index() {
  // TODO: it seems wrong :D
  useEffect(() => {
    if (isLogin()) window.location.href = "/";
  }, []);

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-slate-200 text-xl">
      <Header />
      <div className="h-full flex gap-6 m-6">
        <Outlet />
      </div>
    </div>
  );
}
