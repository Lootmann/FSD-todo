import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken, removeAuthToken } from "../apis/auth";

export function Index() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = getAuthToken();

    if (token.access_token != null) {
      axios
        .get(API_BACKEND_URL + "/tasks", {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            console.log(resp);
            console.log(resp.data);
            setTasks(resp.data);
          }
        })
        .catch((error) => {
          // NOTE: see https://github.com/Lootmann/FSD-todo/issues/1
          console.log(error);
          removeAuthToken();
          window.location.href = "/auth/login";
        });
    } else {
      // NOTE: when token is null, this means that user at least is not logged in.
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <div className="p-6">
      {tasks.length > 0 ? (
        <ul>
          <li>hoge</li>
          <li>hoge</li>
          <li>hoge</li>
          <li>hoge</li>
          <li>hoge</li>
        </ul>
      ) : (
        <div>no tasks :^)</div>
      )}
    </div>
  );
}
