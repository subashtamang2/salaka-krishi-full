export const textStyles = {

    bannerTitle: {
        value: {
            fontWeight: "800",
            color: "secondary.100",
            fontFamily: "primary",
            textAlign: "center",
            lineHeight: "1.2",
            fontSize: {
                base: "4xl",
                md: "4xl",
                lg: "5xl",
                xl: "5xl",
            },
        },
    },
    bannerSubTitle: {
        value: {
            fontWeight: "600",
            textTransform: "uppercase",
            color: "primary.100",
            fontFamily: "primary",
            textAlign: "center",
            fontSize: {
                base: "2xl",
            },
        },
    },
    videoBannerTitle: {
        value: {
            fontWeight: "700",
            color: "primary.100",
            fontFamily: "primary",
            textAlign: {
                base: "center",
                md: "center"
            },
            lineHeight: "1",
            fontSize: {
                base: "4xl",
                md: "5xl",
            },
        },
    },
    secondaryBannerTitle: {
        value: {
            fontWeight: "600",
            color: "secondary.200",
            fontFamily: "primary",
            textAlign: {
                base: "center",
                md: "center"
            },
            fontSize: {
                base: "2xl",
                md: "3xl",
            },
        },
    },
    blogDetailsBannerTitle: {
        value: {
            fontWeight: "700",
            color: "secondary.200",
            fontFamily: "primary",

            fontSize: {
                base: "3xl",
                md: "3xl",
            },
        },
    },
    sectionTitle: {
        value: {
            color: "primary.300",
            textAlign: "center",

            fontWeight: "700",
            fontFamily: "primary",
            lineHeight: "3",
            fontSize: {
                base: "3xl",
                md: "4xl",
                lg: "4xl",
            },
            "& span": {
                color: "primary.100",
            },
        },
    },

    desc: {
        value: {
            fontWeight: "300",
            fontFamily: "primary",
            color: "secondary.100",
            lineHeight: "28px",
            fontSize: {
                base: "sm",
                md: "lg"
            },
        },
    },
    contactDesc: {
        value: {
            fontWeight: "300",
            fontFamily: "primary",
            color: "muted.600",
            lineHeight: "28px",
            fontSize: {
                base: "md",
                md: "md"
            },
        },
    },
    title1: {
        value: {
            fontSize: {
                base: "2xl",
                md: "4xl",
                xl: "4xl",
            },
            lineHeight: "1.2",
            color: "primary.300",
            fontFamily: "primary",
            fontWeight: 700,
        },
    },

    cardDesc: {
        value: {
            fontWeight: "300",
            fontFamily: "primary",
            color: "secondary.200",
            lineHeight: "30px",
            fontSize: { base: "base", md: "lg" },

        },
    },

    title: {
        value: {
            fontSize: {
                base: "4xl",
                md: "4xl",
                xl: "5xl",
            },
            lineHeight: "1.2",
            textTransform: "uppercase",
            color: "secondary.200",
            fontFamily: "primary",
            fontWeight: 700,
        },
    },
    titleMd: {
        value: {
            fontSize: {
                base: "xl",
                md: "xl",
            },
            textTransform: "uppercase",
            color: "secondary.200",
            fontFamily: "primary",
            fontWeight: 600,
        },

    },
    textSm: {
        value: {
            fontSize: "md",
            fontFamily: "poppins",
            fontWeight: "400",

            "& h2": {
                color: "primary.300",
                fontSize: "2xl",
                fontWeight: "500",
                marginBottom: 2,
            },
            "& p": {
                color: "text.500",
                fontSize: "md",
                fontWeight: "400",
                mb: 2,
            },
            "& > div": {
                mb: 9,
            },
        },
    },


    textBordered: {
        value: {
            fontFamily: "primary",
            fontSize: "md",
            fontWeight: "400",
            "& h2": {
                color: "primary.300",
                fontSize: "2xl",
                fontWeight: "500",
                marginBottom: 4,
                "&:not(:first-of-type)": {
                    borderTopWidth: 2,
                    borderTopStyle: "solid",
                    borderTopColor: "border.200/50",
                    pt: 8,
                    mt: 12,
                }
            },
            "& p": {
                color: "text.500",
                fontSize: {
                    base: "md",
                },
                fontWeight: "400",
                textAlign: "start",
                mb: 4,
            },
        },
    },

}
