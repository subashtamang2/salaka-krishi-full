import { Text } from "@chakra-ui/react";
interface ContentBlockProps {
    data: string;
    textStyle?: string;
}
export default function ContentBlock({ data, textStyle = "textSm" }: ContentBlockProps) {
    console.log(data);
    return (
        <Text
            as="div"
            textStyle={textStyle}
            dangerouslySetInnerHTML={{ __html: data }}
        />
    );
}
