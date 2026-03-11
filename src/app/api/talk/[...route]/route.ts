import { sign } from "crypto";
import { getToken } from "next-auth/jwt";
import { signOut } from "next-auth/react";
import { NextRequest } from "next/server";

// This route acts as a proxy to the talk server, forwarding requests and attaching the user's access token for authentication.
// It supports GET, POST, and PUT methods, allowing the frontend to interact with the talk server's API without exposing the access token directly to the client.

// Availlable requests: /chat-servers /chat-servers/:id 
//                      /users /users/:id
//                      /auth/social

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("TOKEN:", token);

    if (!token || !token.springAccessToken) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();

    const routePath = req.url.split("/api/talk/")[1]; // Extract the path after /api/talk/

    const response = await fetch(
      `${process.env.TALK_SERVER_URL}/${routePath}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token.springAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.text();

    return new Response(data, { status: response.status });

  } catch (err: any) {
    console.error("API CHAT SERVERS ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
} 


export async function POST(req: NextRequest) {

  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("TOKEN:", token);

    if (!token || !token.springAccessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const routePath = req.url.split("/api/talk/")[1]; // Extract the path after /api/talk/

    console.log("ROUTE PATH:", routePath);

    const response = await fetch(
      `${process.env.TALK_SERVER_URL}/${routePath}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token.springAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.text();

    return new Response(data, { status: response.status });

  } catch (err: any) {
    console.error("API CHAT SERVERS ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
} 


export async function GET(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("TOKEN:", token);

    if (!token || !token.springAccessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    //const body = await req.json();

    const routePath = req.url.split("/api/talk/")[1]; // Extract the path after /api/talk/

    const response = await fetch(
      `${process.env.TALK_SERVER_URL}/${routePath}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token.springAccessToken}`,
        },

      }
    );


    const data = await response.text();

    return new Response(data, { status: response.status });

  } catch (err: any) {
    console.error("API CHAT SERVERS ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
} 

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log("TOKEN:", token);

    if (!token || !token.springAccessToken) {
      return new Response("Unauthorized", { status: 401 });
    }

    //const body = await req.json();

    const routePath = req.url.split("/api/talk/")[1]; // Extract the path after /api/talk/

    const response = await fetch(
      `${process.env.TALK_SERVER_URL}/${routePath}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token.springAccessToken}`,
        },

      }
    );


    const data = await response.text();

    return new Response(data, { status: response.status });

  } catch (err: any) {
    console.error("API CHAT SERVERS ERROR:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
} 