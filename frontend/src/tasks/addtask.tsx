import axios from "axios";
import React from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { useForm } from "react-hook-form";

// TODO: add task, modal
export function AddTask({ handleRefresh, handleModal }: AddTaskProp) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskCreateType>();

  console.log(watch("comment"), watch("priority"));

  function onSubmit(data: TaskCreateType) {
    const token = getAuthToken();
    console.log(data.comment, data.priority, token);

    axios
      .post(
        API_BACKEND_URL + "/tasks",
        {
          comment: data.comment,
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
              placeholder="comment"
              {...register("comment")}
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
            />

            <select
              className="text-2xl bg-zinc-800 px-1 rounded-md outline-none"
              {...register("priority")}
              defaultValue="3"
            >
              <option value="0">High Priority</option>
              <option value="1">Middle Priority</option>
              <option value="2">Low Priority</option>
              <option value="3">No Priority</option>
            </select>
          </div>

          <div className="flex gap-6 justify-end mx-10">
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
        </form>
      </div>
    </div>
  );
}
