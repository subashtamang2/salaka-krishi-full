import { getMyOrders } from "@src/api/order";
import BreadCrumb from "@src/components/common/BreadCrumb";
import CustomContainer from "@src/components/common/CustomContainer";
import OrderLoading from "@src/pages/Loadings/OrderLoading";
import NotFound from "@src/pages/NotFound";
import type { OrderInterface } from "@src/schema/schema";
import { getAccessToken } from "@src/utils/local-storage";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Flex,
    Text,
    Badge,
    VStack,
    HStack,
    Separator,
    Button,
    Image
} from "@chakra-ui/react";
import { useNavigate } from "react-router";
import routes from "@src/router/routes";
import { usePrice } from "@src/hooks/usePrice";
import { getImageSrc } from "@src/utils/image";
import { LuPackage, LuCheck, LuTruck, LuClock, LuInfo, LuBan } from "react-icons/lu";
import CancelOrderDialog from "./CancelOrderDialog";

export default function OrderHistory() {
    const accessToken = getAccessToken();
    const navigate = useNavigate();
    const { formatPrice } = usePrice();
    const { data, isLoading, isError } = useQuery<OrderInterface[]>({
        queryKey: ['my-orders'],
        enabled: !!accessToken,
        queryFn: async () => {
            const res = await getMyOrders();
            return res.data;
        }
    });

    if (isError) return <NotFound title="Orders not found" />;
    if (isLoading) return <OrderLoading />;

    const orders = Array.isArray(data) ? data : (data as any)?.data || [];

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "Delivered": return { color: "green", icon: LuCheck };
            case "Pending": return { color: "yellow", icon: LuClock };
            case "Processing": return { color: "blue", icon: LuPackage };
            case "Shipped": return { color: "blue", icon: LuTruck };
            case "Cancelled": return { color: "red", icon: LuBan };
            case "Returned": return { color: "orange", icon: LuInfo };
            default: return { color: "gray", icon: LuInfo };
        }
    };

    return (
        <>
            <Helmet>
                <title>My Orders - Salaka Krishi</title>
            </Helmet>
            <CustomContainer py={10}>
                <BreadCrumb />
                <VStack
                    align="stretch"
                    gap={6}
                    mt={6}>
                    <Text
                        fontSize="2xl"
                        fontWeight="700"
                        color="primary.300">
                        My Orders
                    </Text>
                    {orders.length === 0 ? (
                        <Box
                            textAlign="center"
                            py={10}>
                            <Text
                                color="muted.300">
                                You haven't placed any orders yet.
                            </Text>
                            <Button
                                mt={4}
                                onClick={() => navigate(routes.home)}>
                                Start Shopping
                            </Button>
                        </Box>
                    ) : (
                        orders.map((order: OrderInterface) => (
                            <Box
                                key={order.id}
                                p={{ base: 4, md: 6 }}
                                borderWidth={1}
                                borderColor="primary.100/20"
                                borderRadius="lg"
                                bg="white"
                                shadow="sm"
                                _hover={{ shadow: "md", transition: "all 0.2s" }}
                            >
                                <Flex
                                    justifyContent="space-between"
                                    mb={4}
                                    wrap="wrap"
                                    gap={4}>
                                    <HStack
                                        gap={6}
                                        wrap="wrap">
                                        <VStack
                                            align="start"
                                            gap={1}>
                                            <Text
                                                fontWeight="600"
                                                fontSize="xs"
                                                color="primary.100"
                                                textTransform="uppercase">
                                                Order Number
                                            </Text>
                                            <Text
                                                fontWeight="700"
                                                color="primary.400"
                                                fontSize="sm">
                                                {order.orderNumber}
                                            </Text>
                                        </VStack>
                                        <VStack
                                            align="start"
                                            gap={1}>
                                            <Text
                                                fontWeight="600"
                                                fontSize="xs"
                                                color="primary.100"
                                                textTransform="uppercase">
                                                Date Placed
                                            </Text>
                                            <Text
                                                fontSize="sm">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </Text>
                                        </VStack>
                                        <VStack
                                            align="start"
                                            gap={1}>
                                            <Text
                                                fontWeight="600"
                                                fontSize="xs"
                                                color="primary.100"
                                                textTransform="uppercase">
                                                Total Amount
                                            </Text>
                                            <Text
                                                fontWeight="700"
                                                fontSize="sm">
                                                {formatPrice(order.total)}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                    <HStack
                                        gap={4}>
                                        <VStack
                                            align="end"
                                            gap={1}>
                                            <Badge
                                                colorPalette={getStatusInfo(order.orderStatus).color}
                                                variant="solid"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}>
                                                {(() => {
                                                    const IconComp = getStatusInfo(order.orderStatus).icon;
                                                    return <IconComp size={12} />;
                                                })()}
                                                {order.orderStatus}
                                            </Badge>
                                            <Text
                                                fontSize="xs"
                                                color="primary.300">
                                                {order.paymentProvider}
                                                {order.orderStatus === 'Cancelled' && order.paymentStatus === 'Paid' && (
                                                    <Text as="span" color="red.500" fontWeight="bold"> (Refund Pending)</Text>
                                                )}
                                            </Text>
                                        </VStack>

                                        <Flex gap={2}
                                            flexDir={{
                                                base: "column",
                                                sm: "row"
                                            }}>
                                            {['Pending', 'Processing'].includes(order.orderStatus) && (
                                                <CancelOrderDialog
                                                    orderId={order.id}
                                                    orderNumber={order.orderNumber}
                                                />
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                borderColor="primary.100"
                                                color="primary.300"
                                                _hover={{ bg: "primary.300", color: "white" }}
                                                onClick={() => navigate(`${routes.orderHistory}/${order.id}`)}
                                            >
                                               Order Details
                                            </Button>
                                        </Flex>
                                    </HStack>
                                </Flex>
                                <Separator
                                    mb={4}
                                    opacity={0.3}
                                />
                                <VStack
                                    align="stretch"
                                    gap={3}>
                                    {order.items.slice(0, 3).map((item: any) => (
                                        <Flex
                                            key={item.id}
                                            justifyContent="space-between"
                                            alignItems="center">
                                            <HStack gap={4}>
                                                <Box
                                                    boxSize="50px"
                                                    borderRadius="md"
                                                    overflow="hidden"
                                                    borderWidth={1}
                                                    borderColor="gray.100"
                                                >
                                                    <Image
                                                        src={getImageSrc(item.product?.imageUrls?.[0] || "")}
                                                        alt={item.name}
                                                        objectFit="cover"
                                                    />
                                                </Box>
                                                <VStack
                                                    align="start"
                                                    gap={0}>
                                                    <Text
                                                        fontWeight="500"
                                                        fontSize="sm"
                                                        lineClamp={1}>
                                                        {item.name}
                                                    </Text>
                                                    <Text
                                                        color="primary.200"
                                                        fontSize="xs">
                                                        Qty: {item.quantity}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                            <Text
                                                fontWeight="600"
                                                fontSize="sm">
                                                {formatPrice(item.price * item.quantity)}
                                            </Text>
                                        </Flex>
                                    ))}
                                    {order.items.length > 3 && (
                                        <Text
                                            fontSize="xs"
                                            color="primary.200"
                                            textAlign="center">
                                            + {order.items.length - 3} more items
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        ))
                    )}
                </VStack>
            </CustomContainer>
        </>
    );
}
