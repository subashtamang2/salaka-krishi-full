import type { SocialMediaList } from "@src/schema/schema";
import {
    FACEBOOK_LINK,
    PINTEREST_LINK,
    TWITTER_LINK,
    YOUTUBE_LINK
} from "@src/utils/constants";
import {
    FaFacebookF,
    FaPinterest,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";

export const SocialMedia: SocialMediaList[] = [
    {
        id: 1,
        name: "Facebook",
        icon: FaFacebookF,
        link: FACEBOOK_LINK,
    },
    {
        id: 2,
        name: "Twitter",
        icon: FaTwitter,
        link: TWITTER_LINK,
    },
    {
        id: 3,
        name: "Pinterest",
        icon: FaPinterest,
        link: PINTEREST_LINK,
    },

    {
        id: 4,
        name: "Youtube",
        icon: FaYoutube,
        link: YOUTUBE_LINK,
    },
];
