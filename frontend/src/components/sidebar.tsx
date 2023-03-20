import React from "react";

export function Sidebar() {
  return (
    <div className="h-full w-52 flex flex-col bg-zinc-850 px-4 pt-4">
      <ul>
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">Today</li>
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">Upcoming</li>
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">hoge</li>
        <li className="hover:bg-zinc-700 px-1 my-1 rounded-md">hoge</li>
      </ul>

      <div className="my-6">
        <h2 className="">Project</h2>
      </div>
    </div>
  );
}
