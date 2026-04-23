"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccessToken } from "api/local-storage";
import { getCurrentUser } from "api/staff";
import Loading from "app/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CurrentUser, DataWrapper } from "schema/schema";
import { userStore } from "store/userStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const setUser = userStore((state) => state.setUser);

    const accessToken = getAccessToken();

    const { data: currentUser, isLoading, isError } = useQuery<DataWrapper<CurrentUser>>({
        queryKey: ["current-user"],
        queryFn: async () => {
            const res = await getCurrentUser();
            return res.data;
        },
        enabled: Boolean(accessToken),
    });

    useEffect(() => {
        setMounted(true);
        if (!accessToken) {
            router.replace('/');
            return;
        }
        try {
            const tokenExpiry = accessToken!.split('.')[1];
            const decodedToken = Buffer.from(tokenExpiry, 'base64').toString('utf-8');
            const payload = JSON.parse(decodedToken);

            if (!payload.exp) router.replace('/');
            const tokenExpiryTime = new Date(payload.exp * 1000).getTime();
            const currentTime = new Date().getTime();

            if (tokenExpiryTime < currentTime) router.replace('/');

            if (isError) throw new Error("erro while storing user");

        } catch (error) {
            router.replace('/');
        }
    }, [router]);


    if (!mounted || isLoading) return <Loading></Loading>;

    if (currentUser) {
        setUser(currentUser.data);
    }

    return <>{children}</>;
}
