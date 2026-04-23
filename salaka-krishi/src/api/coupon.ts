import urls from "./urls";
import axios from "@src/utils/axios-interceptor";

export const validateCoupon = async (code: string, totalAmount: number) => {
    const response = await axios({
        url: `${urls.validateCoupon.url.replace(":code", code)}?totalAmount=${totalAmount}`,
        method: urls.validateCoupon.method,
    });
    return response.data;
};
