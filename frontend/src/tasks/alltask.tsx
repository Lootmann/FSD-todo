import { Task } from "./task";
import { useState } from "react";

export function AllTasks({ tasks, handleRefresh }: AllTaskProp) {
  return (
    <>
      {tasks.map((task) => {
        return <Task key={task.id} task={task} handleRefresh={handleRefresh} />;
      })}
    </>
  );
}
