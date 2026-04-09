"use client"
import { useState } from "react";
import CreateServer from "./CreateServer";
import JoinServer from "./JoinServer";

type AddServerMode = 'choose' | 'create' | 'join';

export default function AddServer({setAddingServer}: {setAddingServer: (value: boolean) => void}) {
    const [mode, setMode] = useState<AddServerMode>('choose');

    if (mode === 'create') {
        return <CreateServer setAddingServer={setAddingServer} onBack={() => setMode('choose')} />;
    }

    if (mode === 'join') {
        return <JoinServer setAddingServer={setAddingServer} onBack={() => setMode('choose')} />;
    }

    return (
        <div className="flex flex-col absolute w-screen h-screen items-center justify-center bg-gray-600 opacity-50 z-10">
          <div className="flex flex-col justify-center items-center w-[40%] h-[50%] p-8 bg-gray-800 rounded shadow-md">
            <button onClick={() => setAddingServer(false)} className="self-end text-gray-400 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <header className="text-2xl font-bold text-gray-300 mb-8">Add a Server</header>
            <div className="flex flex-col gap-4 w-full">
                <button
                    onClick={() => setMode('create')}
                    className="text-white bg-blue-600 rounded-xl w-full h-16 flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <div className="text-xl font-bold text-white">Create Server</div>
                </button>
                <button
                    onClick={() => setMode('join')}
                    className="text-white bg-green-600 rounded-xl w-full h-16 flex items-center justify-center hover:bg-green-500 transition-colors">
                    <div className="text-xl font-bold text-white">Join Available Server</div>
                </button>
            </div>
          </div>
        </div>
    )
}