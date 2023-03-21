import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken, isLogin } from "../apis/auth";
import { Link } from "react-router-dom";

export function Header() {
  const [currentUser, setCurrentUser] = useState<CurrentUserType>({
    username: "NoUser",
  });

  useEffect(() => {
    const token = getAuthToken();

    axios
      .get(API_BACKEND_URL + "/users/me", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      .then((resp) => {
        if (resp.status == 200) {
          setCurrentUser(resp.data);
        } else {
          // TODO: redirect
        }
      })
      .catch((error) => {
        // TODO: redirect
      });
  }, []);

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
        <>
          <Link
            to={`/auth/logout`}
            className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
          >
            Logout
          </Link>

          <p className="bg-zinc-600 px-2 rounded-md">{currentUser.username}</p>
        </>
      )}
    </div>
  );
}
