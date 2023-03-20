import axios from "axios";
import { API_BACKEND_URL } from "../settings";

export function login(params: AuthUserType) {
  const { username, password } = params;

  // TODO: redirect to /
  axios
    .post(
      API_BACKEND_URL + "/auth/token",
      { username: username, password: password },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((resp) => {
      console.log(resp);
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signup(params: AuthUserType) {
  const { username, password } = params;

  // TODO: redirect to /auth/login
  axios
    .post(API_BACKEND_URL + "/users", { name: username, password: password })
    .then((resp) => {
      console.log(resp);
      console.log(resp.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
