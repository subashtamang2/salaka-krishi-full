import {
    Accordion,
    Box,
    CloseButton,
    Checkbox,
    Flex,
    Heading,
    Stack,
    Text,
} from "@chakra-ui/react";
import { getCategories } from "@src/api/categories";
import type { CategorySchema } from "@src/schema/categories";
import type { DataWrapper } from "@src/schema/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import routes from "@src/router/routes";


interface FilterProps {
    open: boolean;
    onToggle: () => void;
    showCloseButton?: boolean;
}

const AVAILABILITY_OPTIONS = ["InStock", "OutOfStock", "PreOrder"];

export default function Filter({ open, onToggle, showCloseButton = true }: FilterProps) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { data: CategoriesRes, isLoading, isError } = useQuery<DataWrapper<CategorySchema[]>>({
        queryKey: ["all-categories"],
        queryFn: async () => {
            const res = await getCategories();
            return res.data;
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const categoriesFilter = CategoriesRes?.data || [];

    // Sync filters from URL
    useEffect(() => {
        const initialFilters: Record<string, string[]> = {};
        ["categories", "availability"].forEach((key) => {
            const value = searchParams.get(key);
            if (value) initialFilters[key] = value.split(",");
        });
        setSelectedFilters(initialFilters);
    }, [searchParams]);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>, group: string) => {
        const { value, checked } = e.target;

        // Calculate the new state immediately to use for side effects
        const currentGroup = selectedFilters[group] ? [...selectedFilters[group]] : [];
        let updatedGroup: string[];

        if (checked) {
            updatedGroup = currentGroup.includes(value) ? currentGroup : [...currentGroup, value];
        } else {
            updatedGroup = currentGroup.filter((item) => item !== value);
        }

        const updatedFilters = { ...selectedFilters, [group]: updatedGroup };

        // Update local state
        setSelectedFilters(updatedFilters);

        // Handle side effects (URL update and navigation)
        const newSearchParams = new URLSearchParams(searchParams);
        Object.entries(updatedFilters).forEach(([key, values]) => {
            if (values.length) newSearchParams.set(key, values.join(","));
            else newSearchParams.delete(key);
        });

        setSearchParams(newSearchParams);

        // Navigate to products page if not exactly on the root products page
        const hasFilter = Object.values(updatedFilters).flat().length > 0;
        const isRootProductsPage = location.pathname === routes.products.root;

        if (hasFilter && !isRootProductsPage) {
            navigate(`${routes.products.root}?${newSearchParams.toString()}`);
            onToggle();
        }
    };

    return (
        <Flex
            py={6}
            flexDir="column"
            gap={4}
            w="100%"
            display={{ base: open ? "flex" : "none", lg: "flex" }}>
            {/* Header */}
            <Flex justify="space-between" alignItems="center">
                <Heading fontWeight="600" fontSize="xl" color="primary.400">
                    Shop by Category
                </Heading>
                {showCloseButton && (
                    <CloseButton
                        onClick={onToggle}
                        color="text.400"
                        cursor="pointer"
                        display={{ base: "block", lg: "none" }}
                    />
                )}
            </Flex>

            <Accordion.Root defaultValue={["categories", "availability"]} multiple>

                {/* Categories */}
                <Accordion.Item value="categories" border="none">
                    <Accordion.ItemTrigger
                        px={0}
                        _hover={{ bg: "transparent" }}
                        cursor="pointer">
                        <Text fontWeight={600} color="black" flex={1} textAlign="left">
                            Categories
                        </Text>
                        <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent ps={5} pb={3}>
                        <Stack direction="column" gap={2}>
                            {isLoading && (
                                <Text fontSize="sm" color="gray.400">Loading categories...</Text>
                            )}
                            {isError && (
                                <Text fontSize="sm" color="red.400">Error loading categories</Text>
                            )}
                            {!isLoading && !isError && categoriesFilter.length === 0 && (
                                <Text fontSize="sm" color="gray.400">No categories found</Text>
                            )}
                            {categoriesFilter.map((filter) => (
                                <Checkbox.Root
                                    key={filter?.id}
                                    checked={selectedFilters?.categories?.includes(filter?.slug) ?? false}
                                    onCheckedChange={(details) => {
                                        const syntheticEvent = {
                                            target: {
                                                value: filter?.slug,
                                                checked: details.checked === true,
                                            },
                                        } as ChangeEvent<HTMLInputElement>;
                                        handleFilterChange(syntheticEvent, "categories");
                                    }}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label fontSize="sm">
                                        {filter?.name}
                                        {filter?._count?.products ? ` (${filter._count.products})` : ""}
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                        </Stack>
                    </Accordion.ItemContent>
                </Accordion.Item>

                {/* Availability */}
                <Accordion.Item value="availability" border="none" mt={3}>
                    <Accordion.ItemTrigger
                        px={0}
                        _hover={{ bg: "transparent" }}
                        cursor="pointer">
                        <Text fontWeight={600} color="black" flex={1} textAlign="left">
                            Availability
                        </Text>
                        <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent ps={5} pb={3}>
                        <Stack direction="column" gap={2}>
                            {AVAILABILITY_OPTIONS.map((opt) => (
                                <Checkbox.Root
                                    key={opt}
                                    checked={selectedFilters?.availability?.includes(opt) ?? false}
                                    onCheckedChange={(details) => {
                                        const syntheticEvent = {
                                            target: {
                                                value: opt,
                                                checked: details.checked === true,
                                            },
                                        } as ChangeEvent<HTMLInputElement>;
                                        handleFilterChange(syntheticEvent, "availability");
                                    }}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control />
                                    <Checkbox.Label fontSize="sm">
                                        {opt === "InStock" ? "In Stock" : opt === "OutOfStock" ? "Out of Stock" : opt === "PreOrder" ? "Pre Order" : opt}
                                    </Checkbox.Label>
                                </Checkbox.Root>
                            ))}
                        </Stack>
                    </Accordion.ItemContent>
                </Accordion.Item>

            </Accordion.Root>

            {/* Clear All */}
            {Object.values(selectedFilters).flat().length > 0 && (
                <Box>
                    <Text
                        fontSize="sm"
                        color="red.500"
                        cursor="pointer"
                        textDecoration="underline"
                        onClick={() => {
                            const newSearchParams = new URLSearchParams(searchParams);
                            ["categories", "availability"].forEach(key => newSearchParams.delete(key));
                            setSearchParams(newSearchParams);
                        }}>
                        Clear All Filters
                    </Text>
                </Box>
            )}
        </Flex>
    );
}
