import axios from "axios";
import React from "react";
import { API_BACKEND_URL } from "../settings";
import { Form, redirect, useActionData } from "react-router-dom";
import { getAuthToken } from "../apis/auth";
import { useForm } from "react-hook-form";

export function AddTask({ handleRefresh, handleModal }: AddTaskProp) {
  // TODO: react-router get ActionData
  // const data = useActionData();

  return (
    <div className="relative w-full h-56 flex inset-0 bg-zinc-700 rounded-md">
      <div className="flex-1 flex flex-col m-4">
        <Form
          method="post"
          action="/tasks"
          className="grow flex flex-col outline-none"
        >
          <div className="grow flex flex-col gap-4 outline-none">
            <input
              placeholder="title"
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
              name="title"
              id="title"
            />

            <input
              placeholder="description"
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
              name="description"
              id="description"
            />
          </div>

          <footer className="flex justify-between">
            <div>
              <label
                htmlFor="priority"
                className="text-2xl bg-zinc-800 px-2 py-1 rounded-l-md"
              >
                Priority
              </label>
              <select
                className="text-2xl bg-zinc-800 px-1 py-1 rounded-r-md outline-none"
                defaultValue="3"
                name="priority"
                id="priority"
              >
                <option value="0">🔴 High</option>
                <option value="1">🟠 Mid</option>
                <option value="2">🔵 Low</option>
                <option value="3">⚪ No</option>
              </select>
            </div>

            <div className="flex gap-6">
              <button
                type="button"
                className="bg-zinc-850 px-2 rounded-md"
                onClick={() => handleModal(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-rose-900 hover:bg-rose-700 px-2 rounded-md"
              >
                Add Task
              </button>
            </div>
          </footer>
        </Form>
      </div>
    </div>
  );
}

export async function taskAction({ request }: any) {
  const data = await request.formData();

  const submitData = {
    title: data.get("title"),
    description: data.get("description"),
    priority: data.get("priority"),
  };

  // NOTE: create new task
  const token = getAuthToken();
  axios
    .post(API_BACKEND_URL + "/tasks", submitData, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    .then((resp) => {
      if (resp.status == 201) {
        console.log(resp);
        return redirect("/tasks");
      } else {
        // TODO: can't create task by server error D:
        // TODO: return error message
      }
    });

  return redirect("/tasks");
}
