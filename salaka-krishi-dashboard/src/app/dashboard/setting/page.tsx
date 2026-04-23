import { Grid } from "@mui/system";
import SiteInfo from "components/SiteInfo";
import Socialmedia from "components/Socialmedia";

export default function page() {
    return (
        <>
            <Grid container spacing={2}>
                <Grid size={6}>
                    <SiteInfo />
                </Grid>
                <Grid size={6}>
                    <Socialmedia />
                </Grid>
            </Grid>
        </>
    )
}
