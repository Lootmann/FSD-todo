import axios from "axios";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken, removeAuthToken } from "./auth";

export async function loader() {
  console.log(">>> getAllTasks");
  const token = getAuthToken();

  const resp = await axios
    .get(API_BACKEND_URL + "/tasks?done=false", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    })
    .then((resp) => {
      if (resp.status == 200) {
        console.log(resp);
        return resp.data;
      }
    })
    .catch((error) => {
      // NOTE: see https://github.com/Lootmann/FSD-todo/issues/1
      console.error(error);
      removeAuthToken();
      window.location.href = "/auth/login";
      return null;
    });

  console.log(resp.data);
  return resp;
}
