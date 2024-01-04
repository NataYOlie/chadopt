import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";


const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" }
            },

            async authorize(credentials) {
                await connectToDB();
                const dbUser = await User
                    .findOne({ username: credentials.username })
                    .populate("favorites");

                if (dbUser && (await bcrypt.compare(credentials.password, dbUser.password))) {
                    const user = {
                        _id: dbUser._id.toString(),
                        username: dbUser.username,
                        role: dbUser.role,
                        favorites: dbUser.favorites
                    };
                    return user ;

                } else {
                    console.log("PASSWORDS COMPARE ERROR");
                    return null ;
                }
            }
        })
    ],

    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // token valide pendant 30 jours

        // Options de session
        async sessionUser({ session, user }) {
            // Si l'utilisateur de la session est différent de l'utilisateur retourné par authorize, la session doit
            // être mise à jour avec le nouvel utilisateur
            if (user && session.user && user._id !== session.user._id) {
                console.log("Session user is different from authorize user. Updating session...");
                session.user = user; // utilisateur mis à jour
            }
            return session;
        }
    },

    callbacks: {
        // Gestion des événements de session, etc.
        async session({ session, token }) {
            console.log("callback session")
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            console.log("callback jwt")
            if (user) {
                token.user = user;
                console.log(token.user)
            }
            console.log(token)
            return token;
        },
    },

    debug: true,

});
export { handler as GET, handler as POST};
