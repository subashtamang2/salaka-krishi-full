import type { CreateOverallReviewInterface } from "@src/schema/overallReviews";
import urls from "./urls";
import axios from "@utils/axios-interceptor";

export function addOverallReview(data: CreateOverallReviewInterface) {
    return axios({
        url: urls.addOverallReview.url,
        method: urls.addOverallReview.method,
        data,
    });
}

export function getOverallReviews() {
    return axios({
        url: urls.getOverallReview.url,
        method: urls.getOverallReview.method,
    });
}
