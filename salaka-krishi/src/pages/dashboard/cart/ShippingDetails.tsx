import {
    Box,
    Button,
    createListCollection,
    Field,
    Flex,
    Grid,
    Heading,
    Image,
    Input,
    Portal,
    Select,
    Spinner,
    Switch,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { paymentMethods } from "@src/data/PaymentMethod";
import routes from "@src/router/routes";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "@src/api/order";
import { toaster } from "@src/components/ui/toaster";
import axios from "@src/utils/axios-interceptor";

interface ContactFormProps {
    fullName: string;
    address: string;
    phone: string;
    payment: string;
}

interface ShippingDetailsProps {
    isReadOnly?: boolean;
    initialData?: ContactFormProps;
    appliedCoupon?: any;
    isCartEmpty?: boolean;
}

export default function ShippingDetails({
    isReadOnly = false,
    initialData,
    appliedCoupon,
    isCartEmpty = false
}: ShippingDetailsProps) {
    const router = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        const abandonedOrderId = localStorage.getItem("pendingEsewaOrderId");
        if (abandonedOrderId) {
            axios.patch(`/orders/${abandonedOrderId}/payment-failed`).then(() => {
                console.log("Automatically marked abandoned eSewa session as failed.");
            }).catch((err) => {
                console.error("Auto cancel error:", err);
            }).finally(() => {
                localStorage.removeItem("pendingEsewaOrderId");
            });
        }
    }, []);

    const paymentMethod = createListCollection({
        items: [
            { label: "Khalti", value: "Khalti" },
            { label: "eSewa", value: "eSewa" },
            { label: "Cash on Delivery", value: "CashOnDelivery" },
        ],
    });

    const [payment, setPayment] = useState<string[]>(
        initialData?.payment ? [initialData.payment] : []
    );
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ContactFormProps>({
        defaultValues: initialData
    });

    const orderMutation = useMutation({
        mutationFn: (data: ContactFormProps) =>
            createOrder({
                fullName: data.fullName,
                address: data.address,
                phoneNumber: data.phone,
                paymentMethod: payment[0] || "CashOnDelivery",
                couponCode: appliedCoupon?.code,
            }),
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });

            const rootData = response.data?.data || response.data;
            console.log("Order Creation Response RootData:", rootData);

            if (!rootData) {
                console.error("Invalid response format: rootData is missing");
                return;
            }

            const { order, paymentData, paymentMethod: receivedMethod } = rootData;
            const normalizedMethod = (receivedMethod || order?.paymentMethod || "").toLowerCase();

            console.log(`Detected payment method: ${normalizedMethod}`);

            if (normalizedMethod === 'esewa' && paymentData) {
                console.log("Processing eSewa redirect...");
                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", paymentData.url);

                Object.keys(paymentData).forEach((key) => {
                    if (key !== "url") {
                        const input = document.createElement("input");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", key);
                        input.setAttribute("value", paymentData[key]);
                        form.appendChild(input);
                    }
                });

                document.body.appendChild(form);
                if (order?.id) {
                    localStorage.setItem("pendingEsewaOrderId", order.id);
                }
                form.submit();
            } else if (normalizedMethod === 'khalti' && paymentData) {
                console.log("Processing Khalti redirect...");
                const khaltiUrl = paymentData.payment_url || paymentData.url;
                if (khaltiUrl) {
                    window.location.href = khaltiUrl;
                } else {
                    console.error("Khalti URL missing in paymentData");
                }
            } else if (normalizedMethod === 'cashondelivery') {
                console.log("Finalizing as Cash on Delivery.");
                toaster.create({
                    title: "Order Placed!",
                    description: "Your order has been placed successfully.",
                    duration: 3000,
                });
                router(routes.cart.orderSuccess);
            } else {
                console.warn("Unrecognized payment method or missing data. Falling back to order history.", { normalizedMethod, hasPaymentData: !!paymentData });
                router(routes.orderHistory);
            }
        },
        onError: (error: any) => {
            toaster.create({
                title: "Order Failed",
                description: error?.response?.data?.message || "Failed to place order. Please try again.",
                type: "error",
                duration: 4000,
            });
        },
    });

    const onSubmit = (data: ContactFormProps) => {
        if (isReadOnly) {
            console.log("Placing order with data:", { ...data, payment: payment[0] });
            orderMutation.mutate(data);
        } else {
            console.log("Navigating to verification with data:", { ...data, payment: payment[0] });
            router(routes.cart.orderVerification, {
                state: {
                    shippingDetails: { ...data, payment: payment[0] || "CashOnDelivery" },
                    appliedCoupon
                }
            });
        }
    };
    return (
        <>
            <Flex
                px={{
                    base: "10",
                    lg: "10",
                    xl: "4",
                    "2xl": "20",
                }}
                py={{
                    base: "20",
                    xl: "4"
                }}

                flexDirection="column"
                gap={4}>
                <Heading
                    color={"primary.300"}
                    mb={3}
                    fontWeight={"700"}
                    fontSize={"2xl"}
                    fontFamily={"primary"}
                    as="h5">Shipping Information</Heading>


                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        gap={{ base: 2, sm: 2, md: 2, lg: 4 }}
                        mb={6}
                        templateColumns={{
                            base: "1fr",

                        }}>
                        <Field.Root invalid={!!errors.fullName}>
                            <Field.Label htmlFor="name"  >
                                Full Name <Text as="span" color="muted.500">*</Text>
                            </Field.Label>
                            <Input

                                variant="subtle"
                                placeholder="Enter your full name"
                                readOnly={isReadOnly}
                                focusRing="none"
                                _focus={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                _hover={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                {...register("fullName", {
                                    required: "Full name is required",
                                })}
                            />

                            <Field.ErrorText>
                                {errors.fullName?.message}
                            </Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!errors.address}>
                            <Field.Label >
                                Address <Text as="span" color="muted.500">*</Text>
                            </Field.Label>

                            <Input
                                variant="subtle"

                                placeholder="Enter your address"
                                readOnly={isReadOnly}
                                focusRing="none"
                                _focus={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                _hover={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                {...register("address", {
                                    required: "Address is required",
                                })}
                            />

                            <Field.ErrorText>
                                {errors.address?.message}
                            </Field.ErrorText>
                        </Field.Root>


                        <Field.Root invalid={!!errors.phone}>
                            <Field.Label >
                                Mobile No<Text as="span" color="muted.500">*</Text>
                            </Field.Label>

                            <Input
                                variant="subtle"
                                type="tel"
                                autoComplete="tel"

                                placeholder="Enter your phone"
                                readOnly={isReadOnly}
                                focusRing="none"
                                _focus={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                _hover={{ borderColor: isReadOnly ? "border.100/30" : "background.300/70" }}
                                {...register("phone", {
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^9[0-9]{9}$/,
                                        message: "Invalid phone number",
                                    },
                                })}
                            />
                            <Field.ErrorText>
                                {errors.phone?.message}
                            </Field.ErrorText>
                        </Field.Root>

                        <Select.Root
                            collection={paymentMethod}
                            value={payment}
                            disabled={isReadOnly}
                            onValueChange={(e) => setPayment(e.value)}>
                            <Select.HiddenSelect />
                            <Select.Label
                                color={"primary.300"}
                                fontWeight={400}>
                                Payment<Text as="span" color="muted.500"> *</Text>
                            </Select.Label>
                            <Select.Control
                                borderColor={"border.100/30"}
                                borderWidth={"1"}
                                borderRadius={"md"}
                                _focus={{
                                    borderWidth: isReadOnly ? "1px" : "2px",
                                    outline: "none",
                                    ring: "none",
                                    borderColor: isReadOnly ? "border.100/30" : "background.300/70",
                                }}
                                _hover={{
                                    borderColor: isReadOnly ? "border.100/30" : "primary.300",
                                }}
                            >
                                <Select.Trigger>
                                    <Select.ValueText
                                        placeholder="Payment"
                                        color={"text.200"}
                                        fontWeight={500}
                                    />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content
                                        p={0}
                                        m={0}

                                        borderWidth={1}
                                        borderColor={"primary.100"}  >
                                        {paymentMethod.items.map((payment) => (
                                            <Select.Item item={payment}
                                                color={"primary.300"}
                                                border="2px solid transparent"
                                                _hover={{
                                                    borderStyle: "solid",
                                                    bg: "primary.300/20",
                                                    borderWidth: "1",
                                                    borderColor: "primary.100",
                                                }}

                                                px={4}
                                                py={4}

                                                key={payment.value}>
                                                <Flex
                                                    color={"primary.300"}
                                                    width={"full"}
                                                    justifyContent={"enter"}>
                                                    {payment.label}
                                                </Flex>

                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>


                    </Grid>
                    {isReadOnly && (
                        <Switch.Root display="flex" justifyContent="space-between" mb={4}>
                            <Switch.HiddenInput />
                            <Switch.Label fontSize={"xl"} color={"primary.300"} fontWeight={400}>
                                Save data for future payment
                            </Switch.Label>
                            <Switch.Control _checked={{ bg: "primary.300" }} />
                        </Switch.Root>
                    )}
                    <Flex justifyContent={{ base: "center", sm: "flex-end" }} width="full" mt={4}>
                        <Tooltip.Root disabled={!isCartEmpty} positioning={{ placement: "top" }}>
                            <Tooltip.Trigger asChild>
                                <Button
                                    type="submit"
                                    fontSize={"lg"}
                                    fontWeight={400}
                                    px={12}
                                    py={5}
                                    disabled={orderMutation.isPending || isCartEmpty}
                                    _hover={{
                                        bg: isCartEmpty ? "gray.400" : "primary.300"
                                    }}
                                    opacity={isCartEmpty ? 0.6 : 1}
                                    cursor={isCartEmpty ? "not-allowed" : "pointer"}
                                    width={{ base: "full", sm: "auto" }}
                                >
                                    {orderMutation.isPending ? <Spinner size="sm" /> : (isReadOnly ? "Pay to Order" : "Continue")}
                                </Button>
                            </Tooltip.Trigger>
                            <Portal>
                                <Tooltip.Positioner>
                                    <Tooltip.Content bg="primary.300" color="white" px={4} py={2} borderRadius="md" fontSize="sm">
                                        Your cart is empty
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Portal>
                        </Tooltip.Root>
                    </Flex>
                </form>
                {!isReadOnly && (
                    <>
                        <Text
                            color={"primary.300"}
                            fontSize={"lg"}
                            fontWeight={400}>
                            Quick Payments
                        </Text>
                        <Flex
                            gap={2}>
                            {
                                paymentMethods.map((method) =>
                                    <Flex key={method.id}
                                        alignItems={"center"}
                                        w={"82px"}
                                        h={"42px"}
                                        justifyContent={"center"}>
                                        <Image
                                            src={method.icon}
                                            objectFit={"contain"}
                                            objectPosition={"center"}
                                            h={"full"}
                                            w={"full"} />
                                    </Flex>
                                )
                            }
                        </Flex>
                    </>
                )}
            </Flex>
        </>
    );
}
