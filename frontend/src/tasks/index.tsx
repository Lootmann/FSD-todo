import axios from "axios";
import { AddTask } from "./addtask";
import { AllTasks } from "./alltask";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken, removeAuthToken } from "../apis/auth";
import { useEffect, useState } from "react";
import "../styles/loader.css";

export function Index() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const [refresh, setRefresh] = useState<boolean>(false);
  function handleRefresh() {
    setRefresh(!refresh);
  }

  // for loading animation
  const [isLoading, setIsLoading] = useState(true);

  const [openModal, setOpenModal] = useState<boolean>(false);
  function handleModal(isOpened: boolean) {
    setOpenModal(isOpened);
  }

  useEffect(() => {
    const token = getAuthToken();

    if (token.access_token != null) {
      axios
        .get(API_BACKEND_URL + "/tasks?done=false", {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        .then((resp) => {
          if (resp.status == 200) {
            console.log(resp);
            console.log(resp.data);
            setTasks(resp.data);
            // for loading animation
            setIsLoading(false);
          }
        })
        .catch((error) => {
          // NOTE: see https://github.com/Lootmann/FSD-todo/issues/1
          console.error(error);
          removeAuthToken();
          window.location.href = "/auth/login";
        });
    } else {
      // when token is null, this means that user at least is not logged in.
      window.location.href = "/auth/login";
    }
  }, [refresh]);

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex flex-col mx-72">
        {!isLoading && (
          <>
            <div className="my-6 fade-in">
              <h2 className="pb-2 border-b border-zinc-600">Your Tasks</h2>

              <ul className="my-2 transition-all">
                <AllTasks tasks={tasks} handleRefresh={handleRefresh} />

                <li className="mt-4 pt-1">
                  {openModal ? (
                    <AddTask
                      handleRefresh={handleRefresh}
                      handleModal={handleModal}
                    />
                  ) : (
                    <span onClick={() => setOpenModal(true)}>
                      + add new task
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
