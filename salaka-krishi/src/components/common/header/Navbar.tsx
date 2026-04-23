import {
    Box,
    Button,
    CloseButton,
    Drawer,
    Flex,
    Grid,
    GridItem,
    Image,
    Link,
    Stack,
} from "@chakra-ui/react";
import CustomContainer from "../CustomContainer";
import { NavLink, useLocation } from "react-router";
import routes from "@src/router/routes";
import { NavbarList, productsMenu } from "@src/data/Navbar";
import { useHeaderState } from "@src/contexts/HeaderStateProvider";
import { GoChevronDown } from "react-icons/go";
import UserDetails from "./UserDetails";
import logo from "@assets/logo/logo.svg";
import { useRef, useEffect, useState } from "react";
import Filter from "@src/pages/productCollection.tsx/Filter";


export default function Navbar() {
    const {
        isOpen,
        close,
        isSubNavOpen,
        setSubNavOpen,
        navRef,
        toggleSubMenu
    } = useHeaderState();
    const { pathname } = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter drawer state (replaces old useDisclosure from Chakra v2)
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setSubNavOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setSubNavOpen]);


    return (
        <Box
            position="relative"
            borderTopColor={"primary.100/30"}
            borderTopWidth={1}
            ref={navRef}>
            <CustomContainer
                boxShadow="sm">
                <Grid
                    gap={4}
                    justifyContent="space-between"
                    templateColumns={{
                        base: "auto auto",
                        md: "auto 53%",
                        lg: "auto 45%",
                    }}>
                    <GridItem placeContent="center">
                        <Button
                            onClick={openFilter}
                            size={"lg"}
                            _hover={{ bg: "primary.300" }}
                            variant={"solid"}>
                            Shop By Category
                        </Button>
                    </GridItem>

                    <GridItem
                        placeContent="center"
                        w="full">
                        <Flex
                            bg={{
                                base: "white",
                                md: "transparent"
                            }}
                            position={{
                                base: "fixed",
                                md: "static"
                            }}
                            overflow={{
                                base: "hidden",
                                md: "visible"
                            }}
                            top={0}
                            right={0}
                            zIndex={10}
                            width={{
                                base: isOpen ? "100%" : "0%",
                                md: "auto"
                            }}
                            px={{
                                base: isOpen ? 4 : 0,
                                md: 0
                            }}
                            py={{
                                base: isOpen ? 4 : 0,
                                md: 0
                            }}

                            direction={{
                                base: "column",
                                md: "row"
                            }}
                            height={{
                                base: "103dvh",
                                md: "auto"
                            }}
                            justifyContent={{
                                base: "flex-start",
                                md: "space-between"
                            }}>
                            {/* ---------------- MOBILE HEADER ---------------- */}
                            <Flex
                                position="relative"
                                mb={4}
                                pb={4}
                                borderColor="primary.100"
                                borderBottomWidth={2}
                                flexDir="column"
                                display={{
                                    base: "flex",
                                    md: "none"
                                }} >
                                <CloseButton
                                    position="absolute"
                                    left={"176px"}
                                    mb={2}
                                    onClick={close}
                                    fontSize="xl"
                                    color="primary.100"
                                    alignSelf="flex-end"
                                    ms={"auto"}
                                    cursor="pointer"
                                />
                                <Flex

                                    gap={12}
                                    flexDir="column">
                                    <Flex width="40%">
                                        <Link href={routes.home} width={{
                                            base: "100%",
                                            xl: "80%",
                                        }}>
                                            <Image src={logo} alt="salaka krishi" />
                                        </Link>
                                    </Flex>
                                    <UserDetails />
                                </Flex>
                            </Flex>

                            {/* ---------------- NAV ITEMS ---------------- */}
                            <Flex

                                direction={{
                                    base: "column",
                                    md: "row"
                                }}
                                gap={{
                                    base: 4,
                                    md: 6,
                                    lg: 8,
                                }}>

                                {NavbarList.map((item) => {
                                    if (item.children) {
                                        const isActive = pathname.startsWith(item.href);
                                        return (
                                            <Box
                                                key={item.id}
                                                color={isActive ? "primary.300" : "primary.100"}
                                                position="relative">
                                                <Flex

                                                    alignItems={"center"}
                                                    cursor="pointer"
                                                    fontWeight="medium"
                                                    onClick={toggleSubMenu}
                                                    gap={1}>
                                                    {item.label}
                                                    <GoChevronDown color={isActive ? "primary.300" : "primary.100"} />

                                                </Flex>

                                                {isSubNavOpen && (
                                                    <Stack
                                                        ref={dropdownRef}
                                                        position={{
                                                            md: "absolute"
                                                        }}
                                                        bg="white/80"
                                                        shadow="md"
                                                        mt={2}
                                                        rounded="md"
                                                        zIndex={30}>
                                                        {productsMenu.map((child) => (
                                                            <NavLink
                                                                key={child.id}
                                                                to={child.href}
                                                                onClick={() => {
                                                                    close();
                                                                    setSubNavOpen(false);
                                                                }}>
                                                                <Box
                                                                    px={4}
                                                                    py={2}
                                                                    _hover={{ bg: "gray.100" }} >
                                                                    {child.label}
                                                                </Box>
                                                            </NavLink>
                                                        ))}
                                                    </Stack>
                                                )}
                                            </Box>
                                        );
                                    }

                                    return (
                                        <NavLink
                                            key={item.id}
                                            to={item.href}
                                            onClick={() => {
                                                close();
                                                setSubNavOpen(false);
                                            }}>
                                            {({ isActive }) => (
                                                <Box
                                                    color={isActive ? "primary.300" : "primary.100"}
                                                    fontWeight="medium">
                                                    {item.label}
                                                </Box>

                                            )}

                                        </NavLink>
                                    );
                                })}
                            </Flex>

                            {/* Mobile Close Button */}
                            {isOpen && (
                                <CloseButton
                                    display={{
                                        base: "block",
                                        md: "none"
                                    }}
                                    position="absolute"
                                    top={4}
                                    right={4}
                                    onClick={close}
                                    cursor="pointer"
                                />
                            )}
                        </Flex>
                    </GridItem>
                </Grid>
            </CustomContainer>

            {/* ────── Filter Drawer (Chakra UI v3) ────── */}
            <Drawer.Root
                open={isFilterOpen}
                placement="start"
                onOpenChange={(e) => setIsFilterOpen(e.open)}>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content
                        minH="100vh"
                        overflowY="auto"
                        css={{
                            "&::-webkit-scrollbar": { width: "2px" },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "var(--chakra-colors-secondary-400)",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "var(--chakra-colors-secondary-200)",
                            },
                        }}>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton position="absolute" top={4} right={4} cursor="pointer" />
                        </Drawer.CloseTrigger>
                        <Drawer.Body pt={8}>
                            <Filter
                                open={isFilterOpen}
                                onToggle={closeFilter}
                                showCloseButton={false}
                            />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Box>
    );
}
