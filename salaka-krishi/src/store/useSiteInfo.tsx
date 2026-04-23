import type { SiteInfo } from "@src/schema/schema";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { EMAIL, PHONE, SITE_DESCRIPTION, SITE_NAME } from "@src/utils/constants";

interface StoreProps {
    siteInfo: SiteInfo | null;
    setSiteInfo: (info: SiteInfo) => void;
    resetSiteInfo: () => void;
}
export const useSiteInfo = create(
    devtools(
        persist<StoreProps>(
            (set) => ({
                siteInfo: {
                    id: "local",
                    name: SITE_NAME,
                    description: SITE_DESCRIPTION,
                    email: EMAIL,
                    phone: PHONE,
                    logoUrl: "",
                    keywords: [],
                    address: "",
                    socialMediaLinks: {},
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: "system"
                },
                setSiteInfo: (payload) => set(() => ({ siteInfo: payload })),
                resetSiteInfo: () => {
                    set(() => ({ siteInfo: null }));
                },
            }),
            {
                name: "site-info",
            }
        )
    ))
