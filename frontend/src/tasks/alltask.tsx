import React from "react";
import { getPriorityMark } from "../utils/svg";

// task prop needs handleRefresh
export function AllTasks({ tasks, handleRefresh }: AllTaskProp) {
  // TODO: done todo
  function onSubmit(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    e.preventDefault();
    console.log("done todo");

    // TODO: when done a todo, Re-render parent's AllTasks
    // handleRefresh();
  }

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => {
          // TODO: click each tasks, show modal with task details.
          return (
            <li
              key={task.id}
              className="flex items-center mt-2 pb-1  border-b border-zinc-700"
            >
              {/* TODO: click flag, done todo */}
              <span
                className="hover:scale-150 transition-all mr-3"
                onClick={(e) => onSubmit(e)}
              >
                {getPriorityMark(task.priority)}
              </span>
              {task.title}
            </li>
          );
        })
      ) : (
        <div>No Task D:</div>
      )}
    </div>
  );
}
