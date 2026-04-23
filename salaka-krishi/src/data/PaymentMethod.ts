
import esewaIcon from "@assets/paymentMethods/esewa logo.svg";
import khaltiIcon from "@assets/paymentMethods/Khalti logo.svg";
interface PaymentMethod {
    id: string;
    icon: string;
    name: string;
}
export const paymentMethods: PaymentMethod[] = [
    {
        id: "1",
        icon: esewaIcon,
        name: "eSewa",
    },
    {
        id: "2",
        icon: khaltiIcon,
        name: "Khalti",
    },

]
