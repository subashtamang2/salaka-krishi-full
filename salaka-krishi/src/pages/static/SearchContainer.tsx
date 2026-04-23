import {
    Button,
    Flex,
    Group,
    Input,
    InputAddon,
    useBreakpointValue
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { GrSearch } from "react-icons/gr";
interface SearchContainerProps {
    setSearchQuery: (query: string | null) => void;
}

export default function SearchContainer({ setSearchQuery }: SearchContainerProps) {
    const { register, handleSubmit, reset } = useForm<{ searchQuery: string }>();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const onSubmit = ({ searchQuery }: { searchQuery: string }) => {
        const trimmed = searchQuery.trim();
        setSearchQuery(trimmed || null); // pass null if empty
        reset(); // optional: clear input after submit
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex
                overflow={"hidden"}
                borderWidth={1}
                rounded={"sm"}
                borderColor={"primary.100"}
                alignItems={"stretch"}
            >
                <Group attached flex="1">
                    <InputAddon
                        display={{ base: "none", md: "flex" }}
                        border={"none"}
                        bg={"transparent"}
                        fontSize={"2xl"}
                        color={"muted.800"}
                        height={"full"}
                    >
                        <GrSearch />
                    </InputAddon>

                    <Input
                        placeholder='Ask a question...'
                        fontSize={"md"}
                        color={"muted.800"}
                        fontWeight={500}
                        {...register("searchQuery", { required: true })}
                        rounded={"none"}
                        border={"none"}
                        type="text"
                        _focus={{ boxShadow: "none", outline: "none" }}
                        height={"full"}
                    />
                </Group>

                <Button
                    width={"15%"}
                    py={{ base: 3, md: 4 }}
                    px={{ base: 6, md: 10 }}
                    borderStartEndRadius={"sm"}
                    borderEndEndRadius={"sm"}
                    fontWeight={400}
                    fontSize={"lg"}
                    type="submit"
                    border={"none"}
                    rounded={"none"}
                    color={"white"}
                    bg={"primary.100"}
                    height={"full"}
                >
                    {isMobile ? <GrSearch fontSize={"2xl"} /> : "Search"}
                </Button>
            </Flex>
        </form>
    );
}
