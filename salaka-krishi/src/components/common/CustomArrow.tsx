import {
    Flex,
    IconButton
} from "@chakra-ui/react";
import {
    FaArrowLeftLong,
    FaArrowRightLong
} from "react-icons/fa6";
type CustomButtonGroupProps = {
    next?: () => void;
    previous?: () => void;
    goToSlide?: (index: number) => void;
    carouselState?: {
        currentSlide: number;
        totalItems: number;
        slidesToShow: number;
        deviceType: string;
    };
};

export const ButtonGroup = ({
    next,
    previous,
    carouselState,
}: CustomButtonGroupProps) => {
    const currentSlide = carouselState?.currentSlide ?? 0;
    const totalItems = carouselState?.totalItems ?? 0;
    const slidesToShow = carouselState?.slidesToShow ?? 1;
    const isLastSlide = currentSlide + slidesToShow >= totalItems;
    const isFirstSlide = currentSlide === 0;
    return (
        <Flex
            position="absolute"
            top="50%"
            width={{
                base: "100%",
                md: "104%",
                lg: "106%"
            }}
            left={{
                base: "0%",
                md: "-2%",
                lg: "-3%"
            }}
            justifyContent={"space-between"}
            zIndex={50}>
            <IconButton
                className="custom-icon-btn"
                aria-label="Previous"
                onClick={previous}
                pointerEvents="auto"
                disabled={isFirstSlide}
                fontSize={{ base: "sm", md: "lg", }}
                width={{ base: "40px", md: "30px" }}
                height={{ base: "40px", md: "40px" }}
                bg="primary.100"
                color={isFirstSlide ? "secondary.200" : "secondary.200"}
                boxShadow="md"
                borderRadius="full"
                _hover={{ bg: "primary.300", color: "secondary.200" }}>
                <FaArrowLeftLong size={2} />
            </IconButton>


            <IconButton
                className="custom-icon-btn"
                aria-label="Next"
                onClick={next}
                pointerEvents="auto"
                disabled={isLastSlide}
                bg="primary.100"
                color={isLastSlide ? "secondary.200" : "secondary.200"}
                boxShadow="md"
                borderRadius="full"
                fontSize={{ base: "sm", md: "lg", }}
                width={{ base: "40px", md: "30px" }}
                height={{ base: "40px", md: "40px"}}
                _hover={{ bg: "primary.300", color: "secondary.200" }}>
                <FaArrowRightLong />
            </IconButton>
        </Flex>

    );
};
