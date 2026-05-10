import { useSiteInfo } from "@src/store/useSiteInfo";
import { Helmet } from "react-helmet-async";
interface PropsInterface {
    title?: string | undefined;
    description?: string | undefined;
    keywords?: string[] | undefined;
    image?: string;
}
export default function SEOContent({ title, description, keywords = [], image }: PropsInterface) {
    const canonicalUrl = window.location.href;
    const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    const siteInfo = useSiteInfo((state) => state?.siteInfo);

    return (
        <Helmet>
            <title>{title ? `${title} - ${siteInfo?.name}` : siteInfo?.name}</title>
            <meta name="theme-color" content="#0C3B59" />

            <meta key="description" name="description" content={description ?? siteInfo?.description} />
            <link key="canonical" rel="canonical" href={canonicalUrl} />
            <meta key="keywords" name="keywords" content={keywords.length > 0 ? keywords.join(", ") : siteInfo?.keywords?.join(", ")} />
            {image && <meta key="image" name="image" content={`${imageBaseUrl}/${image ?? siteInfo?.logoUrl}`} />}

            <meta property="og:site_name" content={siteInfo?.name} />
            <meta property="og:url" content={canonicalUrl} />

            <meta key="og:type" property="og:type" content="website" />
            <meta key="og:title" property="og:title" content={`${title ?? siteInfo?.name}`} />
            <meta key="og:description" property="og:description" content={description ?? siteInfo?.description} />
            <meta key="og:url" property="og:url" content={canonicalUrl} />
            {image && <meta key="og:image" property="og:image" content={`${imageBaseUrl}/${image ?? siteInfo?.logoUrl}`} />}

            <meta key="twitter:site" name="twitter:site" content={`@${siteInfo?.name}`} />
            <meta key="twitter:creator" name="twitter:creator" content={`@${siteInfo?.name}`} />

            <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta key="twitter:title" name="twitter:title" content={`${title ?? siteInfo?.name}`} />
            <meta key="twitter:description" name="twitter:description" content={description ?? siteInfo?.description} />
            {image && <meta key="twitter:image" name="twitter:image" content={`${imageBaseUrl}/${image ?? siteInfo?.logoUrl}`} />}
        </Helmet>
    );
}
