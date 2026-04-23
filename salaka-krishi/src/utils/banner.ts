import type { BannerSchema } from "@src/schema/banner";

export function mapBannerData(
  banner: BannerSchema | null,
  navigateToProductDetails: (slug: string) => void, // <-- change here
  baseImageUrl: string,
  defaultSubTitle?: string
) {
  if (!banner) return null;

  const now = new Date();
  if (banner.startDate && new Date(banner.startDate) > now) return null;
  if (banner.endDate && new Date(banner.endDate) < now) return null;

  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${baseImageUrl}/${url}`;
  };

  return {
    title: banner.title,
    subTitle: banner.subtitle || defaultSubTitle || "",
    description: banner.description || "",
    buttonLink: () => {
      const targetSlug = banner.productId?.toString(); // convert number to string
      if (targetSlug) navigateToProductDetails(targetSlug);
    },
    images: [
      {
        url: normalizeUrl(banner.imageUrl),
        title: banner.title,
      },
    ],
  };
}
