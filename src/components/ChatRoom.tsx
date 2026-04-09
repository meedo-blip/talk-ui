"use client";

import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useSession } from "next-auth/react";
import { Message } from "@/types/types";
import { ScrollAnimation } from "./ChatScrollList";
import EmojiPicker from 'emoji-picker-react';

export default function ChatRoom({ server }: { server: any }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    let active = true;
    if (!server?.id || !session?.springAccessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadingMessages(true);
    setMessages([]);

    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/talk/chat-servers/${server.id}/messages`);
        if (!response.ok) {
          throw new Error(`Failed to load chat history: ${response.status}`);
        }
        const data: Message[] = await response.json();
        if (active) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Error fetching message history:", error);
      } finally {
        if (active) {
          setLoadingMessages(false);
        }
      }
    };

    fetchHistory();

    console.log("Connecting to WebSocket with token:", session?.springAccessToken);
    const stompClient = new Client({
      brokerURL: "ws://localhost:8080/ws/",
      connectHeaders: {
        Authorization: `Bearer ${session.springAccessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected");

        stompClient.subscribe(`/topic/server/${server.id}`, (message) => {
          const body = JSON.parse(message.body);
          console.log("Received message:", body);
          if (active) {
            setMessages((prev) => [...prev, body]);
          }
        });
      },
    });

    stompClient.onStompError = (frame) => {
      console.error("Broker error:", frame.headers["message"]);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;
    setLoading(false);

    return () => {
      active = false;
      stompClient.deactivate();
    };
  }, [session?.springAccessToken, server?.id]);

  const sendMessage = (text: string) => {
    console.log("Sending message:", text);

    stompClientRef.current?.publish({
      destination: `/app/chat.send/${server.id}`,
      body: JSON.stringify({
        serverId: server?.id,
        content: text,
        sender: null,
      }),
    });
    setInputValue("");
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputValue(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full">
      <header className="z-2 bg-zinc-800 text-white px-4 py-3 sm:px-4 sm:py-4">
        <span className="font-semibold text-sm sm:text-base">
          {server ? server.name : `Server ${server?.id}`}
        </span>
      </header>

      <main className="z-[0] flex-1 flex flex-col min-h-0 overflow-hidden p-3 sm:p-4 bg-zinc-900 text-white">
        {loading || loadingMessages ? (
          <p>Loading chat…</p>
        ) : messages.length > 0 ? (
          <ScrollAnimation messages={messages} />
        ) : (
          <p className="text-gray-400">No messages yet.</p>
        )}
      </main>

      <footer className="z-2 p-3 sm:p-4 bg-zinc-800 relative flex-shrink-0 sticky bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = inputValue.trim();
            if (!content) return;
            sendMessage(content);
          }}
          className="flex flex-wrap gap-2 items-end"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-w-0 rounded px-2 py-2 text-black break-words"
            placeholder="Type a message..."
          />
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="rounded bg-gray-500 px-4 py-2 text-white w-full sm:w-auto"
          >
            😀
          </button>
          <button
            type="submit"
            className="rounded bg-amber-500 px-4 py-2 text-black w-full sm:w-auto"
          >
            Send
          </button>
        </form>
        {showPicker && (
          <div className="absolute bottom-20 right-4 sm:right-4 left-4 sm:left-auto z-10 max-h-[50vh] overflow-auto">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </footer>
    </div>
  );
}