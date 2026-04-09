"use client"
import { useEffect, useState } from "react";

interface ChatServer {
    id: number;
    name: string;
    description?: string;
    image?: string;
    ownerId: number;
}

export default function JoinServer({setAddingServer, onBack}: {
    setAddingServer: (value: boolean) => void;
    onBack: () => void;
}) {
    const [availableServers, setAvailableServers] = useState<ChatServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState<number | null>(null);

    useEffect(() => {
        fetchAvailableServers();
    }, []);

    const fetchAvailableServers = async () => {
        try {
            const response = await fetch('/api/talk/chat-servers/available', {
                credentials: 'include',
            });
            if (response.ok) {
                const servers = await response.json();
                setAvailableServers(servers);
            } else {
                console.error("Failed to fetch available servers", response.status, await response.text());
            }
        } catch (error) {
            console.error("Error fetching available servers:", error);
        } finally {
            setLoading(false);
        }
    };

    const joinServer = async (serverId: number) => {
        setJoining(serverId);
        try {
            const response = await fetch(`/api/talk/chat-servers/${serverId}/join`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (response.ok) {
                setAddingServer(false);
                // Optionally refresh the page or update state to show the new server
                window.location.reload();
            } else {
                console.error("Failed to join server");
            }
        } catch (error) {
            console.error("Error joining server:", error);
        } finally {
            setJoining(null);
        }
    };

    return (
        <div className="flex flex-col absolute w-screen h-screen items-center justify-center bg-gray-600 opacity-50 z-10">
            <div className="flex flex-col justify-start items-center w-[50%] h-[70%] p-8 bg-gray-800 rounded shadow-md">
                <div className="flex justify-between items-center w-full mb-4">
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
                <header className="text-2xl font-bold text-gray-300 mb-6">Join a Server</header>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-400">Loading available servers...</p>
                    </div>
                ) : availableServers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-400">No available servers to join.</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="space-y-3">
                            {availableServers.map((server) => (
                                <div key={server.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        {server.image ? (
                                            <img
                                                src={server.image}
                                                alt={server.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                                                <span className="text-gray-300 font-bold text-lg">
                                                    {server.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-white font-semibold">{server.name}</h3>
                                            {server.description && (
                                                <p className="text-gray-400 text-sm">{server.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => joinServer(server.id)}
                                        disabled={joining === server.id}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {joining === server.id ? 'Joining...' : 'Join'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}