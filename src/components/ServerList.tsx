"use client"
import React, { Context, SetStateAction, useContext, useEffect, useState } from "react";
import { ChatServer } from "next-auth"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AddServer from "./AddServer";
import HoverLabel from "./HoverLabel";
import ServerContextMenu from "./ServerContextMenu";
import { time } from "console";
export default function ServerList() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const [servers, setServers] = useState<ChatServer[]>([])
    const [addingServer, setAddingServer] = useState(false)
    const [visibleServerMenuId, setVisibleServerMenuId] = useState<any>(null)

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

    const editServer = (server: any) => {
      console.log("Editing server:", server);
    }

    const deleteServer = (server: any) => {
      console.log("Deleting server:", server);
      fetch(`/api/talk/chat-servers/${server.id}`, {
        method: "DELETE",
        headers: {
        },
      })
      .then(async (val) => {
        if (!val) {
          console.error("Failed to delete server:", val);
          return;
        }
        recieveServers()
    })
    setVisibleServerMenuId(null);
  }

    useEffect(() => {
        const handleContextMenu = (event: MouseEvent) => {
          event.preventDefault();
        };
  
      document.addEventListener('contextmenu', handleContextMenu);

        recieveServers();
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [addingServer])

    
    return (
    <div className={"flex"}>
      {/* Sidebar */}
      <div
        // Conditional class based on isOpen 
        // state to control width and visibility
        className={`bg-zinc-800 text-white 
                    min-h-screen transition-all 
                    duration-300 z-10 
                    w-20`}>
        {/* Sidebar content */}
        <div className="flex flex-col items-center  h-full">
          
          <div className="mt-4">
          <HoverLabel label={"Direct Messages"}>
            <button
              onClick={(e) => {}}
              className="text-white rounded-xl w-12 h-12 mb-2 flex items-center justify-center bg-cover hover:bg-gray-500 hover:cursor-pointer">
              <img src="/icons/home.png" alt="Home" className="rounded-full w-8 h-8"/>
            </button>
            </HoverLabel>
          </div>

          <div className="mt-2">
            <label className="text-gray-500 text-sm">Servers</label>
          </div>

          {servers && servers.length > 0 ? (
            servers.map((server: any) => (
              <ServerContextMenu
                key={server.id}
                server={server}
                visibleMenuId={visibleServerMenuId}
                setVisibleMenuId={setVisibleServerMenuId}
                editServer={editServer}
                deleteServer={deleteServer}
              >
                <HoverLabel label={server.name}>
                  <button
                    onClick={() => router.push(`/chat/${server.id}`)}
                    className="text-white bg-gray-600 rounded-xl w-12 h-12 mb-2 overflow-hidden hover:bg-gray-500 hover:cursor-pointer">
                    <img src={server.image} alt={server.name} className="w-12 h-12" />
                  </button>
                </HoverLabel>
              </ServerContextMenu>
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

{false ? (
      <div className="flex absolute bottom-1 left-4 z-20">
      <HoverLabel label={session?.user?.name || "User"}>
      <button
        className="text-white bg-gray-600 rounded-full w-12 h-12 mb-2 overflow-hidden hover:bg-gray-500 hover:cursor-pointer">
        <img src={session?.user?.image || ""} alt={session?.user?.name || "User"} className="w-12 h-12 antialiased" />
      </button>
    </HoverLabel>
      </div>
) : null}
      {/* Main content */}
      {addingServer ? (
        <AddServer setAddingServer={(bool) => setAddingServer(bool)}/>
      ) : null}
      </div>
    );
}