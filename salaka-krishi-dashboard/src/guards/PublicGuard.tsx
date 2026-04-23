"use client";

import { getAccessToken } from "api/local-storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const accessToken = getAccessToken();
        if (!accessToken) return; // user not logged in

        try {
            const tokenExpiry = accessToken.split('.')[1];
            const decodedToken = atob(tokenExpiry); // browser-safe
            const payload = JSON.parse(decodedToken);

            if (payload.exp) {
                const tokenExpiryTime = payload.exp * 1000;
                const currentTime = Date.now();

                if (tokenExpiryTime > currentTime) {
                    router.replace('/dashboard'); // redirect logged-in user
                }
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, [router]);

    if (!mounted) return null; // prevent hydration mismatch

    return <>{children}</>;
}
