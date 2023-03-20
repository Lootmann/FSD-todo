import axios from "axios";
import { API_BACKEND_URL, LOCALSTORAGE_KEY } from "../settings";

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
  if (data.access_token !== null)
    localStorage.setItem(LOCALSTORAGE_KEY, data.access_token);
}

export function getAuthToken(): AuthTokenType {
  const token = localStorage.getItem(LOCALSTORAGE_KEY);
  if (token !== null) return { access_token: token, token_type: "bearer" };
  else return { access_token: null, token_type: null };
}

export function isLogin(): boolean {
  const token = localStorage.getItem(LOCALSTORAGE_KEY);
  return token !== null;
}
