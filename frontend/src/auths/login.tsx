import React from "react";
import { login } from "../apis/auth";
import { passwordRules, usernameRules } from "./validations";
import { useForm } from "react-hook-form";

export function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<AuthUserType>();

  const onSubmit = async (data: AuthUserType) => {
    const resp = await login(data);

    if (resp.status == 200) {
      console.log(resp);
      // redirect to /tasks
      window.location.href = "/tasks";
    } else if (resp.response.status == 404) {
      console.log(resp);
      setError("username", { type: "custom", message: "User is Not Found D:" });
      setError("password", { type: "custom", message: "User is Not Found D:" });
    } else {
      console.log(resp);
      setError("username", {
        type: "custom",
        message: "Invalid Username or Password",
      });
      setError("password", {
        type: "custom",
        message: "Invalid Username or Password",
      });
    }
  };

  // console.log(watch("username"), watch("password"));

  return (
    <div className="w-1/2 ml-auto mr-auto">
      <h2 className="text-center text-2xl mb-6">Login Form :^)</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-4 bg-slate-700"
      >
        <input
          placeholder="username"
          {...register("username", usernameRules)}
          className="bg-slate-400 text-slate-900 px-2 py-1 rounded-md"
        />
        {errors.username && (
          <span className="text-red-500">{errors.username.message}</span>
        )}

        <input
          placeholder="password"
          {...register("password", passwordRules)}
          className="bg-slate-400 text-slate-900 px-2 py-1 rounded-md"
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}

        <input
          type="submit"
          value="submit"
          className="bg-green-600 hover:bg-green-400 text-slate-900 transition-all text-2xl px-2 py-1 rounded-md"
        />
      </form>
    </div>
  );
}
