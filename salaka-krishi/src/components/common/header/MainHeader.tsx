import {
    Flex,
    Grid,
    IconButton,
    Image,
    Input,
    Link,
    useBreakpointValue,
    Box,
    Stack,
    Spinner,
    Text as ChakraText
} from "@chakra-ui/react";
import logo from "@assets/logo/logo.svg";
import CustomContainer from "../CustomContainer";
import routes from "@src/router/routes";
import { useHeaderState } from "@src/contexts/HeaderStateProvider";
import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getQueryFilterProducts } from "@src/api/products";
import type { ProductSchema } from "@src/schema/product";
import { LuSearch } from "react-icons/lu";
import { CgMenuLeft } from "react-icons/cg";
import UserDetails from "./UserDetails";
import { getImageSrc } from "@src/utils/image";
import { useSiteInfo } from "@src/store/useSiteInfo";

export default function MainHeader() {
    const { open } = useHeaderState();
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const siteInfo = useSiteInfo((state) => state.siteInfo);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: searchResults, isLoading } = useQuery({
        queryKey: ["instant-search", debouncedQuery],
        queryFn: async () => {
            if (!debouncedQuery.trim()) return [];
            const res = await getQueryFilterProducts({ search: [debouncedQuery.trim()] });
            const responseData = res.data?.data;
            return (Array.isArray(responseData) ? responseData : (responseData as any)?.products ?? []) as ProductSchema[];
        },
        enabled: debouncedQuery.trim().length > 0,
    });

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`${routes.products.root}?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsDropdownOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <CustomContainer >
            <Grid gap={4} >
                <Grid
                    templateColumns={{
                        base: "55% auto",
                        md: "20% 48% auto",
                        lg: "20% 60% auto"
                    }}
                    py={4}
                    gap={4}
                    alignItems="center"
                    justifyContent="space-between">
                    {/* logo */}
                    <Flex width="full">
                        <Link
                            _focus={{ outline: "none" }}
                            href={routes.home}
                            width={{ base: "70%", md: "55%" }}>
                            <Image
                                src={getImageSrc(siteInfo?.logoUrl) || logo}
                                alt={siteInfo?.name || "salaka krishi"}
                            />
                        </Link>
                    </Flex>

                    {/* Search Box */}
                    <Flex alignItems="center"
                        display={{
                            base: "none",
                            md: "flex"
                        }}
                        justifyContent="center">
                        <Flex
                            w={{
                                base: "full",
                                md: "70%"
                            }}
                            position="relative"
                            ref={dropdownRef}
                        >
                            <Input
                                fontSize="sm"
                                borderColor={"primary.100"}
                                outline={"none"}
                                rounded={0}
                                py={0}
                                type="text"
                                placeholder="Search for products"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                onKeyDown={handleKeyDown}
                            />
                            <IconButton
                                aria-label="Search"
                                color={"secondary.200"}
                                _hover={{
                                    bg: "primary.300"
                                }}
                                cursor={"pointer"}
                                onClick={handleSearch}
                            >
                                <LuSearch />
                            </IconButton>

                            {/* Instant Search Results Dropdown */}
                            {isDropdownOpen && searchQuery.trim().length > 0 && (
                                <Box
                                    position="absolute"
                                    top="100%"
                                    left={0}
                                    right={0}
                                    bg="white"
                                    boxShadow="lg"
                                    zIndex={100}
                                    maxH="400px"
                                    overflowY="auto"
                                    mt={1}
                                    borderRadius="sm"
                                    border="1px solid"
                                    borderColor="gray.100"
                                >
                                    {isLoading ? (
                                        <Flex p={4} justify="center">
                                            <Spinner size="sm" color="primary.100" />
                                        </Flex>
                                    ) : searchResults && searchResults.length > 0 ? (
                                        <Stack gap={0}>
                                            {searchResults.slice(0, 5).map((product) => (
                                                <NavLink
                                                    key={product.id}
                                                    to={routes.productDetails.replace(":slug", product.slug)}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Flex
                                                        p={3}
                                                        align="center"
                                                        gap={3}
                                                        _hover={{ bg: "gray.50" }}
                                                        borderBottom="1px solid"
                                                        borderColor="gray.50"
                                                    >
                                                        <Image
                                                            src={getImageSrc((product.imageUrls || [])[0]) || undefined}
                                                            alt={product.name}
                                                            boxSize="40px"
                                                            objectFit="cover"
                                                            borderRadius="sm"
                                                        />
                                                        <Box flex={1}>
                                                            <ChakraText fontWeight="500" fontSize="sm" truncate>
                                                                {product.name}
                                                            </ChakraText>
                                                            <ChakraText fontSize="xs" color="primary.100">
                                                                Rs. {product.price}
                                                            </ChakraText>
                                                        </Box>
                                                    </Flex>
                                                </NavLink>
                                            ))}
                                            <Box
                                                p={2}
                                                textAlign="center"
                                                bg="gray.50"
                                                cursor="pointer"
                                                onClick={handleSearch}
                                            >
                                                <ChakraText fontSize="xs" fontWeight="600" color="primary.100">
                                                    See all results
                                                </ChakraText>
                                            </Box>
                                        </Stack>
                                    ) : (
                                        <Box p={4} textAlign="center">
                                            <ChakraText fontSize="sm" color="gray.500">
                                                No products found
                                            </ChakraText>
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Flex>
                    </Flex>
                    {/* menu button */}
                    <Flex px={3}

                        display={{
                            base: "flex",
                            md: "none"
                        }}>
                        <IconButton
                            display={{
                                base: "block",
                                md: "none"
                            }}
                            onClick={open}
                            fontSize={"3xl"}
                            color={"primary.100"}
                            height={"fit-content"}
                            background={"transparent"}
                            minW={"fit-content"}
                            aria-label="Menu">
                            <CgMenuLeft size={32} />
                        </IconButton>
                    </Flex>
                    {/* cart and user profile */}

                    {!isSmallScreen && <UserDetails />}

                </Grid>
            </Grid>
        </CustomContainer>
    );
}
