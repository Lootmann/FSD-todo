import React from "react";
import { isLogin } from "../apis/auth";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <div className="flex gap-4 items-baseline bg-zinc-800 shadow-md px-6 py-1">
      <h1 className="text-2xl mr-4">
        <Link
          to={`/tasks`}
          className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
        >
          Todo Master
        </Link>
      </h1>

      {!isLogin() ? (
        <>
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
        </>
      ) : (
        <Link
          to={`/auth/logout`}
          className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
        >
          Logout
        </Link>
      )}
    </div>
  );
}
