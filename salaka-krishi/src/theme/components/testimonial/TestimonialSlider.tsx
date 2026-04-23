import {
    Flex,
} from "@chakra-ui/react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TestimonialCard from "../../../components/cards/TestimonialCard";
import type { ClientReviews } from "@src/schema/review";

const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1, },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1, },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, },
};
interface DotProps {
    onClick?: () => void;
    active?: boolean;
}
const CustomLineDot = ({ onClick, active }: DotProps) => (
    <Flex
        onClick={onClick}
        cursor="pointer"
        transition="all 0.3s ease"
        height="6px"
        width={active ? "60px" : "35px"}
        bg={active ? "primary.100" : "green.200"}
        borderRadius="full"
    />
);


export default function TestimonialSlider({ reviews }: { reviews: ClientReviews[] }) {
    return (
        <Flex

            flexDir={"column"}
            position="relative"
            width="full"
            overflow="hidden" >
            <Carousel
                removeArrowOnDeviceType={["mobile"]}
                responsive={responsive}
                autoPlay
                customDot={<CustomLineDot />}
                autoPlaySpeed={5000}
                infinite
                arrows={false}
                showDots={true}
                containerClass="carousel-container"
                itemClass="carousel-item">
                {
                    reviews.map((review) => (<TestimonialCard key={review.id} testimonial={review} />
                    ))}

            </Carousel>

        </Flex>
    );
}
