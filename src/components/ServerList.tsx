"use client"
import React, { Context, SetStateAction, useContext, useEffect, useState } from "react";
import { ChatServer } from "next-auth"
import { useSession } from "next-auth/react";
import AddServer from "./AddServer";
export default function ServerList() {

    const { data: session, status } = useSession();
    const [servers, setServers] = useState<ChatServer[]>([])
    const [addingServer, setAddingServer] = useState(false)
    
    const recieveServers = () => {
      fetch(`/api/talk/chat-servers`, {
        method: "GET",
        headers: {
        },
    }).then(async (val) => {
      if (!val) {
        console.error("Failed to fetch servers:", val);
        return;
      }
      setServers((await val.json()) as any[])
      console.log("SERVERS:", servers)
    })
    }

    useEffect(() => {
      recieveServers()
    }, [addingServer, servers.length])
    return (
    <div className={"flex"}>
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen 
        // state to control width and visibility
        className={`bg-zinc-800 text-white 
                    h-screen transition-all 
                    duration-300 z-10 
                    w-20`}>
        {/* Sidebar content */}
        <div className="flex flex-col items-center overflow-y-auto h-full">
          <div className="mt-4">
            <a href="#"
              className="text-white 
                          hover:text-gray-300">
              Home
            </a>
          </div>
          <div className="mt-4">
            <a href="#"
              className="text-white 
                          hover:text-gray-300">
              About
            </a>
          </div>
          <div className="mt-4">
            <label className="text-gray-500 text-sm">Servers</label>
          </div>

          {servers && servers.length > 0 ? (
            servers.map((server: any) => (
            <button
              key={server.id}
              className="text-white bg-gray-600 rounded-xl w-12 h-12 mb-2 flex items-center justify-center bg-cover hover:bg-gray-500"
              style={{ backgroundImage: `url(${server.image})` }}>
            </button>
            ))
          ) : null}

          <div className="mt-2">
            <button
              onClick={() => setAddingServer(true)}
              className="text-white bg-gray-600 rounded-xl w-12 h-12 flex items-center justify-center hover:bg-gray-500 hover:cursor-pointer">
              <div className="text-2xl font-bold text-gray-600 w-6 h-6 rounded-full bg-white items-center justify-center flex"><div>+</div></div> 
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      {addingServer ? (
        <AddServer setAddingServer={(bool) => setAddingServer(bool)}/>
      ) : null}
      </div>
    );
}