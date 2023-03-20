import { Header } from "./components/header";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import { useState } from "react";

export function Index() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-slate-200 text-xl">
      <Header />

      <div className="h-full flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
