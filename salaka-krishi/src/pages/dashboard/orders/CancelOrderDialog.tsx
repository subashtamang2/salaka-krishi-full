import React, { useState } from "react";
import {
    Button,
    VStack,
    Text,
    Box,
    Flex,
    Heading,
} from "@chakra-ui/react";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@src/components/ui/dialog";
import { toaster } from "@src/components/ui/toaster";
import { cancelOrder } from "@src/api/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CancelOrderDialogProps {
    orderId: string;
    orderNumber: string;
    trigger?: React.ReactNode;
}

const REASONS = [
    "Changed my mind",
    "Ordered wrong item",
    "Found better price",
    "Delivery too slow",
];

export default function CancelOrderDialog({ orderId, orderNumber, trigger }: CancelOrderDialogProps) {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (reason: string) => cancelOrder(orderId, reason),
        onSuccess: () => {
            toaster.create({
                title: "Order Cancelled",
                description: `Order ${orderNumber} has been successfully cancelled.`,
                type: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["my-orders"] });
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            setOpen(false);
        },
        onError: (error: any) => {
            toaster.create({
                title: "Cancellation Failed",
                description: error?.response?.data?.message || "Something went wrong.",
                type: "error",
            });
        },
    });

    const handleCancel = (reason: string) => {
        mutation.mutate(reason);
    };

    return (
        <DialogRoot 
            open={open} 
            onOpenChange={(e) => setOpen(e.open)}
            placement="center"
            motionPreset="slide-in-bottom"
        >
            <DialogTrigger asChild>
                {trigger || (
                    <Button 
                        size="sm" 
                        variant="outline" 
                        colorPalette="red"
                        _hover={{ bg: "red.500", color: "white" }}
                    >
                        Cancel Order
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent borderRadius="xl" shadow="2xl">
                <DialogHeader borderBottomWidth={1} pb={4}>
                    <DialogTitle fontSize="xl" fontWeight="700" color="red.500">
                        Cancel Order {orderNumber}
                    </DialogTitle>
                </DialogHeader>
                <DialogBody py={6}>
                    <VStack align="stretch" gap={6}>
                        <Box>
                            <Heading size="xs" mb={3} color="primary.400">
                                Why are you cancelling? (Optional)
                            </Heading>
                            <Flex wrap="wrap" gap={2}>
                                {REASONS.map((reason) => (
                                    <Button
                                        key={reason}
                                        size="xs"
                                        variant={selectedReason === reason ? "solid" : "outline"}
                                        colorPalette={selectedReason === reason ? "primary" : "gray"}
                                        borderRadius="full"
                                        onClick={() => setSelectedReason(reason)}
                                        _hover={{ bg: "primary.50", color: "primary.500" }}
                                    >
                                        {reason}
                                    </Button>
                                ))}
                            </Flex>
                        </Box>
                        
                        <Text fontSize="sm" color="gray.500" bg="gray.50" p={3} borderRadius="md" borderLeft="4px solid" borderLeftColor="red.300">
                            <strong>Note:</strong> Once cancelled, this action cannot be undone. If you've already paid, our team will process your refund manually.
                        </Text>
                    </VStack>
                </DialogBody>
                <DialogFooter bg="gray.50" borderBottomRadius="xl" gap={3}>
                    <Button 
                        variant="ghost" 
                        onClick={() => setOpen(false)}
                        disabled={mutation.isPending}
                    >
                        Keep Order
                    </Button>
                    <Button
                        colorPalette="red"
                        loading={mutation.isPending}
                        onClick={() => handleCancel(selectedReason)}
                    >
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}
