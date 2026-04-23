import { getSiteInfo } from "@src/api/site-info";
import { type DataWrapper, type SiteInfo } from "@src/schema/schema";
import { useSiteInfo } from "@src/store/useSiteInfo";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function GlobalDataProvider({ children }: { children: React.ReactNode }) {
    const setSiteInfo = useSiteInfo((state) => state.setSiteInfo);

    const { data } = useQuery<DataWrapper<SiteInfo>>({
        queryKey: ['site-info'],
        queryFn: async () => {
            const res = await getSiteInfo();
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    })

    const siteInfoData = data?.data;

    useEffect(() => {
        if (siteInfoData) {
            console.log("DEBUG: Global Sync - Fetched Site Info:", siteInfoData);
            setSiteInfo(siteInfoData);
        }
    }, [siteInfoData, setSiteInfo]);

    return <>{children}</>;
}
