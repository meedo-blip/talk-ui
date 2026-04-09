import NextAuth, { Account, DefaultSession, ISODateString, User } from "next-auth";

declare module "next-auth" {

  interface Session {
    user?: {
      id?: number;
      provider?: string | null;
      providerAccountId?: string | null
    } & DefaultSession["user"];
    springAccessToken?: string;
    expires: ISODateString;
  }

  type UserType = {
      id?: number;
      provider?: string | null;
      providerAccountId?: string | null;
    } & DefaultSession["user"];

  type SpringUser = {
      id?: number;
      provider?: string | null;
      providerAccountId?: string | null;
      email?: string | null;
      details?: {
        name?: string | null;
        image?: string | null;
      } | null;
    }
  type ChatServer = {
    id?: number,
    name?: string | null,
    description?: string | null,
    image?: string | null,
    ownerId?: number
  } | null | never | undefined

}

export type Message = {
  serverId: number;
  sender: UserType;
  content: string;
  timestamp: string;
}
