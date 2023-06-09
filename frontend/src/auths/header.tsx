import React from "react";
import { Link } from "react-router-dom";

export function AuthHeader() {
  return (
    <div className="flex gap-4 items-baseline bg-zinc-800 shadow-md px-6 py-1">
      <h1 className="text-2xl mr-4">
        <span className="text-2xl px-1 rounded-md">Todo Master</span>
      </h1>

      <Link
        to={`/auth/login`}
        className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
      >
        Login
      </Link>

      <Link
        to={`/auth/signup`}
        className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
      >
        Signup
      </Link>
    </div>
  );
}
