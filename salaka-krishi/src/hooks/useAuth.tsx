import { useEffect } from "react";
import { useUserStore } from "@src/store/useUserStore";
import { getCurrentUserAPI } from "@src/api/auth";
import { getAccessToken } from "@src/utils/local-storage";
import { useQuery } from "@tanstack/react-query";

export default function useAuth() {
    const setUserDetail = useUserStore((state) => state.setUserDetail);
    const accessToken = getAccessToken();

    const { data: userData, refetch } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUserAPI().then((res) => res.data),
        enabled: !!accessToken,
    });

    useEffect(() => {
        if (userData?.data) {
            setUserDetail(userData.data);
        }
    }, [userData, setUserDetail]);

    return { userData, refetch };
}
