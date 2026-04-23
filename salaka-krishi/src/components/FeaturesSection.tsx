import { Grid } from "@chakra-ui/react";
import { featureData } from "@src/data/Features";
import FeatureCard from "./cards/FeaturesCard";
import CustomContainer from "./common/CustomContainer";


export default function FeaturesSection() {
    return (
        <CustomContainer>
            <Grid
                templateColumns={{
                    base: "1fr",
                    sm: "repeat(2,1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                }}
                gap={10}
                py={16}>
                {featureData.map((item) => (
                    <FeatureCard
                        key={item.id}
                        data={item} />
                ))}
            </Grid>
        </CustomContainer>
    );
}
