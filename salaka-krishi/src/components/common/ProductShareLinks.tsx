import { Flex } from "@chakra-ui/react";
import SocialMediaItem from "./SocialMediaItem";
import { FaFacebookF, FaPinterest, FaTwitter } from "react-icons/fa";

interface Props {
  productName: string;
  productImage?: string;
}

export default function ProductShareLinks({ productName, productImage }: Props) {
    const shareUrl = typeof window !== "undefined"
        ? window.location.href
        : "";

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`Check out ${productName} on Salaka Krishi!`);
  const encodedImage = encodeURIComponent(productImage || "");

  const sharePlatforms = [
    {
      id: 1,
      name: "Facebook",
      icon: FaFacebookF,
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 2,
      name: "Twitter",
      icon: FaTwitter,
      link: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      id: 3,
      name: "Pinterest",
      icon: FaPinterest,
      link: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedText}`,
    },
  ];

  return (
    <Flex
      gap={4}
      justifyContent={"start"}
      alignItems={"center"}
      flexWrap={"wrap"}
    >
      {sharePlatforms.map((item) => (
        <SocialMediaItem key={item.id} socialmedia={item} />
      ))}
    </Flex>
  );
}
