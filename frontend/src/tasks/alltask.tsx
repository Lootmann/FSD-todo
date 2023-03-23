import { Task } from "./task";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export function TasksByLoader({
  handleRefresh,
}: {
  handleRefresh: () => void;
}) {
  const tasks = useLoaderData() as TaskType[];

  return (
    <>
      {tasks.map((task) => {
        return <Task key={task.id} task={task} handleRefresh={handleRefresh} />;
      })}
    </>
  );
}
