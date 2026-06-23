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
    VStack,
} from "@chakra-ui/react";
import routes from "@src/router/routes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder, uploadScreenshot, submitPaymentProof } from "@src/api/order";
import { toaster } from "@src/components/ui/toaster";
import qrImage from "@src/assets/images/qr-image/qr.png";

interface ContactFormProps {
    fullName: string;
    address: string;
    phone: string;
    payment: string;
    screenshotUrl?: string;
    screenshotName?: string;
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


    const paymentMethod = createListCollection({
        items: [
            { label: "Cash on Delivery", value: "CashOnDelivery" },
            { label: "Online Payment", value: "OnlinePayment" },
        ],
    });

    const [payment, setPayment] = useState<string[]>(
        initialData?.payment ? [initialData.payment] : []
    );
    const [screenshotUrl, setScreenshotUrl] = useState<string>(
        initialData?.screenshotUrl || ""
    );
    const [screenshotName, setScreenshotName] = useState<string>(
        initialData?.screenshotName || ""
    );
    const [isUploading, setIsUploading] = useState(false);
    const [paymentError, setPaymentError] = useState<string>("");
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ContactFormProps>({
        defaultValues: initialData
    });

    const isOnlinePayment = payment[0] === "OnlinePayment";

    const orderMutation = useMutation({
        mutationFn: (data: ContactFormProps) =>
            createOrder({
                fullName: data.fullName,
                address: data.address,
                phoneNumber: data.phone,
                paymentProvider: payment[0],
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

            const { order, paymentData, paymentProvider: receivedMethod } = rootData;
            const normalizedMethod = (receivedMethod || order?.paymentProvider || "").toLowerCase();

            console.log(`Detected payment method: ${normalizedMethod}`);

            if (normalizedMethod === 'esewa' && paymentData) {
                const form = document.createElement("form");
                form.setAttribute("method", "POST");
                form.setAttribute("action", paymentData.url);
                // Ensure the form opens in the top-level window and sends the referer correctly
                form.setAttribute("target", "_top");
                form.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

                Object.entries(paymentData).forEach(([key, value]) => {
                    if (key !== "url") {
                        const input = document.createElement("input");
                        input.setAttribute("type", "hidden");
                        input.setAttribute("name", key);
                        input.setAttribute("value", value as string);
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
                router(routes.cart.orderSuccess);
            } else if (normalizedMethod === 'onlinepayment') {
                console.log("Processing Online Payment proof submission...");
                if (screenshotUrl) {
                    submitPaymentProof(order?.id || rootData?.orderId || rootData?.id, screenshotUrl, screenshotName)
                        .then(() => {
                            toaster.create({
                                title: "Payment Proof Submitted",
                                description: "Your payment proof has been submitted for verification.",
                                type: "success",
                            });
                        })
                        .catch((err) => {
                            console.error("Failed to submit payment proof:", err);
                            toaster.create({
                                title: "Submission Failed",
                                description: "Failed to submit payment proof. You can upload it from your order history.",
                                type: "error",
                            });
                        })
                        .finally(() => {
                            router(routes.cart.orderSuccess);
                        });
                } else {
                    router(routes.cart.orderSuccess);
                }
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
        if (!payment[0]) {
            setPaymentError("Please select a payment method ");
            return;
        }
        if (payment[0] === "OnlinePayment" && !screenshotUrl) {
            setPaymentError("Please upload a payment screenshot.");
            return;
        }
        // Always place order directly — no verification step
        orderMutation.mutate(data);
    };

    const onInvalid = () => {
        if (!payment[0]) {
            setPaymentError("Please select a payment method before continuing.");
        } else if (payment[0] === "OnlinePayment" && !screenshotUrl) {
            setPaymentError("Please upload a payment screenshot.");
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


                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
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
                                readOnly={isReadOnly}
                                placeholder="Enter your full name"
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

                        <Field.Root invalid={paymentError === "Please select a payment method before continuing."}>
                            <Select.Root
                                collection={paymentMethod}
                                value={payment}
                                disabled={isReadOnly}
                                onValueChange={(e) => {
                                    setPayment(e.value);
                                    setPaymentError("");
                                    // Reset screenshot when switching away from OnlinePayment
                                    if (e.value[0] !== "OnlinePayment") {
                                        setScreenshotUrl("");
                                        setScreenshotName("");
                                    }
                                }}>
                                <Select.HiddenSelect />
                                <Select.Label
                                    color={"primary.300"}
                                    fontWeight={400}>
                                    Payment<Text as="span" color="muted.500"> *</Text>
                                </Select.Label>
                                <Select.Control
                                    borderWidth={"1"}
                                    borderRadius={"md"}
                                    _focus={{
                                        borderWidth: "2px",
                                        outlineColor: "background.300/70",
                                        borderColor: "background.300/70",
                                    }}>


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
                                            {paymentMethod.items.map((item) => (
                                                <Select.Item item={item}
                                                    color={"primary.300"}
                                                    cursor={"pointer"}
                                                    border="2px solid transparent"
                                                    _hover={{
                                                        borderStyle: "solid",
                                                        bg: "primary.300/20",
                                                        borderWidth: "1",
                                                        borderColor: "primary.100",
                                                    }}

                                                    px={4}
                                                    py={4}

                                                    key={item.value}>
                                                    <Flex
                                                        color={"primary.300"}
                                                        width={"full"}
                                                        justifyContent={"enter"}>
                                                        {item.label}
                                                    </Flex>

                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                            <Field.ErrorText>
                                {paymentError === "Please select a payment method before continuing." && paymentError}
                            </Field.ErrorText>
                        </Field.Root>

                        {/* QR Code display */}
                        {isOnlinePayment && (
                            <Box
                                mt={2}
                                p={4}
                                borderWidth={1}
                                borderStyle="dashed"
                                borderColor="primary.300"
                                borderRadius="lg"
                                bg="primary.300/5"
                            >
                                <VStack align="stretch" gap={3}>
                                    <Text
                                        color="primary.300"
                                        fontWeight={600}
                                        fontSize="sm"
                                        textAlign="center"
                                    >
                                        Scan the QR code to make payment
                                    </Text>
                                    <Flex justifyContent="center">
                                        <Box
                                            border="2px solid"
                                            borderColor="primary.100"
                                            p={2}
                                            borderRadius="lg"
                                            bg="white"
                                            display="inline-block"
                                        >
                                            <Image
                                                src={qrImage}
                                                alt="Payment QR Code"
                                                boxSize="180px"
                                                objectFit="contain"
                                            />
                                        </Box>
                                    </Flex>
                                </VStack>
                            </Box>
                        )}

                        {/* Separate Screenshot upload field */}
                        {isOnlinePayment && (
                            <Field.Root invalid={paymentError === "Please upload a payment screenshot."}>
                                <Field.Label>
                                    Upload Payment Screenshot <Text as="span" color="muted.500">*</Text>
                                </Field.Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    variant="subtle"
                                    p={1.5}
                                    disabled={isReadOnly}
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setIsUploading(true);
                                            try {
                                                const res = await uploadScreenshot(file);
                                                const uploadedData = res.data?.data || res.data;
                                                const filename = uploadedData?.filename || uploadedData?.name;
                                                setScreenshotUrl(`/uploads/${filename}`);
                                                setScreenshotName(file.name);
                                                setPaymentError("");
                                                toaster.create({
                                                    title: "Upload Success",
                                                    description: "Screenshot uploaded successfully.",
                                                    type: "success",
                                                });
                                            } catch (err) {
                                                console.error("Screenshot upload failed:", err);
                                                toaster.create({
                                                    title: "Upload Failed",
                                                    description: "Failed to upload screenshot. Please try again.",
                                                    type: "error",
                                                });
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        }
                                    }}
                                />
                                {isUploading && (
                                    <Flex align="center" gap={2} mt={1}>
                                        <Spinner size="sm" />
                                        <Text fontSize="xs" color="primary.300">Uploading...</Text>
                                    </Flex>
                                )}
                                {screenshotUrl && (
                                    <Text color="green.600" fontSize="xs" mt={1} fontWeight="semibold">
                                        Uploaded: {screenshotName || "screenshot.png"}
                                    </Text>
                                )}
                                <Field.ErrorText>
                                    {paymentError === "Please upload a payment screenshot." && paymentError}
                                </Field.ErrorText>
                            </Field.Root>
                        )}

                    </Grid>
                    {isReadOnly && (
                        <Switch.Root
                            display="flex"
                            justifyContent="space-between"
                            mb={4}>
                            <Switch.HiddenInput />
                            <Switch.Label
                                fontSize={"xl"}
                                color={"primary.300"}
                                fontWeight={400}>
                                Save data for future payment
                            </Switch.Label>
                            <Switch.Control _checked={{ bg: "primary.300" }} />
                        </Switch.Root>
                    )}
                    <Flex
                        justifyContent={{
                            base: "center",
                            sm: "flex-end"
                        }}
                        width="full"
                        mt={4}>
                        <Tooltip.Root
                            disabled={!isCartEmpty}
                            positioning={{ placement: "top" }}>
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
                                    {orderMutation.isPending ? <Spinner size="sm" /> : "Place Order"}
                                </Button>
                            </Tooltip.Trigger>
                            <Portal>
                                <Tooltip.Positioner>
                                    <Tooltip.Content
                                        bg="primary.300"
                                        color="white"
                                        px={4}
                                        py={2}
                                        borderRadius="md"
                                        fontSize="sm">
                                        Your cart is empty
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Portal>
                        </Tooltip.Root>
                    </Flex>
                </form>

            </Flex>
        </>
    );
}
