import axios from "@utils/axios-interceptor";
import urls from "./urls";
export function addProductReview(
    productId: string,
    reviewData: { rating: number; comment: string }
) {
    return axios({
        url: urls.addProductReview.url.replace(":productId", productId),
        method: urls.addProductReview.method,
        data: reviewData,
    });
}

export function getProductReview(productId: string, noOfReviews: number) {
    return axios({
        url: urls.getProductReview.url.replace(":productId", productId),
        method: urls.getProductReview.method,
        params: {
            noOfReviews,
        },
    });
}

export function getProductReviewInfo(productId: string) {
    return axios({
        url: urls.getProductReviewInfo.url.replace(":productId", productId),
        method: urls.getProductReviewInfo.method,
    });
}

export function checkUserReview(productId: string) {
    return axios({
        url: urls.checkUserReview.url.replace(":productId", productId),
        method: urls.checkUserReview.method,
    });
}
