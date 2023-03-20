import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";

export function Index() {
  const [tasks, setTasks] = useState([]);

  // TODO: auth error - JWT Error
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
        });
    }
  }, []);

  return (
    <div className="p-6">
      <ul>
        <li>hoge</li>
        <li>hoge</li>
        <li>hoge</li>
        <li>hoge</li>
        <li>hoge</li>
      </ul>
    </div>
  );
}
