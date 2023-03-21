import React from "react";
import { getPriorityMark } from "../utils/svg";

export function AllTasks({ tasks }: AllTaskProp) {
  // TODO: done todo
  function onSubmit() {
    console.log("done todo");
  }

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => {
          return (
            <li key={task.id} className="flex items-center gap-2 my-1">
              {getPriorityMark(task.priority)} {task.comment}
            </li>
          );
        })
      ) : (
        <div>No Task D:</div>
      )}
    </div>
  );
}
