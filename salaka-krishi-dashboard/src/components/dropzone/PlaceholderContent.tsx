import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DropzopType } from "config";
import { Camera } from "@wandersonalwes/iconsax-react";
import { Box } from "@mui/material";
const UploadCover = "/assets/images/upload/upload.svg";

export type DropzopTypeValue = typeof DropzopType[keyof typeof DropzopType];

interface PlaceholderContentProps {
    type?: DropzopTypeValue | undefined;
}
export default function PlaceholderContent({ type }: PlaceholderContentProps) {
    return (
        <Box sx={{ width: '100%' }}>
            {type !== DropzopType.standard && (
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    sx={{ gap: 2, alignItems: "center", justifyContent: "center", width: 1, textAlign: { xs: "center", md: "left" } }}
                >
                    <CardMedia component="img" image={UploadCover} sx={{ width: 150 }} />
                    <Stack sx={{ gap: 1, p: 3 }}>
                        <Typography variant="h5">Drag & Drop or Select file</Typography>

                        <Typography color="secondary">
                            Drop files here or click&nbsp;
                            <Typography component="span" color="primary" sx={{ textDecoration: "underline" }}>
                                browse
                            </Typography>
                            &nbsp;thorough your machine
                        </Typography>
                    </Stack>
                </Stack>
            )}
            {type === DropzopType.standard && (
                <Stack sx={{ alignItems: "center", justifyContent: "center", height: 1 }}>
                    <Camera style={{ fontSize: "32px" }} />
                </Stack>
            )}
        </Box>
    );
}
