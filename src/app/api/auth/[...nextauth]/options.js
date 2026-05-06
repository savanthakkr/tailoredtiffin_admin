import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        try {
          const res = await fetch("https://api.tailoredtiffin.com/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    inputdata: {
      email: credentials?.email,
      password: credentials?.password,
      firebase_token: ""
    }
  })
});

          const data = await res.json();

          console.log("API RESPONSE:", data);

          // error handling
          if (!res.ok || data.status === "error") {
            throw new Error(data?.msg || "Invalid login");
          }

          // ✔ Correct mapping based on your actual backend response
          const user = {
            id: data?.data?.admin?.admin_id,
            name: data?.data?.admin?.name,
            email: data?.data?.admin?.email,
            mobile_no: data?.data?.admin?.mobile_no,
            token: data?.data?.token
          };

          return user;

        } catch (err) {
          throw new Error(err.message || "Login API error");
        }
      }
    })
  ],

  pages: {
    signIn: "/auth/sign-in"
  },

  callbacks: {
    async jwt({ token, user }) {
      // Save user payload into JWT on first login
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      // Make user & token available on frontend
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    }
  },

  secret: process.env.NEXTAUTH_SECRET
};
