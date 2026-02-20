
"use client";
import "./globals.css";
import { broPops } from "@/types/font";
import { getSession, signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  
  const {data: session, status} = useSession();
  
  if (status === "authenticated") {
    redirect("/home");
  }
    
  return  <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className={"text-amber-50 text-7xl " + broPops.className}>
          Talk
        </div>
        <h3 className="text-zinc-400 mb-16 text-2xl w-sm text-center sm:text-left">
          Chat with friends and family anywhere, anytime.   
        </h3>

        <button onClick={() => signIn()} className="mb-16 rounded-full bg-amber-400 px-6 py-3 font-medium text-black hover:cursor-pointer">
          Get Started
        </button>
        
      </main>

    </div>;
}
