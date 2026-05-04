/* eslint-disable prettier/prettier */
import { appConfig } from "./config/app.config";
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./modules/auth/auth.module";
import { BlogModule } from "./modules/blog/blog.module";
import { AdminModule } from "./modules/admin/admin.module";
import { UserModule } from "./modules/user/user.module";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";
import { ContactModule } from "./modules/contact/contact.module";
import { ProductModule } from "./modules/product/product.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ReviewModule } from "./modules/review/review.module";
import { NewsletterModule } from "./modules/newsletter/newsletter.module";
import { FaqModule } from "./modules/faq/faq.module";
import { ShippingDetailsModule } from "./modules/shipping-details/shipping-details.module";
import { CouponModule } from "./modules/coupon/coupon.module";
import { StaticPageModule } from "./modules/static-page/static-page.module";
import { WishlistModule } from "./modules/wishlist/wishlist.module";
import { CartModule } from "./modules/cart/cart.module";
import { FileSystemModule } from "./file-system/file-system.module";
import { ClientReviewsModule } from "./modules/client-reviews/client-reviews.module";
import { GalleryModule } from "./modules/gallery/gallery.module";
import { OverallReviewsModule } from "./overall-review/overall-reviews.module";
import { BannersModule } from "./modules/banners/banners.module";
import { HeroBannerModule } from "./modules/hero-banner/hero-banner.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { OrderModule } from "./modules/order/order.module";
import { SiteInfoModule } from "./modules/site-info/site-info.module";

@Module({
    imports: [
        PrismaModule,
        CacheModule.register(),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot(appConfig),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>("jwt.access_token_secret");
                if (!secret) {
                    throw new Error("JWT secret not found!");
                }
                return {
                    secret: secret,
                    signOptions: {
                        expiresIn: configService.get<any>("jwt.access_token_expiration"),
                    },
                };
            },
        }),
        NewsletterModule,
        FileSystemModule,
        AuthModule,
        UserModule,
        AdminModule,
        BannersModule,
        ContactModule,
        BlogModule,
        CategoriesModule,
        ShippingDetailsModule,
        CouponModule,
        ProductModule,
        WishlistModule,
        CartModule,
        ReviewModule,
        OverallReviewsModule,
        FaqModule,
        ClientReviewsModule,
        GalleryModule,
        StaticPageModule,
        HeroBannerModule,
        DashboardModule,
        OrderModule,
        SiteInfoModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
