import WishlistCard from "@src/components/cards/WishlistCard";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import { Helmet } from "react-helmet-async";

export default function Wishlist() {
    return (
        <>
            <Helmet>
                <title>Wishlist - Salaka Krishi</title>
            </Helmet>
            <CustomContainer py={10}>
                <BreadCrumb />
                <WishlistCard />
            </CustomContainer>
        </>
    );
}
