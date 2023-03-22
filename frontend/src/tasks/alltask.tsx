import axios from "axios";
import React from "react";
import { API_BACKEND_URL } from "../settings";
import { getAuthToken } from "../apis/auth";
import { getPriorityMark } from "../utils/svg";

export function AllTasks({ tasks, handleRefresh }: AllTaskProp) {
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

  const task_lists = tasks.map((task) => {
    return (
      <li
        key={task.id}
        className="flex items-center mt-2 pb-1 border-b border-zinc-700"
      >
        <span
          className="hover:scale-150 transition-all mr-3"
          onClick={(e) => onSubmit(e, task.id)}
        >
          {getPriorityMark(task.priority)}
        </span>
        {task.title}
      </li>
    );
  });

  return <>{task_lists}</>;
}
