import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDatabase } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email && user.name) {
        try {
          await connectToDatabase();

          const existingUser = await User.findOne({ googleId: account.providerAccountId });

          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image || undefined,
              googleId: account.providerAccountId,
            });
          } else {
            await User.findByIdAndUpdate(existingUser._id, {
              name: user.name,
              image: user.image || undefined,
            });
          }

          return true;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return true;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ googleId: token.sub });
          if (dbUser) {
            session.user.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error fetching user from database:", error);
        }
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
