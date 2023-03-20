import axios from "axios";
import { API_BACKEND_URL } from "../settings";

export function login(params: AuthUserType) {
  const { username, password } = params;

  axios
    .post(
      API_BACKEND_URL + "/auth/token",
      { username: username, password: password },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((resp) => {
      console.log(resp);
      console.log(resp.data);

      if (resp.status == 200) {
        const auth_token: AuthTokenType = resp.data;
        setAuthToken(auth_token);

        // NOTE: redirect to '/' top page
        window.location.href = "/";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function signup(params: AuthUserType) {
  const { username, password } = params;

  axios
    .post(API_BACKEND_URL + "/users", { name: username, password: password })
    .then((resp) => {
      console.log(resp);
      console.log(resp.data);

      if (resp.status == 201) {
        // NOTE: redirect to /auth/login
        window.location.href = "/auth/login";
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function setAuthToken(data: AuthTokenType) {
  localStorage.setItem("todo-token", data.access_token);
}

function getAuthToken(): AuthTokenType {
  const token = localStorage.getItem("todo-token");
  if (token !== null) return { access_token: token, token_type: "bearer" };
  return { access_token: "null", token_type: "null" };
}
