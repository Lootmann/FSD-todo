import axios from "axios";
import { API_BACKEND_URL, LOCALSTORAGE_KEY } from "../settings";

export async function login(params: AuthUserType) {
  const { username, password } = params;

  return await axios
    .post(
      API_BACKEND_URL + "/auth/token",
      { username: username, password: password },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    .then((resp) => {
      if (resp.status == 200) {
        const auth_token: AuthTokenType = resp.data;
        setAuthToken(auth_token);
      }
      return resp;
    })
    .catch((error) => {
      return error;
    });
}

export function signup(params: AuthUserType) {
  const { username, password } = params;

  axios
    .post(API_BACKEND_URL + "/users", {
      username: username,
      password: password,
    })
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

export function removeAuthToken() {
  localStorage.removeItem(LOCALSTORAGE_KEY);
}

export function getAuthToken(): AuthTokenType {
  const token = localStorage.getItem(LOCALSTORAGE_KEY);
  if (token !== null) return { access_token: token, token_type: "bearer" };
  else return { access_token: null, token_type: null };
}

export async function isLoggedIn(): Promise<boolean> {
  const token = getAuthToken();
  if (token.access_token == null) return false;

  return await axios
    .get(API_BACKEND_URL + "/users/me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    .then((resp) => {
      if (resp.status == 200) return true;
      else return false;
    });
}
