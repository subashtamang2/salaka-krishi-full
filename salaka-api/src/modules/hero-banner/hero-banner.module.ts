import { Module } from "@nestjs/common";
import { HeroBannerService } from "./hero-banner.service";
import { HeroBannerController } from "./hero-banner.controller";
import { HeroBannerRepository } from "./hero-banner.repository";

@Module({
  controllers: [HeroBannerController],
  providers: [HeroBannerService, HeroBannerRepository],
  exports: [HeroBannerService],
})
export class HeroBannerModule {}
