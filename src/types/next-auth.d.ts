import NextAuth, { Account, DefaultSession, ISODateString } from "next-auth";

declare module "next-auth" {

  interface Session {
    user?: {
      id?: number;
      provider?: string | null;
      providerAccountId?: string | null
    } & DefaultSession["user"];
    accessToken?: string;
    expires: ISODateString;
  }

  type UserType = {
      id?: number;
      provider?: string | null;
      providerAccountId?: string | null;
    } & DefaultSession["user"];

  type ChatServer = {
    id?: number,
    name?: string | null,
    description?: string | null,
    image?: string | null
  } | null | never | undefined
}
