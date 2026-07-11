// /* eslint-disable @typescript-eslint/no-explicit-any */
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         try {
//           // 🎯 মেইন ফিক্স ১: URL-টি আপনার ব্যাকএন্ড পোর্ট (৮০৮০) এবং সঠিক রাউট অনুযায়ী সেট করা হলো
//           const res = await fetch(
//             "https://sreyoshi-server.vercel.app/api/v1/auth/login",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               // 🎯 মেইন ফিক্স ২: ফ্রন্টএন্ডের মতো এখানেও 'identity' কী (Key) ব্যবহার করা হলো
//               body: JSON.stringify({
//                 identity: credentials.email,
//                 password: credentials.password,
//               }),
//             },
//           );

//           if (!res.ok) {
//             console.error(
//               "❌ NextAuth Backend Auth Failed. Status:",
//               res.status,
//             );
//             return null;
//           }

//           const responseData = await res.json();

//           // ব্যাকএন্ড রেসপন্স থেকে ইউজার অবজেক্ট এবং টোকেন আলাদা করা
//           const actualData = responseData?.data || responseData;
//           const userDoc =
//             responseData?.data?.user || responseData?.user || actualData;
//           const accessToken =
//             responseData?.accessToken ||
//             responseData?.token ||
//             actualData?.accessToken;

//           if (userDoc && accessToken) {
//             return {
//               // ডাটাবেজের আসল আইডি ম্যাপ করা হচ্ছে
//               id: (userDoc._id || userDoc.id || actualData?._id) as string,
//               name: userDoc.name || actualData?.name,
//               email: userDoc.email || actualData?.email,
//               role: userDoc.role || actualData?.role,
//               accessToken: accessToken,
//             } as any;
//           }

//           return null;
//         } catch (error) {
//           console.error("💥 NextAuth Authorize Catch Error:", error);
//           return null;
//         }
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = (user as any).accessToken;
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user && token) {
//         (session.user as any).accessToken = token.accessToken;
//         (session.user as any).id = token.id;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//         (session.user as any).role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/signin",
//   },
//   secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
// });


/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// JWT টোকেন ডিকোড করে এক্সপায়ার ডেট চেক করার একটি সিম্পল হেল্পার ফাংশন
function isJwtExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { exp } = JSON.parse(jsonPayload);
    // বর্তমান সময়ের সাথে টোকেনের এক্সপায়ার টাইম কম্পেয়ার করা (সেকেন্ডে)
    return Date.now() >= exp * 1000;
  } catch {
    return true; // ডিকোড করতে না পারলে ধরে নেব এক্সপায়ার্ড
  }
}

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
          const res = await fetch(
            "https://sreyoshi-server.vercel.app/api/v1/auth/login",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                identity: credentials.email,
                password: credentials.password,
              }),
            },
          );

          if (!res.ok) {
            console.error(
              "❌ NextAuth Backend Auth Failed. Status:",
              res.status,
            );
            return null;
          }

          const responseData = await res.json();
          const actualData = responseData?.data || responseData;
          const userDoc =
            responseData?.data?.user || responseData?.user || actualData;
          const accessToken =
            responseData?.accessToken ||
            responseData?.token ||
            actualData?.accessToken;

          if (userDoc && accessToken) {
            return {
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

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 🎯 ১ দিন সেশন লাইফ (ব্যাকএন্ড টোকেন লাইফের সাথে সামঞ্জস্য রাখতে)
  },

  callbacks: {
    async jwt({ token, user }) {
      // প্রথমবার লগইন করার সময় ডেটা পুশ করা
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role;
      }

      // 🎯 মেইন ফিক্স ১: টোকেন যদি ব্যাকএন্ড থেকে এক্সপায়ার হয়ে যায়, তবে ফ্রন্টএন্ড টোকেন ফ্ল্যাগ সেট করে দেওয়া
      if (token.accessToken && isJwtExpired(token.accessToken as string)) {
        token.error = "AccessTokenExpired";
      }

      return token;
    },
    
    async session({ session, token }) {
      // 🎯 মেইন ফিক্স ২: যদি টোকেন এক্সপায়ার হয়ে এরর ফ্ল্যাগ চলে আসে, সেশন রিটার্ন না করে নাল (null) করে দেওয়া
      // এর ফলে মিডলওয়্যার বা হুক্স জেনুইনলি বুঝবে ইউজার লগড-আউট এবং লুপ চিরতরে বন্ধ হবে।
      if (token.error === "AccessTokenExpired" || !token.accessToken) {
        return null as any;
      }

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