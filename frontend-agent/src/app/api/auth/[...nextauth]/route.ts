import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user }) {
            // Called after OAuth success — we just allow all sign-ins
            return true;
        },
        async session({ session, token }) {
            // Pass the user id/name into the session
            if (session.user) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
        async jwt({ token, account, profile }) {
            return token;
        },
        async redirect({ url, baseUrl }) {
            // After OAuth, redirect to our profile-setup page which checks if profile exists
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/profile-setup`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
