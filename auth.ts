import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import {AUTHOR_BY_GOOGLE_ID_QUERY, AUTHOR_BY_ID_QUERY_TO, STARTUPS_BY_ID_QUERY} from "@/lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    callbacks: {

        async signIn({ user, profile ,account}) {
            try {
                const existingUser = await client
                    .withConfig({useCdn:false})
                    .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
                    id: profile.sub,
                });


                if (!existingUser) {
                    // console.log("User:", user);
                    // console.log("Account:", account);
                    // console.log("Profile:", profile);

                    await writeClient.create({
                        _type: "author",
                        id: profile?.sub,
                        name: user?.name ,
                        username: "",
                        email: user?.email,
                        image: user?.image ,
                        bio:  "",
                    });
                }

                return true; // Ensure sign-in is allowed
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false; // Reject sign-in if an error occurs
            }
        },

        async jwt({ token, profile, account }) {
            try {
                if (profile && account) {
                    const user = await client
                        .withConfig({useCdn:false})
                        .fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
                        id: profile?.sub,
                    });
                    token.id = user._id ; // Add user's ID to the token
                }
            } catch (error) {
                console.error("Error during JWT callback:", error);
            }
            return token;
        },


        async session({ session, token }) {
            Object.assign(session, { id: token.id });
            return session;
        },
    },
});
