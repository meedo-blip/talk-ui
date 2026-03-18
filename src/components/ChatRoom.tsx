"use client";

import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSession } from "next-auth/react";
import { Message } from "@/types/types";
import { ScrollAnimation } from "./ChatScrollList";

export default function ChatRoom({ server }: { server: any }) {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    setLoading(true);
    if (!server?.id || !session?.springAccessToken) return;
    //const socket = new SockJS("http://localhost:8080/ws/");

    console.log("Connecting to WebSocket with token:", session?.springAccessToken);
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws/",
      connectHeaders: {
        Authorization: `Bearer ${session.springAccessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected");

        stompClient.subscribe(
          `/topic/server/${server.id}`,
          (message) => {
            setLoadingMessages(true);
            const body = JSON.parse(message.body);

            console.log("Received message:", body);
            setMessages((prev) => [...prev, body]);
            setLoadingMessages(false);
          }
        );
      },
    });


    stompClient.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

      stompClient.activate();

    stompClientRef.current = stompClient;

    setLoading(false);
    return () => {
      stompClient.deactivate();
    };
  }, [status, session?.springAccessToken, server?.id]);

  const sendMessage = (text: string) => {
    console.log("Sending message:", text);

    stompClientRef.current?.publish({
      destination: `/app/chat.send/${server.id}`,
      body: JSON.stringify({
        serverId: server?.id,
        content: text,
        sender: null, // Server will fill in sender info based on session
      }),
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="z-2 bg-zinc-800 text-white p-4">
        <span className="font-semibold">
          {server ? server.name : `Server ${server?.id}`}
        </span>
      </header>

      <main className="z-[0] flex-1 flex flex-col min-h-0 overflow-hidden p-4 bg-zinc-900 text-white">
        {loading || loadingMessages ? (
          <p>Loading chat…</p>
        ) : messages.length > 0 ? (
          <ScrollAnimation messages={messages} />
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </main>

      <footer className="z-2 p-4 bg-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem("message") as HTMLInputElement;
            const content = input.value.trim();
            if (!content) return;
            sendMessage(content);
            //input.value = "";
          }}
          className="flex"
        >
          <input
            name="message"
            className="flex-1 rounded px-2 py-1 text-black"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="ml-2 rounded bg-amber-500 px-4 py-1 text-black"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}