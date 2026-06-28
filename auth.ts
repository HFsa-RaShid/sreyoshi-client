/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
          // 🎯 মেইন ফিক্স ১: URL-টি আপনার ব্যাকএন্ড পোর্ট (৮০৮০) এবং সঠিক রাউট অনুযায়ী সেট করা হলো
          const res = await fetch("http://localhost:8080/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // 🎯 মেইন ফিক্স ২: ফ্রন্টএন্ডের মতো এখানেও 'identity' কী (Key) ব্যবহার করা হলো
            body: JSON.stringify({
              identity: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error("❌ NextAuth Backend Auth Failed. Status:", res.status);
            return null;
          }

          const responseData = await res.json();
          
          // ব্যাকএন্ড রেসপন্স থেকে ইউজার অবজেক্ট এবং টোকেন আলাদা করা
          const actualData = responseData?.data || responseData;
          const userDoc = responseData?.data?.user || responseData?.user || actualData; 
          const accessToken = responseData?.accessToken || responseData?.token || actualData?.accessToken;

          if (userDoc && accessToken) {
            return {
              // ডাটাবেজের আসল আইডি ম্যাপ করা হচ্ছে
              id: (userDoc._id || userDoc.id || actualData?._id) as string, 
              name: userDoc.name || actualData?.name,
              email: userDoc.email || actualData?.email,
              role: userDoc.role || actualData?.role, 
              accessToken: accessToken,
            } as any;
          }
          
          return null;
        } catch (error) {
          console.error("💥 NextAuth Authorize Catch Error:", error);
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
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id; 
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});