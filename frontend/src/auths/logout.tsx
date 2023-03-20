import React, { useEffect } from "react";
import { removeAuthToken } from "../apis/auth";

export function Logout() {
  useEffect(() => {
    removeAuthToken();
    window.location.href = "/auth/login";
  }, []);
  return <div>Logout</div>;
}
