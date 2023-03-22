import axios from "axios";
import React, { useState } from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { getPriorityMark } from "../utils/svg";
import { useForm } from "react-hook-form";

export function Task({ task, handleRefresh }: TaskProp) {
  function onSubmit(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    task_id: number
  ) {
    e.preventDefault();
    const token = getAuthToken();

    axios
      .post(
        API_BACKEND_URL + `/tasks/${task_id}/done`,
        {},
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      )
      .then((resp) => {
        if (resp.status == 200) {
          console.log(resp);
          console.log(resp.data);
          handleRefresh();
        } else {
          // TODO: fail to done task
          console.log(resp);
          console.log(resp.data);
        }
      })
      .catch((error) => {
        // TODO: server error
        console.log(error);
      });
  }

  // NOTE: react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  console.log(watch("title"), watch("description"));

  // TODO: function delete and update task
  function deleteTask(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    console.log(">>> delete task");
  }

  function updateTask() {
    console.log(">>> update task");
  }

  // task detail Modal
  const [openModal, setOpenModal] = useState<boolean>(false);
  function handleModal(isOpened: boolean) {
    setOpenModal(isOpened);
  }

  return (
    <>
      <li
        className="flex items-center mt-2 pb-1 border-b border-zinc-700"
        onClick={() => handleModal(true)}
      >
        <span
          className="hover:scale-150 transition-all mr-3"
          onClick={(e) => onSubmit(e, task.id)}
        >
          {getPriorityMark(task.priority)}
        </span>
        {task.title}
      </li>

      {openModal && (
        <div
          className="absolute inset-0 w-full h-full py-20 flex items-center justify-center bg-opacity-80 bg-zinc-700"
          onClick={() => handleModal(false)}
        >
          <form
            onSubmit={handleSubmit(updateTask)}
            className="relative w-2/5 h-full flex flex-col bg-zinc-900 opacity-100 p-4 text-xl rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="text-xl mb-4">Update Task</header>

            <div className="flex-1 flex flex-col gap-4 ">
              <input
                id="title"
                defaultValue={task.title}
                {...register("title")}
                className="bg-zinc-900 hover:border-zinc-700 text-2xl px-2 rounded-md"
              />
              <input
                defaultValue={task.description}
                {...register("description")}
                className="bg-zinc-900 hover:border-zinc-700 px-2 rounded-md"
              />
              {/* TODO: expired_t */}
            </div>

            <footer className="flex justify-around">
              {/* TODO: delete task, then refresh */}
              <button
                type="submit"
                onClick={(e) => deleteTask(e)}
                className="bg-red-700 text-black text-2xl px-2 rounded-md"
              >
                Delete
              </button>

              {/* TODO: update task, then refresh */}
              <input
                type="submit"
                className="bg-yellow-700 text-black text-2xl px-2 rounded-md"
                onSubmit={handleSubmit(updateTask)}
                value="Update"
              />
            </footer>
          </form>
        </div>
      )}
    </>
  );
}
