import { Flex } from "@chakra-ui/react";
import HeaderTop from "./HeaderTop";
import Navbar from "./Navbar";
import MainHeader from "./MainHeader";
import { HeaderStateProvider } from "@src/contexts/HeaderStateProvider";
import { useRef, useState } from "react";
export default function Header() {
    const [IsOpen, setIsOpen] = useState(false);
    const [IsSubNavOpen, setIsSubNavOpen] = useState(false);
    const navRef = useRef(null);
    const handleOpenMenu = () => {
        setIsOpen(true);
    }
    const handleToggleSubMenu = () => {
        setIsSubNavOpen(!IsSubNavOpen);
    }
    const handleCloseMenu = () => {
        setIsOpen(false);
    }

    return (
        <>
            <HeaderStateProvider
                state={{
                    isOpen: IsOpen,
                    open: handleOpenMenu,
                    close: handleCloseMenu,
                    isSubNavOpen: IsSubNavOpen,
                    toggleSubMenu: handleToggleSubMenu,
                    setSubNavOpen: setIsSubNavOpen,
                    navRef: navRef
                }}>
                <Flex
                    position={"relative"}
                    flexDir={"column"}>
                    <HeaderTop />
                    <MainHeader />
                    <Navbar />
                </Flex>
            </HeaderStateProvider>
        </>
    );
}
