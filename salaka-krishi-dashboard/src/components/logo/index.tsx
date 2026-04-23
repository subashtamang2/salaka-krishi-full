// next
import Link from 'next/link';

import ButtonBase from '@mui/material/ButtonBase';
import { SxProps } from '@mui/system';
import { To } from 'history';
import { APP_DEFAULT_PATH } from 'config';
import Image from 'next/image';
// ==============================|| MAIN LOGO ||============================== //

interface Props {
    reverse?: boolean;
    isIcon?: boolean;
    sx?: SxProps;
    to?: To;
}

export default function LogoSection({ reverse, isIcon, sx, to = APP_DEFAULT_PATH }: Props) {
    const src = isIcon ? '/assets/images/logo/icon.svg' : '/assets/images/logo/logo.svg';
    return (
        <ButtonBase
            disableRipple component={Link} href={to} sx={sx}>
            <Image
                key={src}
                src={src}
                alt="Salaka Krishi Logo"
                width={isIcon ? 50 : 220}
                height={isIcon ? 50 : 70}
                style={{ objectFit: "cover" }}
            />
        </ButtonBase>
    );
}
