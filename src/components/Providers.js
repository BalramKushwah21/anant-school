// src/components/Providers.js
"use client";

import { SessionProvider } from "next-auth/react";

export const Providers = ({ children }) => {
	return (
		<SessionProvider
			refetchOnWindowFocus={false} // 👈 Yeh line add karein
			refetchInterval={0} // 👈 (Optional) Interval checking band karne ke liye
		>
			{children}
		</SessionProvider>
	);
};
