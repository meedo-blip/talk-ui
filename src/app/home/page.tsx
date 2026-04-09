"use client"
import { broPops } from "@/types/font";
import ServerList from "@/components/ServerList";
import { use, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getServerSession, User, UserType } from "next-auth";
import { getToken } from "next-auth/jwt";

export default function ChatsPage() {

  return (
    <div className="flex min-h-screen items-left justify-top flex-col bg-linear-to-b from-gray-500 to-zinc-900 font-sans dark:bg-black">
      <ServerList/>
    </div>
  );
}