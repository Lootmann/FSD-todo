import { AddTask } from "./addtask";
import { TasksByLoader } from "./alltask";
import { useEffect, useState } from "react";
import "../styles/loader.css";

export function Index() {
  const [refresh, setRefresh] = useState<boolean>(false);
  function handleRefresh() {
    console.log(">>> tasks/index.tsx handleRefresh");
    setRefresh(!refresh);
  }

  const [openModal, setOpenModal] = useState<boolean>(false);
  function handleModal(isOpened: boolean) {
    setOpenModal(isOpened);
  }

  useEffect(() => {
    console.log(">>> handleRefresh");
  }, [refresh]);

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex flex-col mx-72">
        <div className="my-6 fade-in">
          <h2 className="pb-2 border-b border-zinc-600">Your Tasks</h2>

          <ul className="my-2 transition-all">
            <TasksByLoader handleRefresh={handleRefresh} />

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
