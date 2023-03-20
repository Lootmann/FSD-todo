import axios from "axios";
import React, { useEffect, useState } from "react";
import { AddTask } from "./addtask";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken, removeAuthToken } from "../apis/auth";

export function Index() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const [refresh, setRefresh] = useState<boolean>(false);
  function handleRefresh() {
    setRefresh(!refresh);
  }

  const [openModal, setOpenModal] = useState<boolean>(false);
  function handleModal(isOpened: boolean) {
    setOpenModal(isOpened);
  }

  useEffect(() => {
    const token = getAuthToken();

    if (token.access_token != null) {
      axios
        .get(API_BACKEND_URL + "/tasks", {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            console.log(resp);
            console.log(resp.data);
            setTasks(resp.data);
          }
        })
        .catch((error) => {
          // NOTE: see https://github.com/Lootmann/FSD-todo/issues/1
          console.log(error);
          removeAuthToken();
          window.location.href = "/auth/login";
        });
    } else {
      // NOTE: when token is null, this means that user at least is not logged in.
      window.location.href = "/auth/login";
    }
  }, [refresh]);

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex flex-col mx-72">
        <div className="my-6">
          <h2 className="border-b border-zinc-600">hello world</h2>
        </div>

        <div className="my-6">
          <h2 className="border-b border-zinc-600">Today</h2>

          <ul className="my-2">
            {tasks.map((task) => {
              return (
                <li key={task.id}>
                  {task.id}. {task.comment}({task.priority})
                </li>
              );
            })}

            <li className="mt-8 pt-1 rounded-md border-t border-zinc-600">
              {/* TODO: Add Task */}
              {openModal ? (
                <AddTask
                  handleRefresh={handleRefresh}
                  handleModal={handleModal}
                />
              ) : (
                <p onClick={() => setOpenModal(true)}>+ add new task</p>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
