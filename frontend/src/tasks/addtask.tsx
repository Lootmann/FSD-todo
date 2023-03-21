import axios from "axios";
import React from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { useForm } from "react-hook-form";

export function AddTask({ handleRefresh, handleModal }: AddTaskProp) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskCreateType>();

  // console.log(watch("title"), watch("description"), watch("priority"));

  function onSubmit(data: TaskCreateType) {
    const token = getAuthToken();
    console.log(data.title, data.priority, token);

    axios
      .post(
        API_BACKEND_URL + "/tasks",
        {
          title: data.title,
          description: data.description,
          priority: data.priority,
        },
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      )
      .then((resp) => {
        if (resp.status == 201) {
          console.log(resp);
          console.log(resp.data);

          handleModal(false);
          handleRefresh();
        } else {
          // TODO: can't create task by server error D:
          // TODO: show error message
        }
      });
  }

  return (
    <div className="relative w-full h-56 flex inset-0 bg-zinc-700 rounded-md">
      <div className="flex-1 flex flex-col m-4">
        <form
          className="grow flex flex-col outline-none"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grow flex flex-col gap-4 outline-none">
            <input
              placeholder="title"
              {...register("title")}
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
            />

            <input
              placeholder="description"
              {...register("description")}
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
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
                id="priority"
                className="text-2xl bg-zinc-800 px-1 py-1 rounded-r-md outline-none"
                {...register("priority")}
                defaultValue="3"
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
        </form>
      </div>
    </div>
  );
}
