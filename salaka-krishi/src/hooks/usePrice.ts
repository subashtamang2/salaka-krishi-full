import { useSettingsStore } from "@src/store/useSettingsStore";

export const usePrice = () => {
    const { currency } = useSettingsStore();

    const exchangeRate = 135; // 1 USD = 135 NPR
    const defaultCurrencyType = import.meta.env.VITE_CURRENCY_TYPE || "Rs.";

    const formatPrice = (priceInNpr: number) => {
        const convertedPrice = currency === "USD" ? priceInNpr / exchangeRate : priceInNpr;
        const symbol = currency === "USD" ? "$" : defaultCurrencyType;

        const formatted = convertedPrice.toLocaleString(undefined, {
            minimumFractionDigits: currency === "USD" ? 2 : 0,
            maximumFractionDigits: currency === "USD" ? 2 : 0,
        });

        return `${symbol} ${formatted}`;
    };

    return { formatPrice, currency };
};
