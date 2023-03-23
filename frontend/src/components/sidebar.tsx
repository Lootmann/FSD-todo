import React from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="h-screen fixed top-0 left-0 w-52 flex flex-col bg-zinc-850 px-4 pt-20">
      <ul>
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">
          <Link to={`/tasks`}>Inbox</Link>
        </li>

        {/* TODO: show all today's tasks */}
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">Today</li>

        {/* TODO: show all future's tasks */}
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">Upcoming</li>
      </ul>

      <div className="my-6">
        <h2 className="">Project</h2>
      </div>
    </div>
  );
}
