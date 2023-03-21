import axios from "axios";
import React, { useEffect, useState } from "react";
import { AddTask } from "./addtask";
import { AllTasks } from "./alltask";
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
          console.error(error);
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
            {tasks.length > 0 && (
              <AllTasks tasks={tasks} handleRefresh={handleRefresh} />
            )}

            <li className="mt-4 pt-1">
              {openModal ? (
                <AddTask
                  handleRefresh={handleRefresh}
                  handleModal={handleModal}
                />
              ) : (
                <span onClick={() => setOpenModal(true)}>+ add new task</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
