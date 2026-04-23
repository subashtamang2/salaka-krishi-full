"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    IconButton,
} from "@mui/material";
import { CloseCircle, Danger, Trash } from "@wandersonalwes/iconsax-react";

// ─── Types ───
interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ───
const ConfirmContext = createContext<ConfirmContextType | null>(null);

// ─── Hook ───
export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return ctx.confirm;
}

// ─── Variant Config ───
const variantConfig = {
    danger: {
        color: "error" as const,
        icon: <Trash size={28} />,
        bgColor: "error.lighter",
        iconColor: "error.main",
    },
    warning: {
        color: "warning" as const,
        icon: <Danger size={28} />,
        bgColor: "warning.lighter",
        iconColor: "warning.main",
    },
    info: {
        color: "primary" as const,
        icon: <Danger size={28} />,
        bgColor: "primary.lighter",
        iconColor: "primary.main",
    },
};

// ─── Provider ───
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({
        title: "Confirm",
        message: "",
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: "danger",
    });

    const resolveRef = useRef<((value: boolean) => void) | null>(null);

    const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
        setOptions({
            title: opts.title || "Confirm Action",
            message: opts.message,
            confirmText: opts.confirmText || "Confirm",
            cancelText: opts.cancelText || "Cancel",
            variant: opts.variant || "danger",
        });
        setOpen(true);

        return new Promise<boolean>((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    const handleClose = (result: boolean) => {
        setOpen(false);
        resolveRef.current?.(result);
        resolveRef.current = null;
    };

    const config = variantConfig[options.variant || "danger"];

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                    },
                }}
            >
                {/* Close Button */}
                <IconButton
                    onClick={() => handleClose(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: "text.secondary",
                    }}
                >
                    <CloseCircle size={20} />
                </IconButton>

                <DialogContent sx={{ pt: 4, pb: 2 }}>
                    <Stack alignItems="center" spacing={2}>
                        {/* Icon */}
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: config.bgColor,
                                color: config.iconColor,
                            }}
                        >
                            {config.icon}
                        </Box>

                        {/* Title */}
                        <Typography variant="h5" fontWeight={700} textAlign="center">
                            {options.title}
                        </Typography>

                        {/* Message */}
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            textAlign="center"
                            sx={{ px: 2 }}
                        >
                            {options.message}
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleClose(false)}
                        sx={{ minWidth: 100, borderRadius: 2 }}
                    >
                        {options.cancelText}
                    </Button>
                    <Button
                        variant="contained"
                        color={config.color}
                        onClick={() => handleClose(true)}
                        sx={{ minWidth: 100, borderRadius: 2 }}
                    >
                        {options.confirmText}
                    </Button>
                </DialogActions>
            </Dialog>
        </ConfirmContext.Provider>
    );
}
