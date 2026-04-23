import {
    Accordion,
    Flex,
    Heading,
    Span,
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import type { faq } from "@src/schema/faq";

interface FaqProps {
    data: faq[],
    heading: string,
}
export default function FaqCard({ data, heading }: FaqProps) {
    return (
        <>
            <Flex
                flexDir={"column"}
                gap={8}>
                <Heading
                    fontFamily={"primary"}
                    fontSize={{
                        base: "xl",
                        md: "2xl"
                    }}
                    fontWeight={700}
                    color={"primary.300"}>
                    {heading}
                </Heading>
                <Accordion.Root
                    collapsible
                    defaultValue={data.length > 0 ? [data[0].id] : []} >
                    {data.map((item, index) => (
                        <Accordion.Item
                            key={item.id || index}
                            value={item.id || `item-${index}`}
                            borderBottomWidth={1}
                            borderBottomColor="muted.800"
                            overflow="hidden" >

                            <Accordion.ItemTrigger
                                display="flex"
                                alignItems="center"
                                py={4}
                                gap={3} >

                                <Accordion.ItemContext>
                                    {(ctx: any) =>
                                        (ctx.open || ctx.expanded) ? (
                                            <FaMinus size={14} color="muted.700" />
                                        ) : (
                                            <FaPlus size={14} color="muted.700" />
                                        )
                                    }
                                </Accordion.ItemContext>

                                <Span
                                    fontFamily={"primary"}
                                    color={"muted.700"}
                                    fontSize={"lg"}
                                    flex="1"
                                    fontWeight="500">
                                    {item.question}
                                </Span>
                            </Accordion.ItemTrigger>


                            <Accordion.ItemContent >
                                <Accordion.ItemBody
                                    fontFamily={"primary"}
                                    pt={2}
                                    lineHeight="30px"
                                    pb={2}
                                    fontSize={"md"}
                                    color={"muted.800"}
                                    fontWeight={400}
                                    px="24px" >
                                    {item.answer}
                                </Accordion.ItemBody>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Flex>

        </>
    );
}
