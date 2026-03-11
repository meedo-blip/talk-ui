"use client"
import { ChatServer } from "next-auth";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";

export default function AddServer({setAddingServer}: {setAddingServer: (value: boolean) => void}) {
    const router = useRouter();
    const [server, setServer] = useState<ChatServer>({})

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setServer({ ...server, [name]: value })
  }

     const joinServer = (serverId: string) => {
      
    }

    const createServer = (server?: ChatServer) => {
      fetch(`/api/talk/chat-servers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(server)
            })
      setAddingServer(false)
    }
      
    

  
    return (
        <div className="flex flex-col absolute w-screen h-screen items-center justify-center bg-gray-600 opacity-50 z-10">
          <div className="flex flex-col justify-evenly items-center w-[40%] h-[50%] p-8 bg-gray-800 rounded shadow-md">
            <button onClick={() => setAddingServer(false)} className="self-end text-gray-400 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <header className="text-2xl font-bold text-gray-300 mb-4">Join or Create a Server</header>
            <div className="flex flex-col items-center justify-evenly">
                 <label className="text-gray-500 text-sm mb-2">Server Name:</label>
                 <input 
                 type="text" 
                 name="name"
                 className="mb-4 p-2 rounded bg-gray-700 text-white w-full" 
                 onChange={handleChange}
                 placeholder="Enter server name"/>

                <label className="text-gray-500 text-sm mb-2">Server Description:</label>
                 <input 
                 type="text" 
                 name="description"
                 className="mb-4 p-2 rounded bg-gray-700 text-white w-full" 
                 onChange={handleChange}
                 placeholder="Enter server description"/>

                <label className="text-gray-500 text-sm mb-2">Server Icon URL:</label>
                 <input 
                 type="text" 
                 name="image"
                 className="mb-4 p-2 rounded bg-gray-700 text-white w-full" 
                 onChange={handleChange}
                 placeholder="Enter server image URL"/>
            </div>
            <button
              onClick={() => createServer(server)}
              className="text-white bg-blue-600 rounded-xl w-full h-12 flex items-center justify-center hover:bg-blue-500">
              <div className="text-xl font-bold text-white">Create Server</div> 
            </button>
          </div>
        </div>
    )
}