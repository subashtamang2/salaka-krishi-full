import {
    Box,
    Flex,
    useBreakpointValue
} from "@chakra-ui/react";
import { Rating } from 'react-simple-star-rating';

interface RatingProps {
    readOnly: boolean;
    rating?: number;
    setRating?: (rating: number) => void;
    fillColor?: string;
    size?: number;
}

export default function ReviewRating({
    size,
    readOnly,
    rating,
    setRating,
    fillColor = "#FFA500",
}: RatingProps) {
    const ratingSize = useBreakpointValue({
        base: size ?? 22,
        lg: size ?? 22,
    });
    return (
        <>
            <Flex
                alignItems="center" gap={2}>
                <Box display="inline-block" >
                    <Rating
                        onClick={(rate) => setRating?.(rate)}
                        initialValue={rating}
                        readonly={readOnly}
                        allowFraction
                        size={ratingSize}
                        fillColor={fillColor}
                        emptyColor="#FFFF"
                        SVGstorkeWidth={1}
                        SVGstrokeColor="#FFA500"
                        SVGstyle={{
                            display: 'inline-block',
                            marginRight: "8px",
                        }}
                    />
                </Box>
            </Flex>
        </>
    )
}
