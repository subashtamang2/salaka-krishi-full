import {
    Avatar,
    Circle,
    Flex,
    IconButton,
    Menu,
    Portal,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import routes from "@src/router/routes";

import {
    PiShoppingCartLight,
    PiHeartStraightLight,
    PiPackage,
    PiSignOut,
} from "react-icons/pi";
import { useNavigate } from "react-router"
import { getAccessToken } from "@src/utils/local-storage";
import { RiLoginCircleLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@src/api/cart";
import { getWishlist } from "@src/api/wishlist";
import { useUserStore } from "@src/store/useUserStore";
import useLogout from "@src/utils/useLogout";
import { FaRegUserCircle } from "react-icons/fa";

export default function UserDetails() {
    const user = useUserStore(state => state.userDetail);
    const logout = useLogout();
    const navigate = useNavigate();
    const accessToken = getAccessToken();

    const { data: cartData } = useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart().then((res) => res.data),
        enabled: !!accessToken,
    });

    const { data: wishlistData } = useQuery({
        queryKey: ["wishlist"],
        queryFn: () => getWishlist().then((res) => res.data),
        enabled: !!accessToken,
    });

    if (!accessToken)
        return (
            <>
                <IconButton
                    aria-label="Previous"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    variant="ghost"
                    size="2xl"
                    className="large-icon"
                    onClick={() => navigate(`${routes.auth.base}`)}>
                    <RiLoginCircleLine />
                </IconButton>

            </>)


    return (
        <Flex
            gap={2}
            position="relative"
            justifyContent={{
                base: "start",
                md: "flex-end"
            }}
            alignItems="center"
            ps={{ md: 3 }} >

            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Flex
                        position="relative"
                        alignItems="center">
                        <Circle
                            mr={2}
                            zIndex={2}
                            size="4"
                            bg="primary.100"
                            top={0}
                            fontSize="xs"
                            fontWeight="light"
                            position="absolute"
                            right={1}
                            color="white" >
                            {wishlistData?.data?.products?.length ?? user?.noOfProductInWishlist ?? 0}
                        </Circle>
                        <IconButton
                            fontSize="2xl"
                            onClick={() => navigate(routes.wishList)}
                            aria-label="heart"
                            bg="transparent"
                            color="muted.200"
                            size={"2xl"}
                            rounded="md"
                            className="large-icon"
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}>
                            < PiHeartStraightLight />
                        </IconButton>
                    </Flex>
                </Tooltip.Trigger>
            </Tooltip.Root>


            <Tooltip.Root >
                <Tooltip.Trigger asChild >
                    <Flex
                        zIndex={1}
                        position="relative"
                        alignItems="center">
                        <Circle
                            zIndex={2}
                            size="4"
                            mr={2}
                            bg="primary.100"
                            top={0}
                            fontSize="xs"
                            fontWeight="light"
                            position="absolute"
                            right={1}
                            color="white" >
                            {cartData?.data?.totalItems ?? cartData?.data?.products?.length ?? user?.noOfProductInCart ?? 0}
                        </Circle>
                        <IconButton
                            onClick={() => navigate(routes.cart.base)}
                            aria-label="Cart"
                            bg="transparent"
                            color="muted.200"
                            className="large-icon"
                            rounded="md"
                            _hover={{ bg: "transparent" }}
                            _active={{ bg: "transparent" }}
                            size={"2xl"}
                        >
                            <PiShoppingCartLight />
                        </IconButton>
                    </Flex>
                </Tooltip.Trigger>

            </Tooltip.Root>

            <Menu.Root positioning={{ placement: "bottom", offset: { mainAxis: 2 } }}>
                <Menu.Trigger asChild>
                    <IconButton
                        variant="ghost"
                        bg="transparent"
                        _hover={{ bg: "transparent" }}
                        _active={{ bg: "transparent" }}
                        _focus={{ bg: "transparent", outline: "none", boxShadow: "none" }}
                        className="large-icon"
                        aria-label="User Menu"
                        p={0}
                        minW="auto"
                        height="40px"
                        width="40px"
                    >
                        <Avatar.Root size="sm">
                            <Avatar.Fallback bg="#E8E8E8" color="#0FA958">
                                {user?.firstName ? (
                                    <Text fontWeight="600" fontSize="16px" color="#0FA958">
                                        {user.firstName.charAt(0).toUpperCase()}
                                    </Text>
                                ) : (
                                    <FaRegUserCircle size={20} color="#0FA958" />
                                )}
                            </Avatar.Fallback>
                            {user?.profileUrl && (
                                <Avatar.Image
                                    src={user.profileUrl}
                                    alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                                />
                            )}
                        </Avatar.Root>
                    </IconButton>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner >
                        <Menu.Content
                            minW="210px"
                            bg="white"
                            boxShadow="0 4px 12px rgba(0,0,0,0.15)"
                            borderRadius="2px"
                            py={0}
                            zIndex="popover"
                            border="none"
                        >
                            {(user?.firstName || user?.email) && (
                                <Flex
                                    px={4}
                                    py={4}
                                    borderBottom="1px solid"
                                    borderColor="#f5f5f5"
                                    alignItems="center"
                                    gap={3}
                                >
                                    <Avatar.Root size="sm" flexShrink={0}>
                                        <Avatar.Fallback bg="#E8E8E8" color="#0FA958">
                                            {user?.firstName ? (
                                                <Text fontWeight="600" fontSize="16px" color="#0FA958">
                                                    {user.firstName.charAt(0).toUpperCase()}
                                                </Text>
                                            ) : (
                                                <FaRegUserCircle size={20} color="#0FA958" />
                                            )}
                                        </Avatar.Fallback>
                                        {user?.profileUrl && (
                                            <Avatar.Image
                                                src={user.profileUrl}
                                                alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                                            />
                                        )}
                                    </Avatar.Root>
                                    <Flex flexDir="column" overflow="hidden">
                                        <Text fontSize="14px" fontWeight="600" color="#212121" truncate lineClamp={1}>
                                            {`${user?.firstName || "User"} ${user?.lastName || ""}`}
                                        </Text>
                                        <Text fontSize="12px" fontWeight="400" color="#757575" truncate lineClamp={1}>
                                            {user?.email}
                                        </Text>
                                    </Flex>
                                </Flex>
                            )}
                            <Menu.Item
                                value="my-orders"
                                onClick={() => navigate(routes.orderHistory)}
                                _hover={{ bg: "#f5f5f5" }}
                                px={4}
                                py={3}
                                cursor="pointer"
                                transition="all 0.2s"
                            >
                                <Flex alignItems="center" gap={4}>
                                    <PiPackage size={24} color="#757575" />
                                    <Text fontSize="14px" fontWeight="400" color="#212121">My Orders</Text>
                                </Flex>
                            </Menu.Item>

                            <Menu.Item
                                value="logout"
                                onClick={logout}
                                _hover={{ bg: "#f5f5f5" }}
                                px={4}
                                py={3}
                                cursor="pointer"
                                transition="all 0.2s"
                            >
                                <Flex alignItems="center" gap={4}>
                                    <PiSignOut size={24} color="#757575" />
                                    <Text fontSize="14px" fontWeight="400" color="#212121">Log out</Text>
                                </Flex>
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex >
    );
}
