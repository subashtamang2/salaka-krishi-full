import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { GalleryController } from "./gallery.controller";
import { GalleryService } from "./gallery.service";
import { GalleryRepo } from "./gallery.repo";

@Module({
imports: [PrismaModule],
controllers: [GalleryController],
providers: [GalleryService, GalleryRepo],
})
export class GalleryModule {}

