import { Breadcrumb, Flex, } from "@chakra-ui/react";
import routes from "@src/router/routes";
import { MdArrowRight } from "react-icons/md";
import { useLocation } from "react-router";
import React from "react";
export default function BreadCrumb() {
    const location = useLocation();
    const urlParts = location.pathname.split('/').filter(part => part)
    return (
        <>
            <Flex>
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link
                                whiteSpace="nowrap"
                                _focus={{ outline: "none" }}
                                href={routes.home}
                                color={"primary.100"}
                                fontSize={{
                                    base: "lg",
                                    md: "xl"
                                }}
                                fontWeight={300}>Home
                            </Breadcrumb.Link >
                        </Breadcrumb.Item>
                        {urlParts.length > 0 && (
                            <Breadcrumb.Separator
                                color={"primary.100"}
                                fontSize={{
                                    base: "24px",
                                    md: "28px",
                                    lg: "30px"
                                }}>
                                <MdArrowRight />
                            </Breadcrumb.Separator>
                        )}
                        {
                            urlParts.map((part, index) => {
                                const isLast = index === urlParts.length - 1;
                                const label = part
                                    .replace(/-/g, " ")
                                    .replace(/\b\w/g, (char) => char.toUpperCase());

                                return (
                                    <React.Fragment key={index}>
                                        <Breadcrumb.Item
                                            color={"primary.100"}
                                            fontSize={{
                                                base: "md",
                                                md: "xl"
                                            }}
                                            fontWeight={400}>
                                            {isLast ? (
                                                <Breadcrumb.CurrentLink

                                                    whiteSpace="nowrap"
                                                    color={"primary.100"}
                                                    fontSize={{
                                                        base: "md",
                                                        md: "xl"
                                                    }}
                                                    fontWeight={300}>
                                                    {label}
                                                </Breadcrumb.CurrentLink>
                                            ) : (
                                                <Breadcrumb.Link
                                                        _focus={{ outline: "none" }}
                                                    whiteSpace="nowrap"
                                                    href={`/${part}`}
                                                    color={"primary.100"}
                                                    fontSize={{
                                                        base: "md",
                                                        md: "xl"
                                                    }}
                                                    fontWeight={400}
                                                >
                                                    {label}
                                                </Breadcrumb.Link>
                                            )}
                                        </Breadcrumb.Item>
                                        {!isLast && (
                                            <Breadcrumb.Separator
                                                color={"primary.100"}
                                                fontSize={{
                                                    base: "24px",
                                                    md: "28px",
                                                    lg: "30px"
                                                }} >
                                                <MdArrowRight size={32} />
                                            </Breadcrumb.Separator>
                                        )}
                                    </React.Fragment>
                                );

                            })}

                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Flex>
        </>
    );
}
