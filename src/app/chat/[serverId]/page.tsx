"use client";

import React, { Usable } from "react";
import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServerList from "@/components/ServerList";
import ChatRoom from "@/components/ChatRoom";
import { get } from "http";

interface ChatPageProps {
  params: {
    serverId: string;
  };
}

export default function ChatPage({ params }: { params: Usable<{
    serverId: string;
  }>}) {
    
  const router = useRouter();
  const { serverId } = React.use(params);

  console.log("ChatPage serverId:", serverId);
  const [server, setServer] = useState<any>(null);

  useEffect(() => {
    if (!serverId) {
        console.log("No server ID provided)");
        return;
    }

    // fetch server details
    fetch(`/api/talk/chat-servers/${serverId}`, {
      method: "GET",
      headers: {
      },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("failed to load server");
        return r.json();
      })
      .then((s) => setServer(s))
      .catch(console.error);
  }, [serverId]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* reuse sidebar */}
      <ServerList />
      <ChatRoom server={server} />
    </div>
  );
}
