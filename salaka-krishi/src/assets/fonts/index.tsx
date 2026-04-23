import { css, Global } from "@emotion/react";
import MontserratExtraLightTtf from "./montSerrat/Montserrat-ExtraLight.ttf";
import MontserratLightTtf from "./montSerrat/Montserrat-Light.ttf";
import MontserratRegularTtf from "./montSerrat/Montserrat-Regular.ttf";
import MontserratMediumTtf from "./montSerrat/Montserrat-Medium.ttf";
import MontserratSemiBoldTtf from "./montSerrat/Montserrat-SemiBold.ttf";
import MontserratBoldTtf from "./montSerrat/Montserrat-Bold.ttf";
import MontserratExtraBoldTtf from "./montSerrat/Montserrat-ExtraBold.ttf";
import MontserratBlackTtf from "./montSerrat/Montserrat-Black.ttf";
import PoppinsExtraLightTtf from "./poppins/Poppins-ExtraLight.ttf";
import PoppinsLightTtf from "./poppins/Poppins-Light.ttf";
import PoppinsRegularTtf from "./poppins/Poppins-Regular.ttf";
import PoppinsMediumTtf from "./poppins/Poppins-Medium.ttf";
import PoppinsSemiBoldTtf from "./poppins/Poppins-SemiBold.ttf";
import PoppinsBold from "./poppins/Poppins-Bold.ttf";
import PoppinsExtraBoldTtf from "./poppins/Poppins-ExtraBold.ttf";
import PoppinsBlackTtf from "./poppins/Poppins-Black.ttf";



import RobotoSlabExtraLightTtf from "./robotoSlab/RobotoSlab-ExtraLight.ttf";
import RobotoSlabLightTtf from "./robotoSlab/RobotoSlab-Light.ttf";
import RobotoSlabRegularTtf from "./robotoSlab/RobotoSlab-Regular.ttf";
import RobotoSlabMediumTtf from "./robotoSlab/RobotoSlab-Medium.ttf";
import RobotoSlabSemiBoldTtf from "./robotoSlab/RobotoSlab-SemiBold.ttf";
import RobotoSlabBoldTtf from "./robotoSlab/RobotoSlab-Bold.ttf";
import RobotoSlabExtraBoldTtf from "./robotoSlab/RobotoSlab-ExtraBold.ttf";
import RobotoSlabBlackTtf from "./robotoSlab/RobotoSlab-Black.ttf";


export default function Fonts() {
    return (
        <Global
            styles={css`
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:200;
src:url(${MontserratExtraLightTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:300;
src:url(${MontserratLightTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:400;
src:url(${MontserratRegularTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:500;
src:url(${MontserratMediumTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:600;
src:url(${MontserratSemiBoldTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:700;
src:url(${MontserratBoldTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:800;
src:url(${MontserratExtraBoldTtf}) format('truetype');

}
@font-face{
font-family:'montSerrat';
font-style:normal;
font-weight:900;
src:url(${MontserratBlackTtf}) format('truetype');

}

@font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 200;
        src: url(${RobotoSlabExtraLightTtf}) format('truetype');

    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 300;
        src: url(${RobotoSlabLightTtf}) format('truetype');

    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 400;
        src: url(${RobotoSlabRegularTtf}) format('truetype');

    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 500;
        src: url(${RobotoSlabMediumTtf}) format('truetype');

    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 600;
        src: url(${RobotoSlabSemiBoldTtf}) format('truetype');

    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 700;
        src: url(${RobotoSlabBoldTtf}) format('truetype');
    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 800;
        src: url(${RobotoSlabExtraBoldTtf}) format('truetype');
    }
    @font-face{
        font - family: 'RobotoSlab';
        font - style: normal;
        font - weight: 900;
        src: url(${RobotoSlabBlackTtf}) format('truetype');
    }


  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 200;
        src: url(${PoppinsExtraLightTtf}) format('truetype');
    }

  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 300;
        src: url(${PoppinsLightTtf}) format('truetype');
    }

  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 400;
        src: url(${PoppinsRegularTtf}) format('truetype');
    }
  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 500;
        src: url(${PoppinsMediumTtf}) format('truetype');
    }
  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 600;
        src: url(${PoppinsSemiBoldTtf}) format('truetype');
    }
  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 700;
        src: url(${PoppinsBold}) format('truetype');
    }
 @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 800;
        src: url(${PoppinsExtraBoldTtf}) format('truetype');
    }

  @font-face{
        font - family: 'Poppins';
        font - style: normal;
        font - weight: 900;
        src: url(${PoppinsBlackTtf}) format('truetype');
    }


`}
        />

    )

}
