import axios from "axios";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
          console.warn(resp.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="z-10 fixed h-[50px] w-full flex gap-4 align-bottom items-center  bg-zinc-800 shadow-md px-6 py-1">
      <Link
        to={`/tasks`}
        className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all text-center"
      >
        Todo Master
      </Link>

      <Link
        to={`/auth/logout`}
        className="text-2xl hover:bg-zinc-600 px-1 rounded-md transition-all"
      >
        Logout
      </Link>

      <p className="bg-zinc-600 px-2 rounded-md">{currentUser.username}</p>
    </div>
  );
}
