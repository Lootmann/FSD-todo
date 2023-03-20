import React from "react";
import { useForm } from "react-hook-form";

// TODO: login form
export function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthUserType>();

  const onSubmit = (data: AuthUserType) => {
    console.log(data.username);
    console.log(data.password);
  };

  const usernameRules = {
    required: "This field is required",
    minLength: {
      value: 5,
      message: "username must be at least 5 characters long.",
    },
    maxLength: {
      value: 100,
      message: "username must be less than 100 characters long.",
    },
  };

  const passwordRules = {
    required: "This field is required",
    minLength: {
      value: 8,
      message: "username must be at least 5 characters long.",
    },
    maxLength: {
      value: 100,
      message: "username must be less than 100 characters long.",
    },
  };

  console.log(watch("username"), watch("password"));

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
