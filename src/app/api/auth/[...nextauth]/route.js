// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"


export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				// Email ki jagah ab hum 'identifier' use kar rahe hain
				identifier: {
					label: "Email or Username",
					type: "text",
					placeholder: "admin@school.com or username123",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				// 1. Check if user exists in database using email OR username
				const user = await prisma.user.findFirst({
					where: {
						OR: [
							{ email: credentials.identifier },
							{ username: credentials.identifier }, // DB mein username column hona zaroori hai
						],
					},
				});

				if (!user) {
					console.log("User Not Found");
					throw new Error(
						"No user found with this email or username",
					);
				}
				

				// 2. Verify Password
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				// 3. Return user object (this gets passed to the JWT callback)
				
				return user;
			},
		}),
	],
    
	callbacks: {
		// JWT Callback: Yahan hum token ke andar user ka data daalte hain
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.userRole;
				token.schoolId = user.schoolId; // Embedding Tenant ID
				token.email = user.email; // Embedding Tenant ID
			}
			return token;
		},
		// Session Callback: Yahan hum frontend (browser) ke liye data expose karte hain
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.schoolId = token.schoolId; // Making it accessible everywhere
				session.user.email = token.email; // Making it accessible everywhere
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
