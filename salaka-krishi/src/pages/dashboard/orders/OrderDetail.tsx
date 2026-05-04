import { getOrderDetails } from "@src/api/order";
import CustomContainer from "@src/components/common/CustomContainer";
import NotFound from "@src/pages/NotFound";
import type { OrderInterface } from "@src/schema/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import {
    Box,
    Flex,
    Text,
    VStack,
    HStack,
    Separator,
    Badge,
    Image,
    Button,
    SimpleGrid,
    Circle,
    Skeleton
} from "@chakra-ui/react";
import { usePrice } from "@src/hooks/usePrice";
import { getImageSrc } from "@src/utils/image";
import { LuPackage, LuCheck, LuTruck, LuArrowLeft, LuClock, LuDownload, LuRefreshCw } from "react-icons/lu";
import { addTocart } from "@src/api/cart";
import { toaster } from "@src/components/ui/toaster";
import routes from "@src/router/routes";
import { generateInvoicePDF } from "@src/utils/invoiceGenerator";
import CancelOrderDialog from "./CancelOrderDialog";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { formatPrice } = usePrice();
    const queryClient = useQueryClient();

    const { data: order, isLoading, isError } = useQuery<OrderInterface>({
        queryKey: ['order-detail', id],
        enabled: !!id,
        queryFn: async () => {
            const res = await getOrderDetails(id!);
            return res.data;
        }
    });

    const reorderMutation = useMutation({
        mutationFn: async (items: any[]) => {
            for (const item of items) {
                await addTocart(item.productId, item.quantity);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toaster.create({
                title: "Added to Cart",
                description: "All items from this order have been added to your cart.",
                type: "success",
            });
            navigate(routes.cart.base);
        },
        onError: () => {
            toaster.create({
                title: "Error",
                description: "Failed to reorder items. Please try again.",
                type: "error",
            });
        }
    });

    const handleDownload = async () => {
        if (order) {
            try {
                await generateInvoicePDF(order);
            } catch (error) {
                console.error("Failed to generate PDF:", error);
                toaster.create({
                    title: "Error",
                    description: "Failed to download invoice. Please try again.",
                    type: "error",
                });
            }
        }
    };

    if (isError) return <NotFound title="Order details not found" />;

    // Inline loading UI for "Production Level" feel
    if (isLoading || !order) {
        return (
            <CustomContainer py={10}>
                <Skeleton
                    height="40px"
                    width="150px"
                    mb={6} />
                <Flex
                    justifyContent="space-between"
                    mb={8}
                    wrap="wrap"
                    gap={4}>
                    <VStack
                        align="start">
                        <Skeleton
                            height="35px"
                            width="300px" />
                        <Skeleton
                            height="20px"
                            width="200px" />
                    </VStack>
                    <HStack>
                        <Skeleton
                            height="40px"
                            width="120px" />
                        <Skeleton
                            height="40px"
                            width="120px" />
                    </HStack>
                </Flex>
                <Skeleton
                    height="150px"
                    width="full"
                    mb={8}
                    borderRadius="xl" />
                <SimpleGrid
                    columns={{
                        base: 1,
                        lg: 3
                    }}
                    gap={8}>
                    <Skeleton
                        height="400px"
                        width="full"
                        borderRadius="xl"
                        gridColumn={{ lg: "span 2" }} />
                    <VStack
                        align="stretch"
                        gap={8}>
                        <Skeleton
                            height="250px"
                            width="full"
                            borderRadius="xl" />
                        <Skeleton
                            height="200px"
                            width="full"
                            borderRadius="xl" />
                    </VStack>
                </SimpleGrid>
            </CustomContainer>
        );
    }

    const steps = [
        { label: "Ordered", status: "Pending", icon: LuClock },
        { label: "Processing", status: "Processing", icon: LuPackage },
        { label: "Shipped", status: "Shipped", icon: LuTruck },
        { label: "Delivered", status: "Delivered", icon: LuCheck },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.orderStatus);
    const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "green";
            case "Pending": return "yellow";
            case "Processing": return "blue";
            case "Shipped": return "blue";
            case "Cancelled": return "red";
            case "Returned": return "orange";
            default: return "blue";
        }
    };

    return (
        <Box animation="fade-in">
            <Helmet>
                <title>Order Details - {order.orderNumber}</title>
            </Helmet>
            <CustomContainer py={10}>
                <Button
                    variant="ghost"
                    mb={6}
                    onClick={() => navigate(-1)}
                    color="primary.300"
                    className="no-print"
                >
                    <LuArrowLeft /> Back to Orders
                </Button>

                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={8}
                    wrap="wrap"
                    gap={4}>
                    <VStack align="start" gap={1}>
                        <HStack>
                            <Text
                                fontSize="2xl"
                                fontWeight="700">
                                Order #{order.orderNumber}</Text>
                            <Badge
                                colorPalette={getStatusColor(order.orderStatus)}
                                variant="solid"
                                px={3}>
                                {order.orderStatus}
                            </Badge>
                        </HStack>
                        <Text
                         color={"primary.100"}>
                            Place on
                            {new Date(order.createdAt).toLocaleString()}</Text>
                        {order.orderStatus === 'Cancelled' && order.isRefundPending && (
                            <Text color="red.500" fontWeight="bold" fontSize="sm">
                                Refund Pending: Our team will process your refund manually.
                            </Text>
                        )}
                        {order.orderStatus === 'Cancelled' && order.cancellationReason && (
                            <Text color="gray.500" fontStyle="italic" fontSize="sm">
                                Reason: {order.cancellationReason}
                            </Text>
                        )}
                    </VStack>
                    <HStack
                        gap={4}
                        className="no-print">
                        {['Pending', 'Processing'].includes(order.orderStatus) && (
                            <CancelOrderDialog 
                                orderId={order.id} 
                                orderNumber={order.orderNumber}
                                trigger={
                                    <Button colorPalette="red" variant="outline">
                                        Cancel Order
                                    </Button>
                                }
                            />
                        )}
                        <Button
                            variant="outline"
                            borderColor="primary.100"
                            _hover={{
                                borderColor: "transparent"
                            }}
                            onClick={handleDownload}>
                            <LuDownload />
                            Download Invoice
                        </Button>
                        <Button
                            variant="outline"
                            borderColor="primary.100"
                            _hover={{
                                borderColor: "transparent"
                            }}
                            loading={reorderMutation.isPending}
                            onClick={() => reorderMutation.mutate(order.items)}
                        >
                            <LuRefreshCw />
                            Reorder All
                        </Button>
                    </HStack>
                </Flex>

                {/* Status Tracker */}
                <Box
                    bg="white"
                    p={8}
                    borderRadius="xl"
                    shadow="sm"
                    mb={8}
                    borderWidth={1}
                    borderColor="primary.100/10"
                    className="no-print">
                    <Flex
                        justifyContent="space-between"
                        position="relative" >
                        {/* Connecting Line */}
                        <Box
                            position="absolute"
                            top="24px"
                            left="50px"
                            right="50px"
                            height="2px"
                            bg="gray.100"
                            zIndex={0}
                        />
                        <Box
                            position="absolute"
                            top="24px"
                            left="50px"
                            width={`${(activeIndex / (steps.length - 1)) * 88}%`}
                            height="2px"
                            bg="primary.300"
                            zIndex={0}
                            transition="width 0.5s ease"
                        />

                        {steps.map((step, index) => {
                            const isCompleted = index <= activeIndex;
                            const IconComp = step.icon;
                            return (
                                <VStack
                                    key={step.label}
                                    zIndex={1}
                                    flex={1}>
                                    <Circle
                                        size="50px"
                                        bg={isCompleted ? "primary.300" : "white"}
                                        color={isCompleted ? "white" : "gray.300"}
                                        borderWidth={2}
                                        borderColor={isCompleted ? "primary.300" : "gray.100"}
                                        shadow={isCompleted ? "md" : "none"}
                                    >
                                        <IconComp size={24} />
                                    </Circle>
                                    <Text
                                        fontWeight={isCompleted ? "600" : "500"}
                                        color={isCompleted ? "primary.400" : "gray.300"}
                                        fontSize="sm">
                                        {step.label}
                                    </Text>
                                </VStack>
                            );
                        })}
                    </Flex>
                </Box>

                <SimpleGrid
                    columns={{
                        base: 1,
                        lg: 3
                    }}
                    gap={8}>
                    {/* Order Items */}
                    <Box gridColumn={{ lg: "span 2" }}>
                        <Box
                            bg="white"
                            borderRadius="xl"
                            shadow="sm"
                            overflow="hidden"
                            borderWidth={1}
                            borderColor="primary.100/10">
                            <Box
                                p={6}
                                borderBottomWidth={1}
                                borderColor="gray.50">
                                <Text
                                    fontWeight="700"
                                    fontSize="lg">
                                    Order Items
                                </Text>
                            </Box>
                            <VStack
                                align="stretch"
                                p={0}
                                gap={0}>
                                {order.items.map((item, idx) => (
                                    <Box
                                        key={item.id}
                                        p={6}
                                        borderBottomWidth={idx === order.items.length - 1 ? 0 : 1}
                                        borderColor="gray.50">
                                        <Flex
                                            gap={6}
                                            align="center">
                                            <Box
                                                boxSize="80px"
                                                borderRadius="lg"
                                                overflow="hidden"
                                                flexShrink={0}
                                                borderWidth={1}
                                                borderColor="gray.100"
                                            >
                                                <Image
                                                    src={getImageSrc(item.product?.imageUrls?.[0] || "")}
                                                    alt={item.name}
                                                    objectFit="cover"
                                                    h="full"
                                                    w="full"
                                                />
                                            </Box>
                                            <VStack
                                                align="start"
                                                flex={1}
                                                gap={1}>
                                                <Text
                                                    fontWeight="600"
                                                    fontSize="md">
                                                    {item.name}
                                                </Text>
                                                <Text
                                                    color="primary.200"
                                                    fontSize="sm">
                                                    Quantity: {item.quantity}
                                                </Text>
                                                <Text
                                                    color="primary.200"
                                                    fontWeight="700">
                                                    {formatPrice(item.price)}
                                                </Text>
                                            </VStack>
                                            <Text
                                                fontWeight="700"
                                                fontSize="lg"
                                                color="primary.400">
                                                {formatPrice(item.price * item.quantity)}
                                            </Text>
                                        </Flex>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>
                    </Box>

                    {/* Order Summary & Shipping */}
                    <VStack
                        align="stretch"
                        gap={8}>
                        <Box
                            bg="white"
                            p={6}
                            borderRadius="xl"
                            shadow="sm"
                            borderWidth={1}
                            borderColor="primary.100/10">
                            <Text
                                fontWeight="700"
                                fontSize="lg"
                                mb={4}>
                                Order Summary
                            </Text>
                            <VStack
                                align="stretch"
                                gap={3}>
                                <Flex
                                    justifyContent="space-between">
                                    <Text
                                        color="primary.200">
                                        Subtotal
                                    </Text>
                                    <Text
                                        fontWeight="600">
                                        {formatPrice(order.subTotal)}
                                    </Text>
                                </Flex>
                                <Flex
                                    justifyContent="space-between">
                                    <Text
                                        color="primary.200">
                                        Delivery Fee
                                    </Text>
                                    <Text
                                        fontWeight="600">
                                        {formatPrice(order.deliveryCharge || 0)}
                                    </Text>
                                </Flex>
                                <Flex
                                    justifyContent="space-between">
                                    <Text
                                        color="primary.200">
                                        Discount
                                    </Text>
                                    <Text
                                        fontWeight="600">-
                                        {formatPrice(order.discount || 0)}
                                    </Text>
                                </Flex>
                                <Separator
                                    opacity={0.3}
                                    my={2} />
                                <Flex
                                    justifyContent="space-between"
                                    color="primary.400">
                                    <Text
                                        fontWeight="700"
                                        fontSize="xl">
                                        Total
                                    </Text>
                                    <Text
                                        fontWeight="800"
                                        fontSize="xl">
                                        {formatPrice(order.total)}
                                    </Text>
                                </Flex>
                            </VStack>
                            <Box
                                mt={6}
                                p={4}
                                bg="primary.50/50"
                                borderRadius="md"
                                borderWidth={1}
                                borderColor="primary.50">
                                <Text
                                    fontSize="xs"
                                    color="primary.200"
                                    fontWeight="700"
                                    textTransform="uppercase"
                                    mb={2}>
                                    Payment Method
                                </Text>
                                <Text
                                    fontWeight="600"
                                    color="primary.400">
                                    {order.paymentProvider}
                                </Text>
                            </Box>
                        </Box>

                        <Box
                            bg="white"
                            p={6}
                            borderRadius="xl"
                            shadow="sm"
                            borderWidth={1}
                            borderColor="primary.100/10">
                            <Text
                                fontWeight="700"
                                fontSize="lg"
                                mb={4}>
                                Shipping Details
                            </Text>
                            <VStack
                                align="start"
                                gap={4}>
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="primary.200"
                                        fontWeight="700"
                                        textTransform="uppercase">
                                        Receiver Name
                                    </Text>
                                    <Text
                                        fontWeight="600">
                                        {order.fullName}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="primary.200"
                                        fontWeight="700"
                                        textTransform="uppercase">
                                        Phone Number
                                    </Text>
                                    <Text
                                        fontWeight="600">
                                        {order.phoneNumber}
                                    </Text>
                                </Box>
                                <Box>
                                    <Text
                                        fontSize="xs"
                                        color="primary.200"
                                        fontWeight="700"
                                        textTransform="uppercase">
                                        Delivery Address
                                    </Text>
                                    <Text
                                        fontWeight="600">
                                        {order.address}
                                    </Text>
                                </Box>
                            </VStack>
                        </Box>
                    </VStack>
                </SimpleGrid>
            </CustomContainer>
        </Box>
    );
}
