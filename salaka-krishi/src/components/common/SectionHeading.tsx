import {
    Flex,
    Heading,
    Text
} from "@chakra-ui/react";
interface SectionHeadingProps {
    mainText?: string;
    highlightText?: string;
    title?: string
}
export default function SectionHeading({
    title
}: SectionHeadingProps) {
    const titleArray = title?.split(" ");
    console.log(title, titleArray);
    const mainText = titleArray?.[0];
    const highlightText
        = titleArray?.[1];
    return (
        <>
            <Flex
                flexDir={"column"}>
                <Heading
                    textStyle={"sectionTitle"}>
                    {mainText}{" "}
                    {highlightText &&
                        <Text as="span">
                            {highlightText}
                        </Text>}
                </Heading>

            </Flex>
        </>)
}
