import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      role: string;
      status: string;
    } & DefaultSession["user"];
  }
}
