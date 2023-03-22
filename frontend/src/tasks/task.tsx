import axios from "axios";
import React, { useState } from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { getPriorityMark } from "../utils/svg";

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

  // TODO: function delete and update task
  function deleteTask() {}
  function updateTask() {}

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

      {/* TODO: react-hook-form */}
      {openModal && (
        <div
          className="absolute inset-0 w-full h-full py-20 flex items-center justify-center bg-opacity-80 bg-zinc-700"
          onClick={() => handleModal(false)}
        >
          <div
            className="relative w-2/5 h-full flex flex-col bg-zinc-900 opacity-100 p-4 text-xl rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <header>{task.id}.Modal</header>

            <div className="flex-1 flex flex-col">
              <p>{task.title}</p>
              <p>{task.description}</p>
            </div>

            {/* TODO: update task, then refresh */}
            {/* TODO: delete task, then refresh */}
            <footer className="flex justify-around">
              <p className="bg-red-700 text-black text-2xl px-2 rounded-md">
                Delete
              </p>
              <p className="bg-yellow-700 text-black text-2xl px-2 rounded-md">
                Update
              </p>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
