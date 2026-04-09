"use client"
import { ChatServer } from "next-auth";
import { useState } from "react";

export default function CreateServer({setAddingServer, onBack}: {
    setAddingServer: (value: boolean) => void;
    onBack: () => void;
}) {
    const [server, setServer] = useState<ChatServer>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setServer({ ...server, [name]: value });
    };

    const createServer = async (serverData: ChatServer) => {
        try {
            const response = await fetch(`/api/talk/chat-servers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(serverData)
            });

            if (response.ok) {
                setAddingServer(false);
            } else {
                console.error("Failed to create server");
            }
        } catch (error) {
            console.error("Error creating server:", error);
        }
    };

    return (
        <div className="flex flex-col absolute w-screen h-screen items-center justify-center bg-gray-600 opacity-50 z-10">
            <div className="flex flex-col justify-evenly items-center w-[40%] h-[60%] p-8 bg-gray-800 rounded shadow-md">
                <div className="flex justify-between items-center w-full">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button onClick={() => setAddingServer(false)} className="text-gray-400 hover:text-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <header className="text-2xl font-bold text-gray-300 mb-4">Create a Server</header>
                <div className="flex flex-col items-center justify-evenly w-full flex-1">
                    <div className="w-full">
                        <label className="text-gray-500 text-sm mb-2 block">Server Name:</label>
                        <input
                            type="text"
                            name="name"
                            className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                            onChange={handleChange}
                            placeholder="Enter server name"
                        />
                    </div>

                    <div className="w-full">
                        <label className="text-gray-500 text-sm mb-2 block">Server Description:</label>
                        <input
                            type="text"
                            name="description"
                            className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                            onChange={handleChange}
                            placeholder="Enter server description"
                        />
                    </div>

                    <div className="w-full">
                        <label className="text-gray-500 text-sm mb-2 block">Server Icon URL:</label>
                        <input
                            type="text"
                            name="image"
                            className="mb-4 p-2 rounded bg-gray-700 text-white w-full"
                            onChange={handleChange}
                            placeholder="Enter server image URL"
                        />
                    </div>
                </div>
                <button
                    onClick={() => createServer(server)}
                    className="text-white bg-blue-600 rounded-xl w-full h-12 flex items-center justify-center hover:bg-blue-500">
                    <div className="text-xl font-bold text-white">Create Server</div>
                </button>
            </div>
        </div>
    );
}
