import React from "react";
import { AuthHeader } from "./header";
import { Outlet } from "react-router-dom";

export function AuthIndex() {
  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-slate-200 text-xl">
      <AuthHeader />
      <div className="h-full flex gap-6 m-6">
        <Outlet />
      </div>
    </div>
  );
}
