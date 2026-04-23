export const getImageSrc = (url: string | undefined | null) => {
    if (!url || url.trim() === "" || url === "null" || url === "undefined") {
        return undefined;
    }
    
    // If it's already a full URL, a data URI, or a local frontend asset, return it
    if (
        url.startsWith("http") || 
        url.startsWith("data:") || 
        url.startsWith("blob:") || 
        url.startsWith("/src/") || 
        url.startsWith("/assets/") ||
        url.startsWith("/@fs/")
    ) {
        return url;
    }
    
    // Handle leading slashes for backend paths
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;
    
    // Otherwise, append the base image URL from the environment
    const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL;
    return `${baseImageUrl}/${cleanUrl}`;
};
