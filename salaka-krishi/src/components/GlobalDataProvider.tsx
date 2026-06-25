
import { getSiteInfo } from "@src/api/site-info";
import { type DataWrapper, type SiteInfo } from "@src/schema/schema";
import { useSiteInfo } from "@src/store/useSiteInfo";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

export default function GlobalDataProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const setSiteInfo = useSiteInfo((state) => state.setSiteInfo);

    const { data } = useQuery<DataWrapper<SiteInfo>>({
        queryKey: ["site-info"],
        queryFn: async () => {
            const res = await getSiteInfo();
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    });

    const siteInfoData = data?.data;

    useEffect(() => {
        if (siteInfoData) {
            setSiteInfo(siteInfoData);
        }
    }, [siteInfoData, setSiteInfo]);

    return (
        <>
            {siteInfoData && (
                <Helmet>
                    <title>{siteInfoData.name}</title>


                    <meta
                        name="description"
                        content={siteInfoData.description || ""}
                    />

                    <meta
                        name="keywords"
                        content={
                            Array.isArray(siteInfoData.keywords)
                                ? siteInfoData.keywords.join(", ")
                                : ""
                        }
                    />
                </Helmet>
            )}

            {children}
        </>
    );
}
