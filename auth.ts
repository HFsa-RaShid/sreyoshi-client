/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.log("❌ Backend Auth Failed, status:", res.status);
            return null;
          }

          const data = await res.json();
          console.log("✅ Backend Data Received:", data);

          if (data && data.accessToken) {
            const decoded: any = jwtDecode(data.accessToken);

            // 💡 টাইপ এরর ফিক্স করতে ইমেইলকে স্পষ্ট 'string' কাস্ট করা হয়েছে
            const userEmail = credentials.email as string;

            return {
              id: (decoded._id || "user-id") as string,
              name: userEmail.split("@")[0], 
              email: userEmail, // 🚀 Fixed: '{}' is not assignable to 'string' এরর দূর হলো
              role: decoded.role || "user",
              accessToken: data.accessToken,
            } as any; // 💡 NextAuth User interface টাইপ ব্লকিং এড়াতে কাস্টিং করা হয়েছে
          }
          
          return null;
        } catch (error) {
          console.error("💥 Auth Error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.AUTH_SECRET,
});