import axios from "@utils/axios-interceptor";
import urls from "./urls";
export function getBlog(page: number, limit: number) {
    return axios({
        url: urls.getBlog.url,
        method: urls.getBlog.method,
        params: {
            page,
            limit,
        },
    });
}

export function getBlogsByCategory(categorySlug: string) {
    const url = urls.getBlogByCategory.url.replace(":slug", categorySlug);
    return axios({
        url: url,
        method: urls.getBlogByCategory.method,
    });
}

export function getBlogDetails(slug: string) {
    const url = urls.getBlogDetails.url.replace(":slug", slug);
    return axios({
        url: url,
        method: urls.getBlogDetails.method,
    });
}

