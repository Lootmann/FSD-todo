import React from "react";
import { Header } from "../components/header";
import { Outlet } from "react-router-dom";

export function Index() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-slate-200 text-xl">
      <Header />
      <div className="h-full flex gap-6 m-6">
        <Outlet />
      </div>
    </div>
  );
}
