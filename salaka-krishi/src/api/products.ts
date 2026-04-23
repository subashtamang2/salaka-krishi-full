import axios from "@utils/axios-interceptor";
import type { ProductFilter } from "@src/schema/product";
import urls from "./urls";
import type { FilterParamsInterface } from "@src/schema/schema";

export function getFeaturedProducts() {
    return axios({
        url: urls.featuredproducts.url,
        method: urls.featuredproducts.method,
    });
}

export function getProductByFilter(filterType: ProductFilter) {
    const url = urls.getProductsByFilter.url.replace(":filterType", filterType);
    return axios({
        url: url,
        method: urls.getProductsByFilter.method,
    });
}

export function getProductDetails(slugOrId: string) {
    // Check if the input is a UUID (common format for product IDs)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const url = isUUID
        ? urls.getProductById.url.replace(":id", slugOrId)
        : urls.getProductDetails.url.replace(":slug", slugOrId);

    return axios({
        url: url,
        method: isUUID ? urls.getProductById.method : urls.getProductDetails.method,
    });
}

export function getQueryFilterProducts(params: FilterParamsInterface) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value && value.length) {
            queryParams.set(key, value.join(","));
        }
    });

    return axios({
        url: urls.getQueryFilterProducts.url,
        method: urls.getQueryFilterProducts.method,
        params: queryParams,
    });
}
