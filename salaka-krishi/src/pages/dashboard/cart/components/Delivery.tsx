import { useState } from "react";
import {
    Flex,
    Heading,
} from "@chakra-ui/react";
import ShippingCard from "./ShippingCard";


export default function Delivery() {
    const [selectedValue, setSelectedValue] = useState("1");

    const shippingOptions = [
        {
            label: {
                title: "Standard Delivery (Free)",
                description: "Delivered within 3-5 business days"
            },
            value: "1"
        },
        {
            label: {
                title: "Express Delivery ($5)",
                description: "Delivered within 3-5 business days"
            },
            value: "2"
        },
        {
            label: {
                title: "Overnight Delivery ($15)",
                description: "Delivered within 3-5 business days"
            },
            value: "3"
        },
    ];

    const handleSelect = (val: string) => {
        setSelectedValue(val);
        console.log("Selected:", val);
    };

    console.log("Selected Shipping Option:", selectedValue);

    return (
        <Flex
            gap={6}
            flexDir="column">
            <Heading fontSize="lg" fontWeight="600" as="h5">
                Shipping Type
            </Heading>
            <Flex
                flexDir={"column"}
                justifyContent={"start"}
                gap={3}
            >
                {shippingOptions.map(option => (
                    <ShippingCard
                        key={option.value}
                        label={option.label}
                        isChecked={selectedValue === option.value}
                        onSelect={() => handleSelect(option.value)}
                    />
                ))}
            </Flex>
        </Flex>
    );
}
