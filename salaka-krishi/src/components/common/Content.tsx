import { Text } from "@chakra-ui/react";
interface ContentBlockProps {
    data: string;
    textStyle?: string;
}
export default function ContentBlock({ data, textStyle = "textSm" }: ContentBlockProps) {
    const cleanContent = data
        .replace(/&nbsp;/g, " ")
        .replace(/\u00A0/g, " ");


    return (
        <Text
            as="div"
            textStyle={textStyle}
            dangerouslySetInnerHTML={{ __html: cleanContent}}

            overflowWrap="break-word"
        />
    );
}
