"use client"
import { broPops } from "@/types/font";
import ServerList from "@/components/ServerList";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getServerSession, User, UserType } from "next-auth";
import { getToken } from "next-auth/jwt";

export default function ChatsPage() {
  const { data: session, status } = useSession();
;
  useEffect(() => {
    console.log("Session:", session);

    if (!session) return;


    fetch("/api/talk/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session.user),
    })
  }, [ session, status]);
    
    //console.log(`the link${process.env.TALK_SERVER_URL}/users/${session?.user?.id}`)
    
    //const session = await getServerSession();

    //talkFetch(`/users/${session?.user?.id}`, "POST", session?.user)
    
    return (
        <div className="flex min-h-screen items-left justify-top flex-col bg-linear-to-b from-gray-500 to-zinc-900 font-sans dark:bg-black">
            <ServerList/>
        </div>
    
       )
}