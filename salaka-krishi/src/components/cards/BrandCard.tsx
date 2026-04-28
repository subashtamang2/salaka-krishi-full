import { Flex, Image } from "@chakra-ui/react";
import type { BrandCardSchema } from "@src/schema/schema";
interface BrandCardprops {
    data: BrandCardSchema,
}


export default function BrandCard({ data }: BrandCardprops) {
    return (
        <>
            <Flex
                alignItems={"center"}
                justifyContent={"center"} >
                    <Flex
                        width={"180px"}
                        height={"74px"}>
                        <Image
                            src={data.logo}
                            alt={data.name}
                            objectFit={"contain"}
                        />
                    </Flex>



            </Flex>


        </>)


}
