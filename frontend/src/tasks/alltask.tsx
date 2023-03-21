import React from "react";
import { getPriorityMark } from "../utils/svg";

export function AllTasks({ tasks }: AllTaskProp) {
  // IMPL: done todo
  // IMPL: when done todo, Re-render this AllTasks itself
  function onSubmit() {
    console.log("done todo");
  }

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => {
          // IMPL: click each tasks, show modal with task details.
          return (
            <li
              key={task.id}
              className="flex items-center gap-2 my-2 border-b border-zinc-700"
            >
              {/* IMPL: click flag, done todo */}
              <span className="hover:scale-150 transition-all pr-2">
                {getPriorityMark(task.priority)}
              </span>
              {task.comment}
            </li>
          );
        })
      ) : (
        <div>No Task D:</div>
      )}
    </div>
  );
}
